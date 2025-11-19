import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Home.css";

export default function AIPage() {
  const navigate = useNavigate();

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
      id: "plant",
      icon: "🌿",
      title: "식물 종합 병원",
      description: "다양한 식물의 질병을 AI가 정밀하게 진단합니다.",
      path: "/ai/plant",
    },
    {
      id: "face",
      icon: "👤",
      title: "인물 신원 확인",
      description: "등록된 인물 DB에서 얼굴을 식별합니다.",
      path: "/ai/face",
    },
  ];

  return (
    <div className="home-page-background">
      <div className="home-content-container">
        {/* 1. 헤더 영역 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div>
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

          {/* 2. 버튼 그룹 (여기가 꼬였던 부분입니다! 깔끔하게 분리했습니다.) */}
          <div style={{ display: "flex", gap: "10px" }}>
            {/* 📋 기록 보기 버튼 */}
            <button
              onClick={() => navigate("/ai/history")}
              style={{
                padding: "12px 20px",
                borderRadius: "30px",
                border: "1px solid #c084fc",
                background: "rgba(192, 132, 252, 0.2)",
                color: "#e9d5ff",
                fontWeight: "bold",
                cursor: "pointer",
                backdropFilter: "blur(5px)",
              }}
            >
              📋 기록 보기
            </button>

            {/* ↩ 뒤로 가기 버튼 */}
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: "12px 20px",
                borderRadius: "30px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                backdropFilter: "blur(5px)",
              }}
            >
              ↩ 뒤로
            </button>

            {/* 🏠 홈 버튼 */}
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "12px 20px",
                borderRadius: "30px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                backdropFilter: "blur(5px)",
              }}
            >
              🏠 Home
            </button>
          </div>
        </div>

        {/* 3. 모델 리스트 그리드 */}
        <div className="feature-cards-grid">
          {aiModels.map((model, index) => (
            <div
              key={index}
              className="feature-card"
              onClick={() => navigate(model.path)}
              style={{
                cursor: "pointer",
                borderColor: "rgba(251, 191, 36, 0.3)",
              }}
            >
              <div
                className="feature-icon"
                style={{ fontSize: "3.5rem", marginBottom: "15px" }}
              >
                {model.icon}
              </div>
              <h3
                className="feature-title"
                style={{
                  color: "#fbbf24",
                  textShadow: "0 0 10px rgba(251, 191, 36, 0.4)",
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
