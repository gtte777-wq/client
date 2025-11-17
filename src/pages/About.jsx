// src/pages/About.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/About.css"; // 새로운 CSS 파일 import

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page-container">
      <header className="about-header">
        <h1>프로젝트 소개 및 목표</h1>
        <button className="back-button" onClick={() => navigate("/board")}>
          ⬅️ 게시판으로 돌아가기
        </button>
      </header>

      <main className="about-content">
        <section className="info-section">
          <h2>개발 배경</h2>
          <p>
            이 프로젝트는 React 프론트엔드와 Node.js/MySQL 백엔드를 로컬
            환경에서 통합하여 풀스택 애플리케이션 개발 프로세스를 학습하기 위해
            시작되었습니다.
          </p>
          <p>
            특히 HTTP 요청 처리, MySQL 데이터베이스 연결, 그리고 React Router를
            사용한 SPA(Single Page Application) 라우팅 구현에 중점을 두었습니다.
          </p>
        </section>

        <section className="tech-section">
          <h2>주요 기술 스택</h2>
          <ul>
            <li>
              **프론트엔드:** React, React Router DOM, useState/useEffect Hooks
            </li>
            <li>
              **백엔드:** Node.js (Native HTTP Module), MySQL2/promise (DB 연결)
            </li>
            <li>**스타일링:** 순수 CSS (Header/Footer 디자인 개선 포함)</li>
          </ul>
        </section>

        <section className="contact-section">
          <h2>연락 및 기여</h2>
          <p>개발자: [사용자 이름]</p>
          <p>문의: contact@example.com</p>
        </section>
      </main>

      <footer className="about-footer">
        <p>&copy; 2024 Node.js Local Board Project.</p>
      </footer>
    </div>
  );
}
