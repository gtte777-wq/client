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
        <div style={{ display: "flex", gap: "10px" }}>
          {/* 🚨 [UX Patch] 뒤로 가기 추가 */}
          <button className="back-button" onClick={() => navigate(-1)}>
            ↩ Back
          </button>
          <button className="back-button" onClick={() => navigate("/")}>
            🏠 Home
          </button>
        </div>
      </header>

      <main className="about-content">
        <section className="info-section">
          <h2>🚀 Career Path</h2>
          <p
            style={{
              marginBottom: "20px",
              lineHeight: "1.6",
              color: "#e2e8f0",
            }}
          >
            작업치료사로서의 섬세한 관찰력과 끈기를 바탕으로,
            <br />
            <strong>
              AI 기술과 웹을 연결하여 실질적인 가치를 창출하는 풀스택 개발자
            </strong>
            입니다.
          </p>
          <CareerGraph />
        </section>

        <section className="tech-section">
          <h2>🛠️ Technologies Used</h2>
          <ul>
            <li>React (Vite)</li>
            <li>Lightweight-charts</li>
            <li>CSS3 / Flexbox</li>
            <li>Node.js (Hono)</li>
            <li>RESTful API</li>
            <li>RSS Parsing</li>
            <li>Python (FastAPI)</li>
            <li>PyTorch (Deep Learning)</li>
            <li>InsightFace (ArcFace)</li>
            <li>FAISS (Vector Search)</li>
            <li>Git & GitHub</li>
            <li>Firebase (Authentication, Firestore)</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>🏗️ System Architecture & Key Features</h2>
          <ul
            style={{ paddingLeft: "20px", lineHeight: "1.8", color: "#cbd5e1" }}
          >
            {/* ⭐ 오늘 추가된 게시판 기능 관련 항목 ⭐ */}
            <li style={{ marginBottom: "20px" }}>
              <strong style={{ color: "#34d399", fontSize: "1.1rem" }}>
                📝 Full-Stack Forum/Board Implementation
              </strong>
              <br />
              <span>
                **Firebase Firestore**를 활용하여 게시글의 **실시간
                구독(onSnapshot)** 및 정렬 기능을 구현했습니다. **Context
                API**를 통해 로그인 상태를 전역으로 관리하며, **Google OAuth**를
                이용한 인증을 통해 사용자별 글쓰기 권한을 제어합니다.
              </span>
            </li>
            {/* ----------------------------------- */}

            <li style={{ marginBottom: "20px" }}>
              <strong style={{ color: "#fbbf24", fontSize: "1.1rem" }}>
                🤖 AI Vision Lab (End-to-End Pipeline)
              </strong>
              <br />
              <span>
                Python **FastAPI** 서버를 구축하여 React와 연동했습니다.
                EfficientNet-B0를 활용한 이미지 분류 및 InsightFace/FAISS 기반의
                실시간 얼굴 식별 시스템을 구현했습니다.
              </span>
            </li>
            <li style={{ marginBottom: "20px" }}>
              <strong style={{ color: "#3b82f6", fontSize: "1.1rem" }}>
                📈 Financial Data Visualization
              </strong>
              <br />
              <span>
                **업비트(Upbit) 실시간 API**와 **Lightweight-charts**를 연동하여
                1초 단위의 캔들 차트 및 거래량 분석 기능을 구현했습니다.
              </span>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#34d399", fontSize: "1.1rem" }}>
                📡 Real-time News Aggregator
              </strong>
              <br />
              <span>
                Node.js 백엔드에서 **RSS Parser**를 활용해 글로벌 뉴스 데이터를
                실시간 수집 및 필터링합니다.
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
              <strong>Git:</strong> github.com/gtte777-wq
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
