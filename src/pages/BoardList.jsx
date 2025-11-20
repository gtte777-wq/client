// src/components/BoardList.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx"; // 👈 Context API를 사용합니다.
import { getApp } from "firebase/app"; // Firebase 앱 인스턴스에 접근합니다.

import {
  getFirestore,
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";

import "../../css/BoardList.css";
import GoogleLoginBtn from "../components/GoogleLoginBtn";

// ⚠️ 참고: REAL_FIREBASE_CONFIG 같은 상세 설정은
// 이미 AuthContext.jsx로 옮겨졌어야 합니다.

// Firestore 데이터 경로 구성을 위해 남겨둡니다.
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

export default function BoardList() {
  const navigate = useNavigate();
  // 🔥 Context API에서 user, loading, logout을 가져옵니다.
  const { user: authUser, loading: isAuthLoading, logout } = useAuth();

  const [db, setDb] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 게시글 로딩 상태
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ---------------------------
  // 🔥 Firestore 초기화 (최초 1회)
  // ---------------------------
  useEffect(() => {
    try {
      // 이미 AuthProvider에서 초기화된 App 인스턴스를 사용합니다.
      const app = getApp();
      const dbInstance = getFirestore(app);
      setDb(dbInstance);
    } catch (e) {
      console.error("Firestore Init Error:", e);
      setIsError(true);
      setIsLoading(false);
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // ---------------------------
  // 🔥 Firestore 게시글 실시간 구독 (authUser 상태에 의존)
  // ---------------------------
  useEffect(() => {
    // DB 인스턴스 없거나, AuthContext가 아직 상태를 확인 중이면 리턴
    if (!db || isAuthLoading) return;

    // 로그인 안 한 경우 (authUser가 null)
    if (authUser === null) {
      setPosts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true); // 게시글 로딩 시작

    // 로그인된 경우 Firestore 접근
    const q = query(collection(db, `/artifacts/${appId}/public/data/posts`));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        list.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0));
        setPosts(list);
        setIsLoading(false);
      },
      (err) => {
        console.error("Firestore Error:", err);
        setIsError(true);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, authUser, isAuthLoading]); // db, user, 로딩 상태가 변할 때 재실행

  // ---------------------------
  // 검색 필터
  // ---------------------------
  const filteredPosts = searchTerm
    ? posts.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;

  const formatDate = (ts) =>
    ts ? new Date(ts.seconds * 1000).toLocaleString("ko-KR") : "날짜 없음";

  return (
    <div className="board-list-container">
      {/* --------------------------- */}
      {/* 🧩 헤더 (authUser 사용) */}
      {/* --------------------------- */}
      <header className="board-header">
        <h1>📝 Node.js 게시판</h1>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {/* ⭐ Context에서 가져온 authUser 사용 */}
          {authUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "0.9rem", color: "#e2e8f0" }}>
                👋 반가워요,
                <strong>{authUser.displayName ?? "사용자"}</strong>님!
              </span>

              <button
                // 👈 Context에서 가져온 logout 함수 사용
                onClick={logout}
                style={{
                  padding: "6px 12px",
                  borderRadius: "15px",
                  border: "1px solid #ef4444",
                  background: "rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                로그아웃
              </button>
            </div>
          ) : (
            // 로그아웃 상태일 때 로그인 버튼 표시
            <GoogleLoginBtn />
          )}

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            🏠 홈
          </button>
        </div>
      </header>

      {/* --------------------------- */}
      {/* 검색 + 버튼 */}
      {/* --------------------------- */}
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
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            ↩ 뒤로
          </button>

          {/* 로그인한 경우에만 글쓰기 가능 */}
          {authUser ? (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/write")}
            >
              ✏️ 글쓰기
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => alert("로그인해야 글쓰기 가능합니다.")}
            >
              🔒 글쓰기 (로그인 필요)
            </button>
          )}
        </div>
      </div>

      {/* --------------------------- */}
      {/* 게시글 목록 */}
      {/* --------------------------- */}
      <div className="post-list-wrapper">
        {/* 게시글 로딩 상태와 인증 로딩 상태를 분리해서 처리 */}
        {isAuthLoading ? (
          <div className="status-message">인증 상태를 확인 중입니다... 🔒</div>
        ) : isLoading ? (
          <div className="status-message">
            게시글 데이터를 불러오고 있습니다... 🔄
          </div>
        ) : isError ? (
          <div className="status-message">
            데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="status-message">
            {searchTerm
              ? "검색 결과가 없습니다."
              : authUser
              ? "아직 등록된 게시글이 없습니다."
              : "로그인해야 게시글을 볼 수 있습니다."}
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="post-item-card"
              onClick={() => navigate(`/detail/${post.id}`)}
            >
              <div className="post-content-area">
                <div>
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-preview">
                    {post.content || "내용이 없습니다."}
                  </p>
                </div>
                <div className="post-meta">
                  <span>
                    {post.authorId ? post.authorId.substring(0, 8) : "익명"}
                  </span>
                  <span>•</span>
                  <span>{formatDate(post.date)}</span>
                </div>
              </div>

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
