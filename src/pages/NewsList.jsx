import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/NewsList.css"; // CSS 파일 경로

// ===============================================
// 💡 1. 가상 뉴스 데이터 (Mock Data) 정의
// ===============================================
const MOCK_NEWS_DATA = [
  {
    id: 1,
    title: "[경제] 삼성, AI칩 대량 생산 돌입... 메모리 시장 '빅사이클' 기대",
    category: "경제",
    date: "2024-11-13",
  },
  {
    id: 2,
    title: "[IT] React v19, 새로운 훅 공개... 개발자 생산성 향상 기대",
    category: "IT/기술",
    date: "2024-11-13",
  },
  {
    id: 3,
    title: "[스포츠] 대한민국 축구, 아시안컵 예선 3연승으로 조 1위 확정",
    category: "스포츠",
    date: "2024-11-12",
  },
  {
    id: 4,
    title: "[IT] 구글, 차세대 퀀텀 컴퓨팅 기술 발표... 연산 속도 획기적 개선",
    category: "IT/기술",
    date: "2024-11-12",
  },
  {
    id: 5,
    title: "[경제] 엔화 가치 급등, 국내 수출 기업에 비상... 환율 변동성 확대",
    category: "경제",
    date: "2024-11-11",
  },
  {
    id: 6,
    title: "[사회] 전국 미세먼지 농도 '매우 나쁨', 외출 자제 당부",
    category: "사회",
    date: "2024-11-11",
  },
  {
    id: 7,
    title: "[경제] 비트코인 8천만 원 돌파, 암호화폐 시장 '불마켓' 진입하나",
    category: "경제",
    date: "2024-11-10",
  },
  {
    id: 8,
    title: "[IT] 애플, 폴더블 아이폰 특허 출원... 2025년 출시 목표",
    category: "IT/기술",
    date: "2024-11-10",
  },
];

export default function NewsList() {
  const navigate = useNavigate();
  // 💡 2. 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  // 💡 3. 필터링된 목록을 관리
  const [filteredNews, setFilteredNews] = useState(MOCK_NEWS_DATA);

  // ===============================================
  // 💡 4. 실시간 필터링 로직 (searchTerm이 변경될 때마다 실행)
  // ===============================================
  useEffect(() => {
    // 검색어가 비어 있으면 전체 목록을 보여줍니다.
    if (searchTerm.trim() === "") {
      setFilteredNews(MOCK_NEWS_DATA);
      return;
    }

    // 검색어가 포함된 기사만 필터링합니다. (제목 기준으로 대소문자 구분 없이)
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = MOCK_NEWS_DATA.filter((news) =>
      news.title.toLowerCase().includes(lowerCaseSearchTerm)
    );

    setFilteredNews(results);
  }, [searchTerm]); // 검색어(searchTerm)가 바뀔 때마다 이 함수를 실행합니다.

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="news-page-container">
      <header className="news-header">
        <h1>뉴스 헤드라인 필터링</h1>
        <div className="header-actions">
          {/* 🚨 수정: 게시판 -> 홈 화면 경로 '/' */}
          <button className="back-button" onClick={() => navigate("/")}>
            🏠 홈 화면으로 돌아가기
          </button>
        </div>
      </header>

      <main className="news-content">
        {/* 왼쪽 검색/필터 영역 */}
        <div className="search-filter-area">
          {/* 검색 입력창 */}
          <input
            type="text"
            placeholder="뉴스 제목에서 키워드를 검색하세요..."
            value={searchTerm}
            onChange={handleSearchChange} // 입력 시 바로 상태 업데이트
            className="news-search-input"
          />
          {/* 참고: 검색 버튼은 실시간 필터링이 적용되므로 제거하거나 숨길 수 있습니다. */}
        </div>

        {/* 오른쪽 뉴스 목록 영역 */}
        <div className="news-list-area">
          {filteredNews.length > 0 ? (
            filteredNews.map((news) => (
              <div key={news.id} className="news-item">
                <span
                  className={`news-category category-${
                    news.category.split("/")[0]
                  }`}
                >
                  {news.category}
                </span>
                <a href="#" className="news-title">
                  {news.title}
                </a>
                <span className="news-date">{news.date}</span>
              </div>
            ))
          ) : (
            <p className="no-results">
              '{searchTerm}'에 해당하는 뉴스를 찾을 수 없습니다.
            </p>
          )}
        </div>
      </main>

      <footer className="news-footer">
        <p>&copy; 2024 Local News Project. 데이터는 가상으로 제공됩니다.</p>
      </footer>
    </div>
  );
}