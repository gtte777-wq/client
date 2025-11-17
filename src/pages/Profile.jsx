import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Profile.css'; // 프로필 전용 CSS 파일을 임포트합니다.

export default function Profile() {
    const navigate = useNavigate();

    return (
        <div className="profile-page-background">
            <div className="profile-container">
                <div className="profile-info">
                    <h2 className="profile-title">
                        <span className="cat-icon-fallback">🐈‍⬛</span>
                        React & Node.js 프로젝트
                    </h2>
                    
                    <div className="profile-content">
                        <p>안녕하세요! 이 프로젝트는 React, Node.js, MySQL을 활용하여 제작된 게시판 애플리케이션입니다.</p>
                        <p>저는 이 프로젝트를 설계하고 개발한 개발자 <strong>[김국환]</strong>입니다.</p>
                        <p>기술 스택: <strong>React, Node.js, MySQL, CSS</strong></p>
                        <p>Email: example@email.com</p>
                    </div>
                    
                    {/* React Router의 navigate 함수를 사용하여 앱 내부에서 이동합니다. */}
                    <button onClick={() => navigate('/home')} className="nav-link">🚀 대시보드로 이동</button>
                </div>
            </div>
        </div>
    );
}