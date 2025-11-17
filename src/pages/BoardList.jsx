import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, query, onSnapshot, setLogLevel } from 'firebase/firestore';
import '../../css/BoardList.css'; // 👈 CSS 파일 경로가 맞는지 꼭 확인하세요!

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

export default function BoardList() {
    const navigate = useNavigate();
    const [db, setDb] = useState(null);
    const [userId, setUserId] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // 1. Firebase 초기화 (기존 로직 유지)
    useEffect(() => {
        setLogLevel('debug');
        try {
            const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
            setDb(getFirestore(app));
            const auth = getAuth(app);

            const handleAuth = async (authInstance) => {
                try {
                    initialAuthToken 
                        ? await signInWithCustomToken(authInstance, initialAuthToken)
                        : await signInAnonymously(authInstance);
                } catch (e) {
                    console.error("Auth Failed:", e);
                    await signInAnonymously(authInstance);
                }
            };

            const unsubscribe = onAuthStateChanged(auth, (user) => {
                user ? setUserId(user.uid) : handleAuth(auth);
            });

            // 3초 후에도 로딩 중이면 강제 해제
            const timeout = setTimeout(() => isLoading && setIsLoading(false), 3000);

            return () => { unsubscribe(); clearTimeout(timeout); };
        } catch (e) {
            console.error("Init Error:", e);
            setIsError(true);
            setIsLoading(false);
        }
    }, []);

    // 2. 데이터 로딩 (기존 로직 유지)
    useEffect(() => {
        if (!db || !userId) return;
        const q = query(collection(db, `/artifacts/${appId}/public/data/posts`));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // 날짜 최신순 정렬
            list.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0));
            setPosts(list);
            setIsLoading(false);
            setIsError(false);
        }, (err) => {
            console.error(err);
            setIsError(true);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [db, userId]);

    // 3. 검색 필터링
    const filteredPosts = searchTerm 
        ? posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || (p.content && p.content.toLowerCase().includes(searchTerm.toLowerCase())))
        : posts;

    // 날짜 포맷
    const formatDate = (ts) => ts ? new Date(ts.seconds * 1000).toLocaleDateString('ko-KR') : '날짜 없음';

    return (
        <div className="board-list-container">
            {/* 헤더 */}
            <header className="board-header">
                <h1>📝 Node.js 게시판</h1>
                <span className="user-status">
                    {userId ? `ID: ${userId.substring(0, 6)}...` : '연결 중...'}
                </span>
            </header>

            {/* 툴바 */}
            <div className="board-toolbar">
                <div className="search-box">
                    <input 
                        type="text" 
                        placeholder="검색어를 입력하세요..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="toolbar-actions">
                    <button className="btn btn-outline" onClick={() => navigate("/")}>🏠 홈</button>
                    <button className="btn btn-primary" onClick={() => navigate('/write')}>✏️ 글쓰기</button>
                </div>
            </div>

            {/* 게시글 목록 */}
            <div className="post-list-wrapper">
                {isLoading ? (
                    <div className="status-message">
                        데이터를 불러오고 있습니다... 🔄
                    </div>
                ) : isError ? (
                    <div className="status-message error">
                        데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="status-message">
                        {searchTerm ? '검색 결과가 없습니다.' : '아직 등록된 게시글이 없습니다.'}
                    </div>
                ) : (
                    filteredPosts.map(post => (
                        <article 
                            key={post.id} 
                            className="post-item-card" 
                            onClick={() => navigate(`/detail/${post.id}`)}
                        >
                            {/* 내용 영역 */}
                            <div className="post-content-area">
                                <div>
                                    <h2 className="post-title">{post.title}</h2>
                                    <p className="post-preview">
                                        {post.content || "내용이 없습니다."}
                                    </p>
                                </div>
                                <div className="post-meta">
                                    <span>{post.authorId ? post.authorId.substring(0, 8) : '익명'}</span>
                                    <span>•</span>
                                    <span>{formatDate(post.date)}</span>
                                </div>
                            </div>

                            {/* 썸네일 영역 */}
                            <div className="post-thumbnail">
                                {post.imageUrl ? (
                                    <img src={post.imageUrl} alt="썸네일" />
                                ) : (
                                    <span className="no-image-placeholder">NO IMAGE</span>
                                )}
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}