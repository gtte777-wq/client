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
            <li>HTML5 Canvas</li> {/* 게임 때문에 추가됨 */}
            <li>Python (FastAPI)</li>
            <li>TensorFlow (LSTM)</li> {/* 주식 때문에 추가됨 */}
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
            {/* 1. 마이크로서비스 아키텍처 (오늘의 하이라이트) */}
            <li style={{ marginBottom: "20px" }}>
              <strong style={{ color: "#a78bfa", fontSize: "1.1rem" }}>
                🕸️ Microservices & AI Pipeline Integration
              </strong>
              <br />
              <span>
                Node.js를 **API Gateway**로, Python을 **AI Inference Server**로 분리하여 구축했습니다. 
                FastAPI를 통해 5종의 AI 모델(주식, 얼굴, 사물 등)을 메모리에 상주시킴으로써 
                **Cold Start 없는 초고속 응답 속도**를 구현했습니다.
              </span>
            </li>

            {/* 2. 주식 AI 예측 */}
            <li style={{ marginBottom: "20px" }}>
              <strong style={{ color: "#f472b6", fontSize: "1.1rem" }}>
                🔮 AI-Driven Stock Prediction
              </strong>
              <br />
              <span>
                **TensorFlow LSTM** 모델을 활용하여 과거 차트 데이터를 학습하고, 
                뉴스 데이터의 감성 분석(Sentiment Analysis)을 결합하여 미래 주가를 예측하는 
                하이브리드 분석 시스템을 개발했습니다.
              </span>
            </li>

            {/* 3. 게시판 기능 */}
            <li style={{ marginBottom: "20px" }}>
              <strong style={{ color: "#34d399", fontSize: "1.1rem" }}>
                📝 Full-Stack Forum/Board Implementation
              </strong>
              <br />
              <span>
                **Firebase Firestore**를 활용하여 게시글의 **실시간 구독(onSnapshot)** 및 정렬 기능을 구현했습니다. 
                **Context API**와 **Google OAuth**를 통해 사용자 인증 및 권한 관리를 처리합니다.
              </span>
            </li>

            {/* 4. AI Vision Lab */}
            <li style={{ marginBottom: "20px" }}>
              <strong style={{ color: "#fbbf24", fontSize: "1.1rem" }}>
                🤖 AI Vision Lab (End-to-End Pipeline)
              </strong>
              <br />
              <span>
                EfficientNet-B0를 활용한 이미지 분류(병해충, 사물) 및 **InsightFace/FAISS** 기반의 
                실시간 인물 신원 확인 시스템을 구축했습니다. Node.js가 이미지 전처리를 담당하고 Python이 추론을 수행합니다.
              </span>
            </li>

            {/* 5. 웹 게임 (오늘 추가됨) */}
            <li style={{ marginBottom: "20px" }}>
              <strong style={{ color: "#fbbf24", fontSize: "1.1rem" }}>
                🎮 Interactive Web Game (Canvas API)
              </strong>
              <br />
              <span>
                React와 **HTML5 Canvas**를 활용하여 '뱀파이어 서바이벌' 스타일의 웹 게임을 직접 구현했습니다. 
                충돌 감지, 오브젝트 풀링, 레벨업 시스템 등 게임 엔진의 핵심 로직을 최적화하여 설계했습니다.
              </span>
            </li>

            {/* 6. 금융 데이터 */}
            <li style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#3b82f6", fontSize: "1.1rem" }}>
                📈 Financial Data Visualization
              </strong>
              <br />
              <span>
                **업비트(Upbit) & 한국투자증권 API**와 **Lightweight-charts**를 연동하여 
                실시간 시세 캔들 차트 및 자동매매 봇(Trading Bot) 기능을 구현했습니다.
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