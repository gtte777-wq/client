import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    initializeApp, 
    getApps
} from 'firebase/app';
import { 
    getAuth, 
    signInAnonymously, 
    signInWithCustomToken,
    onAuthStateChanged
} from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    Timestamp,
    doc,
    updateDoc,
    setLogLevel
} from 'firebase/firestore';

// Firebase 전역 변수 설정 (변경하지 마세요)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const REAL_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBMupDsXUrSD_OlVVA4sXdSYoAF3eFMQ0M",
  authDomain: "hobby-b6440.firebaseapp.com",
  projectId: "hobby-b6440",
  storageBucket: "hobby-b6440.firebasestorage.app",
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
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null); 

    const isEditMode = !!postToEdit;
    
    useEffect(() => {
        if (postToEdit) {
            setTitle(postToEdit.title || '');
            setContent(postToEdit.content || '');
        }
    }, [postToEdit]);

    // Firebase 초기화 및 인증 로직
    useEffect(() => {
        setLogLevel('debug');
        try {
            // 중복 초기화 방지
            const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
            
            const firestoreDb = getFirestore(app);
            const firebaseAuth = getAuth(app);
            setDb(firestoreDb);
            setAuth(firebaseAuth);

            const handleAuth = async (authInstance) => {
                try {
                    if (initialAuthToken) {
                        await signInWithCustomToken(authInstance, initialAuthToken);
                    } else {
                        await signInAnonymously(authInstance);
                    }
                } catch (authError) {
                    console.error("Firebase Sign-In Error (Falling back to Anonymous):", authError);
                    await signInAnonymously(authInstance);
                }
            };

            const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
                setIsAuthReady(true);
                if (!user) {
                    handleAuth(firebaseAuth);
                }
            });
            return () => unsubscribe();

        } catch (error) {
            console.error("Firebase Initialization Error:", error);
            setMessage({ type: 'error', text: "Firebase 초기화 중 오류가 발생했습니다." });
        }
    }, []);

    // 메시지 초기화 타이머
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSaving) return;

        if (!isAuthReady || !db || !auth.currentUser) {
            setMessage({ type: 'error', text: "DB 연결 및 사용자 인증 대기 중입니다. 다시 시도해 주세요." });
            return;
        }

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle || !trimmedContent) {
            setMessage({ type: 'error', text: "제목과 내용을 모두 입력해주세요." });
            return;
        }

        setIsSaving(true);
        setMessage({ type: 'info', text: isEditMode ? "게시글 수정 중..." : "새 게시글 저장 중..." });

        try {
            const collectionPath = `/artifacts/${appId}/public/data/posts`;
            const currentUserId = auth.currentUser.uid;

            if (isEditMode) {
                const docRef = doc(db, collectionPath, postToEdit.id);
                await updateDoc(docRef, {
                    title: trimmedTitle,
                    content: trimmedContent,
                    updatedAt: Timestamp.now(),
                });
                setMessage({ type: 'success', text: "✅ 게시글 수정 완료!" });
            } else {
                const postData = {
                    title: trimmedTitle,
                    content: trimmedContent,
                    date: Timestamp.now(),
                    authorId: currentUserId,
                };
                await addDoc(collection(db, collectionPath), postData);
                setMessage({ type: 'success', text: "✅ 게시글 등록 성공!" });
            }

            setTimeout(() => {
                navigate('/board');
            }, 1500);

        } catch (error) {
            console.error("Firestore 작업 실패:", error);
            setMessage({ type: 'error', text: `게시글 ${isEditMode ? '수정' : '등록'}에 실패했습니다: ${error.message}` });
        } finally {
            setIsSaving(false);
        }
    };
    
    // UI 메시지 스타일 설정
    const getMessageClasses = () => {
        if (!message) return "";
        switch (message.type) {
            case 'success':
                return "bg-green-500 border-green-700";
            case 'error':
                return "bg-red-500 border-red-700";
            case 'info':
            default:
                return "bg-blue-500 border-blue-700";
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center font-sans">
            {/* Header (디자인 개선: 그라데이션) */}
            <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl p-4 flex justify-between items-center z-20">
                <h1 className="text-2xl font-extrabold tracking-tight">{isEditMode ? "게시글 수정" : "새 게시글 작성"}</h1>
                <button 
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-200 text-sm flex items-center"
                    onClick={() => navigate("/board")}
                >
                    ⬅️ 목록으로
                </button>
            </header>

            {/* 메시지 알림 (CSS 개선: 팝업 스타일) */}
            {message && (
                <div 
                    className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-30 p-4 rounded-xl shadow-2xl transition duration-500 ease-in-out border-b-4 ${getMessageClasses()}`}
                >
                    <p className="font-semibold text-white">{message.text}</p>
                </div>
            )}

            <main className="mt-28 w-full max-w-3xl p-4">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-8 border-b-2 border-indigo-100 pb-4 text-center">
                        {isEditMode ? "게시글 수정하기" : "새로운 글 작성"}
                    </h2>
                    
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">제목</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="주제를 명확하게 입력하세요"
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-lg transition duration-150 shadow-inner"
                            disabled={!isAuthReady || isSaving}
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="content" className="block text-sm font-bold text-gray-700 mb-2">내용</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="게시글 내용을 자유롭게 작성하세요..."
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-base min-h-[350px] resize-y transition duration-150 shadow-inner"
                            disabled={!isAuthReady || isSaving}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8">
                        <button 
                            type="button" 
                            onClick={() => navigate('/board')} 
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-full transition duration-200 shadow-lg hover:shadow-xl"
                            disabled={isSaving}
                        >
                            취소
                        </button>
                        <button 
                            type="submit" 
                            // 버튼 색상 및 활성화/비활성화 상태 개선
                            className={`font-bold py-3 px-6 rounded-full transition duration-200 shadow-lg hover:shadow-xl ${!isAuthReady || isSaving || !title.trim() || !content.trim() ? 
                                'bg-gray-200 text-gray-500 cursor-not-allowed' : 
                                (isEditMode ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white')
                            }`}
                            disabled={!isAuthReady || isSaving || !title.trim() || !content.trim()}
                        >
                            {isSaving ? '처리 중...' : (isEditMode ? "수정 완료 ✅" : "저장 💾")}
                        </button>
                    </div>
                    {!isAuthReady && <p className="text-center mt-4 text-sm text-red-500">인증 및 DB 연결 대기 중...</p>}
                </form>
            </main>
        </div>
    );
}

export default MemoUpsert;