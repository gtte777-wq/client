import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    initializeApp, 
    getApps,
} from 'firebase/app';
import { 
    getAuth, 
    signInAnonymously, 
    onAuthStateChanged, 
    signInWithCustomToken 
} from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    query, 
    onSnapshot, 
    setLogLevel 
} from 'firebase/firestore'; 

// Firebase 전역 변수 설정 (변경하지 마세요)
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


export default function BoardList() {
    const navigate = useNavigate();
    const [db, setDb] = useState(null);
    const [userId, setUserId] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    // 1. Firebase 초기화 및 인증 로직
    useEffect(() => {
        setLogLevel('debug');
        try {
            // 중복 초기화 방지
            const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
            
            const firestoreDb = getFirestore(app);
            const firebaseAuth = getAuth(app);
            setDb(firestoreDb);

            const handleAuth = async (authInstance) => {
                try {
                    if (initialAuthToken) {
                        await signInWithCustomToken(authInstance, initialAuthToken);
                    } else {
                        await signInAnonymously(authInstance);
                    }
                } catch (error) {
                    console.error("Firebase Sign-In Failed:", error);
                    await signInAnonymously(authInstance);
                }
            };

            const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    handleAuth(firebaseAuth);
                }
            });

            const loadingTimeout = setTimeout(() => {
                if (isLoading) {
                    console.warn("로딩 타임아웃: 로딩 상태를 강제 해제합니다.");
                    setIsLoading(false);
                }
            }, 3000);

            return () => {
                unsubscribeAuth();
                clearTimeout(loadingTimeout);
            };
        } catch (error) {
            console.error("Firebase Initialization Error:", error);
            setIsError(true);
            setIsLoading(false);
        }
    }, []);

    // 2. Firestore 데이터 실시간 로딩 로직
    useEffect(() => {
        if (!db || !userId) return;

        const postsCollectionPath = `/artifacts/${appId}/public/data/posts`;
        const q = query(collection(db, postsCollectionPath));

        console.log(`[Firestore] 데이터 로딩 시작: ${postsCollectionPath}`);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // 클라이언트 측에서 날짜 필드(date)를 기준으로 최신순 정렬
            fetchedPosts.sort((a, b) => {
                const dateA = a.date?.seconds * 1000 || 0; 
                const dateB = b.date?.seconds * 1000 || 0;
                return dateB - dateA; 
            });

            setPosts(fetchedPosts);
            setIsLoading(false);
            setIsError(false);
            console.log(`[Firestore] 게시글 ${fetchedPosts.length}개 로드 완료.`);
        }, (error) => {
            console.error("Firestore Snapshot Error:", error);
            setIsError(true);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [db, userId]);

    const handleWriteClick = () => {
        navigate('/write');
    };
    
    // 로딩 및 에러 메시지 렌더링
    const renderContent = () => {
        if (isError) {
            return (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-xl shadow-xl text-center mx-auto max-w-lg mt-10">
                    <p className="font-bold text-xl mb-2">❌ 데이터 로드 실패 ❌</p>
                    <p>데이터베이스 연결에 문제가 있습니다. F12 콘솔 창을 확인해 주세요.</p>
                </div>
            );
        }

        if (isLoading) {
            return (
                <div className="text-center p-6 mt-10 text-gray-400">
                    <p className="text-2xl animate-spin inline-block mr-2">🔄</p>
                    <p className="text-2xl inline-block">데이터 로딩 중...</p>
                </div>
            );
        }

        if (posts.length === 0) {
            return (
                <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-6 rounded-xl shadow-xl text-center mx-auto max-w-lg mt-10">
                    <p className="font-bold text-xl mb-2">게시글이 없습니다.</p>
                    <p>새 글 작성 버튼을 눌러 첫 게시글을 작성해 보세요!</p>
                </div>
            );
        }

        return posts.map(post => {
            const rawDate = post.date?.seconds ? post.date.seconds * 1000 : null;
            const displayDate = rawDate ? new Date(rawDate).toLocaleString('ko-KR') : '날짜 없음';
            const displayAuthor = post.authorId ? `${post.authorId.substring(0, 8)}...` : '알 수 없음';

            return (
                <div
                    key={post.id}
                    // CSS 개선: 그림자, 애니메이션, 호버 효과 추가
                    className="bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.01] transition duration-300 cursor-pointer flex justify-between items-center border border-gray-100"
                    onClick={() => navigate(`/detail/${post.id}`)}
                >
                    <div className="truncate pr-4">
                        <h2 className="text-xl font-semibold text-gray-900 truncate mb-1">{post.title}</h2>
                        <span className="text-sm text-gray-500 mt-1 block">
                            작성자: <span className="font-medium text-indigo-500">{displayAuthor}</span> | {displayDate}
                        </span>
                    </div>
                    <span className="text-indigo-600 font-bold text-lg flex-shrink-0 ml-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                </div>
            )
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            {/* Header (디자인 개선: 그라데이션, 그림자) */}
            <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl p-4 flex justify-between items-center z-10">
                <h1 className="text-2xl font-extrabold tracking-tight">📝 심플 게시판</h1>
                <div className="flex gap-3">
                    <button 
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-200 text-sm flex items-center"
                        onClick={() => navigate("/")}
                    >
                        🏠 홈
                    </button>
                    <button 
                        className="bg-green-400 hover:bg-green-500 text-gray-900 font-bold py-2 px-4 rounded-full shadow-lg transition duration-200 text-sm flex items-center"
                        onClick={handleWriteClick}
                    >
                        새 글 작성 ✨
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="mt-24 w-full max-w-3xl mx-auto p-4 flex flex-col gap-4">
                {userId && (
                    <div className="bg-white p-4 rounded-xl text-sm text-gray-600 shadow-lg border-l-4 border-indigo-500 mb-4 break-all">
                        <span className="font-bold">현재 사용자 ID:</span> <span className="font-mono text-indigo-700 break-words">{userId}</span>
                    </div>
                )}
                {renderContent()}
            </main>

            {/* Footer */}
            <footer className="w-full text-center p-6 text-gray-500 text-sm mt-auto border-t border-gray-200">
                <p>&copy; 2024 Simple Board App. All rights reserved.</p>
            </footer>
        </div>
    );
}