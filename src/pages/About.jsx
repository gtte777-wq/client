import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/About.css";
import CareerGraph from "../components/CareerGraph";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page-container">
      <header className="about-header">
        <h1>About Me & Project</h1>
        <button className="back-button" onClick={() => navigate("/")}>
          🏠 Home
        </button>
      </header>

      <main className="about-content">
        <section className="info-section">
          <h2>🚀 Career Path</h2>
          <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
            임상 현장에서의 꼼꼼함과 분석력을 바탕으로,
            <br />
            <strong>
              데이터 흐름을 설계하고 AI 가치를 연결하는 풀스택 개발자
            </strong>
            입니다.
          </p>
          <CareerGraph />
        </section>

        {/* 💡 1. 기술 스택 (기존 유지 + 강조) */}
        <section className="tech-section">
          <h2>🛠️ Tech Stack</h2>
          <ul>
            <li>React (Vite)</li>
            <li>Node.js (Hono)</li>
            <li>Python (FastAPI)</li>
            <li>Firebase / Firestore</li>
            <li>PyTorch (AI Modeling)</li>
            <li>RESTful API</li>
            <li>Git / GitHub</li>
          </ul>
        </section>

        {/* 💡 2. [New] 핵심 역량 & 아키텍처 (여기가 진짜 스펙!) */}
        <section className="info-section">
          <h2>🏗️ System Architecture & Key Features</h2>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
            <li style={{ marginBottom: "15px" }}>
              <strong>📡 MSA (Microservices Architecture) 지향 설계</strong>
              <br />
              <span style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>
                단일 서버에 의존하지 않고 <strong>Node.js(API Gateway)</strong>
                와 <strong>Python(AI Engine)</strong>을 분리 구축하여, 서비스의
                확장성과 유지보수성을 높였습니다. 프론트엔드(React)는 Node.js를
                통해 안전하게 AI 서버와 통신합니다.
              </span>
            </li>
            <li style={{ marginBottom: "15px" }}>
              <strong>⚡ 실시간 데이터 스트리밍 (Real-time Data)</strong>
              <br />
              <span style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>
                <strong>업비트(Upbit) API</strong> 및 <strong>RSS Feeds</strong>
                를 활용해 1초 단위로 데이터를 갱신하며, Polling 기법을
                최적화하여 사용자가 새로고침 없이도 살아있는 시세와 뉴스를
                경험할 수 있게 구현했습니다.
              </span>
            </li>
            <li style={{ marginBottom: "15px" }}>
              <strong>🎨 데이터 시각화 (Interactive Visualization)</strong>
              <br />
              <span style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>
                단순한 표 대신{" "}
                <strong>TradingView 엔진(Lightweight-charts)</strong>을
                도입하여, 캔들 차트, 거래량 분석, 줌인/아웃 등 전문가 수준의
                금융 데이터 시각화 경험을 제공합니다.
              </span>
            </li>
            <li>
              <strong>🛡️ CORS 및 프록시(Proxy) 해결</strong>
              <br />
              <span style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>
                서로 다른 도메인(Client ↔ Server ↔ External API) 간의 통신 보안
                정책(CORS)을 미들웨어 설정을 통해 완벽하게 제어하고 데이터
                파이프라인을 구축했습니다.
              </span>
            </li>
          </ul>
        </section>

        <section className="contact-section">
          <h2>📬 Contact</h2>
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <span>
              <strong>Email:</strong> goon422@naver.com
            </span>
            <span>
              <strong>Phone:</strong> 010-8481-5972
            </span>
            <span>
              <strong>Git:</strong> github.com/username
            </span>
          </div>
        </section>
      </main>

      <footer className="about-footer">
        <p>&copy; 2025 Kim Gook Hwan. All rights reserved.</p>
      </footer>
    </div>
  );
}
