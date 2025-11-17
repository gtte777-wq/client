import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore';

// import "../../css/BoardList.css"; // 🚨 CSS 파일 참조를 완전히 제거합니다.

// Firebase 전역 변수 설정
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

// Firebase 앱 인스턴스를 한 번만 생성하여 재사용
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function MemoDetail() {
    const navigate = useNavigate();
    const { postId } = useParams(); // URL 파라미터에서 postId 추출
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                        date: data.date ? data.date.toDate().toLocaleString('ko-KR') : '날짜 없음',
                    });
                } else {
                    setError("게시글을 찾을 수 없습니다.");
                }
            } catch (err) {
                console.error("Firestore 문서 조회 실패:", err);
                setError("게시글을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    // 🚀 수정 버튼 핸들러
    const handleEdit = () => {
        // 🚨 수정 페이지로 이동 시, 현재 게시글 데이터를 state로 전달
        navigate(`/write`, { 
            state: { postToEdit: post }
        });
    };

    // 🚀 삭제 버튼 핸들러
    const handleDelete = async () => {
        if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            try {
                const collectionPath = `/artifacts/${appId}/public/data/posts`;
                const docRef = doc(db, collectionPath, postId);
                await deleteDoc(docRef);
                alert("게시글이 삭제되었습니다."); // 🚨 삭제 후
                navigate("/board");
            } catch (error) {
                console.error("Firestore 문서 삭제 실패:", error);
                alert("게시글 삭제에 실패했습니다.");
            }
        }
    };

    // 🚨 인라인 스타일 객체 정의
    const styles = {
        container: {
            backgroundColor: '#22252a',
            minHeight: '100vh',
            color: '#fff',
            fontFamily: 'Arial, sans-serif',
        },
        header: {
            backgroundColor: 'rgba(26, 43, 60, 0.9)',
            padding: '20px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
        headerTitle: { margin: 0, fontSize: '1.8em' },
        actionButton: {
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
        },
        backButton: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#f0f0f0',
        },
        main: {
            maxWidth: '960px',
            margin: '40px auto',
            padding: '0 20px',
        },
        postCard: {
            backgroundColor: '#2c3138',
            borderRadius: '15px',
            padding: '40px',
        },
        postHeader: {
            borderBottom: '1px solid #444',
            paddingBottom: '20px',
            marginBottom: '20px',
        },
        postTitle: { fontSize: '2em', color: '#a9c1ff', margin: '0 0 10px 0' },
        postDate: { fontSize: '0.9em', color: '#8a93a2' },
        postContent: { fontSize: '1.1em', lineHeight: 1.7, color: '#c3cddc', whiteSpace: 'pre-wrap' },
        postActions: { display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'flex-end' },
        editButton: { backgroundColor: '#ffc107', color: '#333' },
        deleteButton: { backgroundColor: '#dc3545', color: 'white' },
        message: { textAlign: 'center', padding: '50px', fontSize: '1.2em' },
        footer: { textAlign: 'center', padding: '20px', color: '#8a93a2', fontSize: '0.9em' }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.headerTitle}>게시글 상세 내용</h1>
                <button style={{...styles.actionButton, ...styles.backButton}} onClick={() => navigate("/board")}>
                    목록으로 돌아가기
                </button>
            </header>

            <main style={styles.main}>
                {loading && <p style={styles.message}>게시글을 불러오는 중...</p>}
                {error && <p style={styles.message}>{error}</p>}
                {post && (
                    <div style={styles.postCard}>
                        <div style={styles.postHeader}>
                            <h2 style={styles.postTitle}>{post.title}</h2>
                            <span style={styles.postDate}>{post.date}</span>
                        </div>
                        <div>
                            <p style={styles.postContent}>{post.content}</p>
                        </div>
                        <div style={styles.postActions}>
                            <button style={{...styles.actionButton, ...styles.editButton}} onClick={handleEdit}>수정</button>
                            <button style={{...styles.actionButton, ...styles.deleteButton}} onClick={handleDelete}>삭제</button>
                        </div>
                    </div>
                )}
            </main>

            <footer style={styles.footer}>
                <p>&copy; 2024 Simple Board App. Powered by Firestore.</p>
            </footer>
        </div>
    );
}