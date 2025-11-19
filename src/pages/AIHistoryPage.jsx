import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import "../../css/Home.css"; // 우주 테마 재사용

export default function AIHistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 'ai_history' 컬렉션에서 최신순(desc)으로 가져오기
    const q = query(collection(db, "ai_history"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  return (
    <div className="home-page-background">
      <div className="home-content-container" style={{ maxWidth: "800px" }}>
        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <h1
            className="home-title"
            style={{ fontSize: "1.8rem", color: "#c084fc", margin: 0 }}
          >
            📋 AI 진단 기록실
          </h1>
          <button
            onClick={() => navigate("/ai")}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              cursor: "pointer",
            }}
          >
            ↩ AI 메뉴로
          </button>
        </div>

        {/* 리스트 영역 */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            borderRadius: "15px",
            padding: "20px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {loading ? (
            <p style={{ color: "#ccc", textAlign: "center" }}>
              기록 불러오는 중... 🔄
            </p>
          ) : history.length === 0 ? (
            <p style={{ color: "#ccc", textAlign: "center" }}>
              아직 진단 기록이 없습니다.
            </p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                color: "white",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                    color: "#9ca3af",
                  }}
                >
                  <th style={{ padding: "10px", textAlign: "left" }}>날짜</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>
                    모델 종류
                  </th>
                  <th style={{ padding: "10px", textAlign: "left" }}>
                    진단 결과
                  </th>
                  <th style={{ padding: "10px", textAlign: "right" }}>
                    신뢰도
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <td
                      style={{
                        padding: "12px 10px",
                        fontSize: "0.9rem",
                        color: "#cbd5e1",
                      }}
                    >
                      {formatDate(item.timestamp)}
                    </td>
                    <td
                      style={{
                        padding: "12px 10px",
                        fontWeight: "bold",
                        color: "#fbbf24",
                      }}
                    >
                      {item.modelType}
                    </td>
                    <td style={{ padding: "12px 10px", fontSize: "1.1rem" }}>
                      {item.label}
                    </td>
                    <td
                      style={{
                        padding: "12px 10px",
                        textAlign: "right",
                        color: "#34d399",
                      }}
                    >
                      {item.confidence ? item.confidence.toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
