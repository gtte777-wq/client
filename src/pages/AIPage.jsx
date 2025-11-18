import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Home.css"; // 기존 디자인 재사용 (우주 테마)

export default function AIPage() {
  const navigate = useNavigate();

  // 🤖 AI 모델 목록
  const aiModels = [
    {
      id: "muffin",
      icon: "🐶 vs 🧁",
      title: "머핀 vs 치와와",
      description: "이 사진이 강아지일까요, 빵일까요? AI가 구분해드립니다.",
      path: "/ai/muffin",
    },
    {
      id: "rice",
      icon: "🌾",
      title: "벼 병해충 진단",
      description:
        "정상 벼와 병든 벼(도열병 등)를 분류하여 농작물을 보호합니다.",
      path: "/ai/rice",
    },
    {
      id: "coming-soon",
      icon: "🚀",
      title: "준비 중...",
      description: "더 놀라운 AI 모델들이 추가될 예정입니다.",
      path: "#",
    },
  ];

  return (
    <div className="home-page-background">
      {" "}
      {/* 우주 배경 */}
      <div className="home-content-container">
        {/* 헤더 영역 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div>
            {/* 헤더 타이틀도 별빛 색상으로 변경 */}
            <h1
              className="home-title"
              style={{
                margin: 0,
                fontSize: "2.2rem",
                color: "#fbbf24",
                textShadow: "0 0 15px rgba(251, 191, 36, 0.6)",
              }}
            >
              🤖 AI Vision Lab
            </h1>
            <p
              className="home-subtitle"
              style={{ margin: "10px 0 0 0", color: "#d1d5db" }}
            >
              딥러닝 모델을 활용한 이미지 분석 체험관
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              borderRadius: "30px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              backdropFilter: "blur(5px)",
              transition: "0.3s",
            }}
          >
            🏠 Home
          </button>
        </div>

        {/* 모델 리스트 그리드 */}
        <div className="feature-cards-grid">
          {aiModels.map((model, index) => (
            <div
              key={index}
              className="feature-card"
              onClick={() => model.path !== "#" && navigate(model.path)}
              style={{
                cursor: model.path === "#" ? "default" : "pointer",
                opacity: model.path === "#" ? 0.7 : 1,
                borderColor:
                  model.path === "#"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(251, 191, 36, 0.3)", // 카드 테두리도 은은한 골드
              }}
            >
              <div
                className="feature-icon"
                style={{ fontSize: "3.5rem", marginBottom: "15px" }}
              >
                {model.icon}
              </div>

              {/* 🌟 수정된 부분: 텍스트를 노란색(Star Gold)으로 변경 */}
              <h3
                className="feature-title"
                style={{
                  color: "#fbbf24", // 밝은 앰버(Amber/Gold) 색상
                  textShadow: "0 0 10px rgba(251, 191, 36, 0.4)", // 별처럼 빛나는 효과 (Glow)
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {model.title}
              </h3>

              <p className="feature-description" style={{ color: "#e5e7eb" }}>
                {model.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
