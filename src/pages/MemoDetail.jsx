import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore';
import '../../css/MemoDetail.css'; // 👈 새로 만든 CSS 파일을 임포트

// Firebase 전역 변수 설정 (기존과 동일)
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

// Firebase 앱 인스턴스를 한 번만 생성
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function MemoDetail() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🚨 UX 개선을 위한 상태 추가
    const [message, setMessage] = useState(null); // 팝업 메시지
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false); // 삭제 확인 UI
    const [isDeleting, setIsDeleting] = useState(false); // 삭제 처리 중

    // 데이터 로딩 (기존 로직 유지)
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const collectionPath = `/artifacts/${appId}/public/data/posts`;
                const docRef = doc(db, collectionPath, postId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPost({
                        id: docSnap.id,
                        title: data.title,
                        content: data.content,
                        // 🚨 수정 페이지로 원본 데이터를 넘기기 위해 원본(raw) 데이터도 보관
                        ...data 
                    });
                } else {
                    setError("게시글을 찾을 수 없습니다.");
                }
            } catch (err) {
                console.error("Firestore Error:", err);
                setError("게시글 로딩 중 오류 발생.");
            } finally {
                setLoading(false);
            }
        };
        if (postId) fetchPost();
    }, [postId]);

    // 메시지 타이머
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 2500);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // 수정 버튼 핸들러 (기존 로직 유지)
    const handleEdit = () => {
        navigate(`/write`, { 
            state: { postToEdit: post } // postToEdit에 원본 post 데이터 전달
        });
    };

    // 🚨 1. "삭제" 버튼 첫 클릭 시
    const handleDeleteClick = () => {
        setIsConfirmingDelete(true); // 확인 UI 표시
    };

    // 🚨 2. "삭제 취소" 클릭 시
    const handleCancelDelete = () => {
        setIsConfirmingDelete(false); // 확인 UI 숨김
    };

    // 🚨 3. "확인" (진짜 삭제) 클릭 시
    const handleConfirmDelete = async () => {
        setIsDeleting(true); // 버튼 비활성화
        try {
            const collectionPath = `/artifacts/${appId}/public/data/posts`;
            const docRef = doc(db, collectionPath, postId);
            await deleteDoc(docRef);
            
            setMessage({ type: 'success', text: "게시글이 삭제되었습니다." }); // alert 대신 메시지
            
            setTimeout(() => {
                navigate("/board"); // 1.5초 후 목록으로
            }, 1500);

        } catch (error) {
            console.error("Firestore Error:", error);
            setMessage({ type: 'error', text: "삭제에 실패했습니다." });
            setIsDeleting(false); // 실패 시 버튼 활성화
        }
    };
    
    const getMsgClass = () => {
        return message.type === 'success' ? 'msg-success' : 'msg-error';
    };

    return (
        <div className="memo-detail-container">
            {/* 팝업 메시지 (성공/실패 알림) */}
            {message && (
                <div className={`message-popup ${getMsgClass()}`}>
                    {message.text}
                </div>
            )}
            
            <header className="memo-detail-header">
                <h1>게시글 상세 내용</h1>
                <button className="back-to-board-btn" onClick={() => navigate("/board")}>
                    목록으로 돌아가기
                </button>
            </header>

            <main className="memo-detail-main">
                {loading && <div className="message-container">게시글을 불러오는 중... 🔄</div>}
                {error && <div className="message-container">{error}</div>}
                {post && (
                    <div className="post-content-card">
                        {/* 썸네일 이미지 (있을 경우에만 표시) */}
                        {post.imageUrl && (
                            <img src={post.imageUrl} alt="Post Thumbnail" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                        )}
                        
                        <div className="post-header-section">
                            <h2 className="post-title">{post.title}</h2>
                            <span className="post-date">
                                {post.date ? new Date(post.date.seconds * 1000).toLocaleString('ko-KR') : '날짜 없음'}
                            </span>
                        </div>
                        
                        <div className="post-body-section">
                            {/* white-space: pre-wrap을 위해 p태그 사용 */}
                            <p className="post-content-text">{post.content}</p>
                        </div>

                        {/* 🚨 삭제 확인 UI가 아닐 때만 "수정/삭제" 버튼 표시 */}
                        {!isConfirmingDelete && (
                            <div className="post-actions-section">
                                <button className="action-btn edit-btn" onClick={handleEdit}>수정</button>
                                <button className="action-btn delete-btn" onClick={handleDeleteClick}>삭제</button>
                            </div>
                        )}

                        {/* 🚨 "삭제" 버튼을 눌렀을 때 표시되는 UI */}
                        {isConfirmingDelete && (
                            <div className="delete-confirmation">
                                <p className="confirmation-text">정말로 이 게시글을 삭제하시겠습니까?</p>
                                <div className="confirmation-actions">
                                    <button 
                                        className="action-btn" 
                                        style={{ backgroundColor: '#9ca3af' }} 
                                        onClick={handleCancelDelete}
                                        disabled={isDeleting}
                                    >
                                        취소
                                    </button>
                                    <button 
                                        className="action-btn delete-btn" 
                                        onClick={handleConfirmDelete}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? "삭제 중..." : "예, 삭제합니다"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <footer className="memo-detail-footer">
                <p>&copy; 2024 Simple Board App. Powered by Firestore.</p>
            </footer>
        </div>
    );
}