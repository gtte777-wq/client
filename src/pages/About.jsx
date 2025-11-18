import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/About.css"; // 🌌 우주 테마 CSS 적용
import CareerGraph from "../components/CareerGraph"; // 📊 경력 그래프 컴포넌트 import

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page-container">
      {/* 1. 헤더 */}
      <header className="about-header">
        <h1>About Me & Project</h1>
        <button className="back-button" onClick={() => navigate("/")}>
          🏠 Home
        </button>
      </header>

      <main className="about-content">
        {/* 2. 경력 그래프 섹션 (새로 추가된 기능) */}
        <section className="info-section">
          <h2>🚀 Career Path</h2>
          <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
            작업치료사로서의 꼼꼼한 임상 경험과 끈기를 바탕으로,
            <br />
            새로운 기술을 끊임없이 학습하는 개발자로 성장하고 있습니다.
          </p>
          {/* 여기에 아까 만든 그래프 컴포넌트가 들어갑니다 */}
          <CareerGraph />
        </section>

        {/* 3. 기술 스택 (CSS 그리드 적용을 위해 항목 분리) */}
        <section className="tech-section">
          <h2>🛠️ Tech Stack</h2>
          <ul>
            {/* 프론트엔드 */}
            <li>React</li>
            <li>React Router</li>
            <li>JavaScript (ES6+)</li>
            <li>CSS3 / Flexbox</li>

            {/* 백엔드 & DB (프로젝트 실제 사용 기술 반영) */}
            <li>Firebase Auth</li>
            <li>Firestore DB</li>
            <li>Node.js</li>

            {/* 도구 */}
            <li>Git & GitHub</li>
            <li>VS Code</li>
          </ul>
        </section>

        {/* 4. 프로젝트 개발 배경 (기존 내용 유지하되 스타일 적용) */}
        <section className="info-section">
          <h2>📝 Project Background</h2>
          <p>
            이 프로젝트는 <strong>React 프론트엔드</strong>와{" "}
            <strong>Firebase(Serverless)</strong>를 통합하여 현대적인 웹
            애플리케이션 개발 프로세스를 학습하기 위해 시작되었습니다.
          </p>
          <br />
          <p>
            특히 <strong>SPA(Single Page Application)</strong> 라우팅 구현,
            <strong>NoSQL 데이터베이스</strong> 설계, 그리고 사용자 경험(UX)을
            고려한
            <strong>반응형 디자인</strong> 구현에 중점을 두었습니다.
          </p>
        </section>

        {/* 5. 연락처 */}
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

      {/* 6. 푸터 */}
      <footer className="about-footer">
        <p>&copy; 2025 Kim Gook Hwan. All rights reserved.</p>
      </footer>
    </div>
  );
}
