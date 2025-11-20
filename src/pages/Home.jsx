import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Home.css";
import WeatherWidget from "../components/WeatherWidget";

export default function Home() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: "🤖",
      title: "AI Vision Lab",
      description: "이미지 분류, 병해충 진단, 인물 식별 등 AI 체험관",
      path: "/ai",
    },
    {
      icon: "📈",
      title: "주식 차트",
      description: "업비트 실시간 시세와 전문가용 캔들 차트 분석",
      path: "/stock",
    },
    {
      icon: "📰",
      title: "뉴스 필터링",
      description: "실시간 글로벌 뉴스 수집 및 키워드 필터링",
      path: "/news",
    },
    {
      icon: "📝",
      title: "게시판",
      description: "자유롭게 글을 작성하고 소통하는 공간",
      path: "/board",
    },
    {
      icon: "🧮",
      title: "계산기",
      description: "계산 과정을 보여주는 우주 테마 계산기",
      path: "/calculator",
    },
    {
      icon: "📚",
      title: "프로젝트 소개",
      description: "개발자 포트폴리오 및 기술 스택 아키텍처",
      path: "/about",
    },
  ];

  return (
    <div className="home-page-background">
      <div className="home-content-container" style={{ position: "relative" }}>
        {/* 🌤️ 상단 정보창 (위치 수정됨) */}
        <div
          style={{
            /* 🚨 수정: 위치를 오른쪽 끝에 딱 붙이지 않고 여유를 둠 */
            position: "absolute",
            top: "20px",
            right: "20px",
            display: "flex",
            gap: "15px",
            alignItems: "center",
            zIndex: 10,
            /* 모바일 등 화면이 작아질 때를 대비해 최대 너비 제한 */
            maxWidth: "100%",
            justifyContent: "flex-end",
          }}
        >
          <WeatherWidget />

          <div
            style={{
              color: "#fbbf24",
              fontSize: "1.1rem",
              fontWeight: "bold",
              background: "rgba(0,0,0,0.6)",
              padding: "10px 20px",
              borderRadius: "20px",
              border: "1px solid rgba(251, 191, 36, 0.3)",
              backdropFilter: "blur(5px)",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              minHeight: "54px",
              whiteSpace: "nowrap",
            }}
          >
            🕒 {currentTime}
          </div>
        </div>

        {/* 🚨 수정: 제목을 아래로 100px 밀어서 위젯과 겹치지 않게 함 */}
        <div style={{ marginTop: "100px" }}>
          <h1 className="home-title">🌌 React Space Dashboard</h1>
          <p className="home-subtitle">
            AI 기술과 웹 개발의 만남, 다양한 기능을 탐험해보세요.
          </p>
        </div>

        <div className="feature-cards-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              onClick={() => navigate(feature.path)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
