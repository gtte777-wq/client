import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, Timestamp, doc, updateDoc, setLogLevel } from 'firebase/firestore';
import '../../css/MemoUpsert.css'; // 👈 경로 확인해 주세요! (상위 폴더 css/MemoUpsert.css)

// Firebase 설정 (기존 유지)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const REAL_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBMupDsXUrSD_OlVVA4sXdSYoAF3eFMQ0M",
  authDomain: "hobby-b6440.firebaseapp.com",
  projectId: "hobby-b6440",
  storageBucket: "hobby-b6440.firebaseapp.com",
  messagingSenderId: "545763773120",
  appId: "1:545763773120:web:db79b30420ccae2fe87b25",
  measurementId: "G-R5CBNBY2G4"
};
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : REAL_FIREBASE_CONFIG;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const MemoUpsert = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const postToEdit = location.state?.postToEdit;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState(""); // 이미지 URL 상태

    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null); 
    const isEditMode = !!postToEdit;
    
    // 수정 모드일 때 데이터 불러오기
    useEffect(() => {
        if (postToEdit) {
            setTitle(postToEdit.title || '');
            setContent(postToEdit.content || '');
            setImageUrl(postToEdit.imageUrl || '');
        }
    }, [postToEdit]);

    // Firebase 초기화
    useEffect(() => {
        setLogLevel('debug');
        try {
            const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
            setDb(getFirestore(app));
            setAuth(getAuth(app));
            const handleAuth = async (ai) => {
                try { initialAuthToken ? await signInWithCustomToken(ai, initialAuthToken) : await signInAnonymously(ai); }
                catch (e) { await signInAnonymously(ai); }
            };
            const unsub = onAuthStateChanged(getAuth(app), (u) => { setIsAuthReady(true); if (!u) handleAuth(getAuth(app)); });
            return () => unsub();
        } catch (e) { setMessage({ type: 'error', text: "초기화 오류" }); }
    }, []);

    // 메시지 타이머
    useEffect(() => {
        if (message) { const t = setTimeout(() => setMessage(null), 3000); return () => clearTimeout(t); }
    }, [message]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSaving || !isAuthReady || !db || !auth.currentUser) return;

        const tTitle = title.trim();
        const tContent = content.trim();
        const tImage = imageUrl.trim();

        if (!tTitle || !tContent) { setMessage({ type: 'error', text: "제목과 내용을 입력해주세요." }); return; }

        setIsSaving(true);
        setMessage({ type: 'info', text: isEditMode ? "수정 중..." : "저장 중..." });

        try {
            const path = `/artifacts/${appId}/public/data/posts`;
            if (isEditMode) {
                await updateDoc(doc(db, path, postToEdit.id), { title: tTitle, content: tContent, imageUrl: tImage, updatedAt: Timestamp.now() });
                setMessage({ type: 'success', text: "수정 완료!" });
            } else {
                await addDoc(collection(db, path), { title: tTitle, content: tContent, imageUrl: tImage, date: Timestamp.now(), authorId: auth.currentUser.uid });
                setMessage({ type: 'success', text: "등록 성공!" });
            }
            setTimeout(() => navigate('/board'), 1500);
        } catch (err) {
            setMessage({ type: 'error', text: "저장 실패" });
        } finally { setIsSaving(false); }
    };
    
    const getMsgClass = () => {
        if (!message) return "";
        return message.type === 'success' ? 'msg-success' : message.type === 'error' ? 'msg-error' : 'msg-info';
    };
    
    return (
        <div className="memo-upsert-container">
            {/* 헤더 */}
            <header className="memo-upsert-header">
                <h1>{isEditMode ? "게시글 수정" : "새 글 작성"}</h1>
                <button className="back-to-board" onClick={() => navigate("/board")}>
                    목록으로
                </button>
            </header>

            {/* 알림 메시지 */}
            {message && (
                <div className={`message-popup ${getMsgClass()}`}>
                    {message.text}
                </div>
            )}

            {/* 입력 폼 */}
            <form className="memo-form" onSubmit={handleSubmit}>
                <h2 className="form-title">{isEditMode ? "📝 글 수정하기" : "✨ 새 글 쓰기"}</h2>
                
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        disabled={isSaving}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="imageUrl">썸네일 이미지 URL <span className="sub-text">(선택)</span></label>
                    <input
                        id="imageUrl"
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://..."
                        disabled={isSaving}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요..."
                        disabled={isSaving}
                    />
                </div>
                
                <div className="form-actions">
                    <button 
                        type="button" 
                        className="action-btn cancel-button"
                        onClick={() => navigate('/board')}
                        disabled={isSaving}
                    >
                        취소
                    </button>
                    <button 
                        type="submit" 
                        className="action-btn submit-button"
                        disabled={!isAuthReady || isSaving || !title.trim() || !content.trim()}
                    >
                        {isSaving ? '저장 중...' : (isEditMode ? "수정 완료" : "등록하기")}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default MemoUpsert;