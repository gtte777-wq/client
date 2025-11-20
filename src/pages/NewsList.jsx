import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/NewsList.css";

export default function NewsList() {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // 🚨 서버 주소 (Server.js의 포트 3000과 일치)
  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // 🚨 포트 수정: 8080 -> 3000
        const response = await fetch(`${BASE_URL}/api/news`);
        const result = await response.json();
        if (result.success) setNewsData(result.data);
      } catch (error) {
        console.error("뉴스 로딩 에러:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    const interval = setInterval(fetchNews, 60000);
    return () => clearInterval(interval);
  }, []);

  const getFilteredNews = () => {
    let results = newsData;
    if (searchTerm.trim() !== "") {
      results = results.filter((news) =>
        news.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType !== "all") {
      results = results.filter((news) => news.sentiment === filterType);
    }
    return results;
  };

  const filteredNews = getFilteredNews();

  return (
    <div className="news-page-container">
      <header className="news-header">
        <h1>📊 Global News Watch</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="back-button" onClick={() => navigate(-1)}>
            ↩ 뒤로
          </button>
          <button className="back-button" onClick={() => navigate("/stock")}>
            📈 차트 보기
          </button>
          <button className="back-button" onClick={() => navigate("/")}>
            🏠 홈
          </button>
        </div>
      </header>

      <main className="news-content">
        <section className="control-panel">
          <div className="search-box-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="뉴스 제목 또는 키워드 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterType === "all" ? "active" : ""}`}
              onClick={() => setFilterType("all")}
            >
              전체
            </button>
            <button
              className={`filter-btn positive ${
                filterType === "positive" ? "active" : ""
              }`}
              onClick={() => setFilterType("positive")}
            >
              🔥 호재만 보기
            </button>
            <button
              className={`filter-btn negative ${
                filterType === "negative" ? "active" : ""
              }`}
              onClick={() => setFilterType("negative")}
            >
              💧 악재만 보기
            </button>
          </div>
        </section>

        <section className="news-grid">
          {loading ? (
            <div className="status-message">
              📡 전 세계 뉴스를 수신 중입니다...
            </div>
          ) : filteredNews.length > 0 ? (
            filteredNews.map((news) => (
              <article
                key={news.id}
                className={`news-card ${news.sentiment}`}
                onClick={() => window.open(news.link, "_blank")}
              >
                <div className="news-meta">
                  <span className="news-source">{news.source}</span>
                  <span className="news-date">
                    {new Date(news.pubDate).toLocaleTimeString()}
                  </span>
                </div>
                <h3 className="news-title">{news.title}</h3>
                <p className="news-summary">
                    {/* content가 없을 경우를 대비한 안전 처리 */}
                  {news.content ? news.content.substring(0, 80) : "내용 없음"}...
                </p>
                <div className="news-footer-tags">
                  <span className={`sentiment-badge ${news.sentiment}`}>
                    {news.sentiment === "positive"
                      ? "▲ 상승신호"
                      : news.sentiment === "negative"
                      ? "▼ 하락주의"
                      : "● 일반"}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="no-results">
              <p>조건에 맞는 뉴스가 없습니다.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}