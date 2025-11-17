import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Home.css'; // 홈 페이지 전용 CSS를 다시 사용합니다.

export default function Home() {
    const navigate = useNavigate();

    // 각 기능에 대한 정보를 배열로 관리합니다.
    const features = [
        {
            icon: '📝',
            title: '게시판',
            description: '자유롭게 글을 작성하고 공유하는 공간입니다.',
            path: '/board'
        },
        {
            icon: '📰',
            title: '뉴스 필터링',
            description: '다양한 뉴스를 키워드로 검색하고 필터링합니다.',
            path: '/news'
        },
        {
            icon: '🧮',
            title: '계산기',
            description: '간단한 사칙연산을 할 수 있는 계산기입니다.',
            path: '/calculator'
        },
        {
            icon: '📚',
            title: '프로젝트 소개',
            description: '이 프로젝트의 개발 배경과 기술 스택을 확인합니다.',
            path: '/about'
        }
    ];

    return (
        <div className="home-page-background">
            <div className="home-content-container">
                <h1 className="home-title">React 프로젝트 대시보드</h1>
                <p className="home-subtitle">아래 카드 메뉴를 통해 다양한 기능을 체험해 보세요.</p>
                <div className="feature-cards-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card" onClick={() => navigate(feature.path)}>
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