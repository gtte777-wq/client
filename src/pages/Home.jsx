import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Home.css";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🤖", // AI 아이콘
      title: "AI Vision Lab",
      description:
        "머핀/치와와 분류, 농작물 병해충 진단 등 AI 이미지 분석을 체험합니다.",
      path: "/ai", // AI 메뉴판으로 이동
    },
    {
      icon: "📝",
      title: "게시판",
      description: "자유롭게 글을 작성하고 공유하는 공간입니다.",
      path: "/board",
    },
    {
      icon: "📰",
      title: "뉴스 필터링",
      description: "다양한 뉴스를 키워드로 검색하고 필터링합니다.",
      path: "/news",
    },
    {
      icon: "📈",
      title: "주식 차트",
      description: "실시간 주가 흐름을 차트로 확인하고 분석합니다.",
      path: "/stock",
    },
    {
      icon: "🧮",
      title: "계산기",
      description: "간단한 사칙연산을 할 수 있는 계산기입니다.",
      path: "/calculator",
    },
    {
      icon: "📚",
      title: "프로젝트 소개",
      description: "이 프로젝트의 개발 배경과 기술 스택을 확인합니다.",
      path: "/about",
    },
  ];

  return (
    <div className="home-page-background">
      <div className="home-content-container">
        <h1 className="home-title">🌌 React Space Dashboard</h1>
        <p className="home-subtitle">
          AI 기술과 웹 개발의 만남, 다양한 기능을 탐험해보세요.
        </p>
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
