import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/StockPredictPage.css'; // CSS 파일 임포트

const StockPredictPage = () => {
  const navigate = useNavigate();
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    if (!ticker) return alert("종목명을 입력해주세요!");
    
    setLoading(true);
    setResult(null);

    try {
      // 📡 실제 서버 주소로 변경 필요 (현재 로컬호스트)
      const response = await fetch('http://localhost:3000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        alert("분석 실패: " + data.error);
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert("서버 연결 에러");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predict-page-wrapper">
      {/* 뒤로가기 버튼 */}
      <button className="home-btn" onClick={() => navigate('/')}>
        ← Home
      </button>
      
      <h2 className="page-title">🔮 AI 주가 예측 & 뉴스 분석</h2>
      
      {/* 검색 입력창 */}
      <div className="search-container">
        <input 
          type="text" 
          className="stock-input"
          placeholder="종목명/코드 (예: 삼성전자, TSLA)" 
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handlePredict()}
        />
        <button 
          className="predict-btn"
          onClick={handlePredict} 
          disabled={loading}
        >
          {loading ? '분석 중...' : '예측 시작'}
        </button>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="loading-container">
          <h3>🤖 AI가 뉴스를 읽고 차트를 분석하고 있습니다...</h3>
          <div className="spinner"></div>
          <p style={{ color: '#94a3b8' }}>잠시만 기다려주세요</p>
        </div>
      )}

      {/* 결과 화면 */}
      {result && !loading && (
        <div className="result-container">
          <div className="result-header">
            📊 {result.ticker} 분석 결과
          </div>
          
          {/* 1. 차트 이미지 */}
          {result.ai_result.chart_image && (
            <div className="chart-wrapper">
              <img 
                src={`data:image/png;base64,${result.ai_result.chart_image}`} 
                alt="Predicted Chart" 
                className="chart-img"
              />
            </div>
          )}

          {/* 2. AI 분석 코멘트 */}
          <div className="analysis-box">
            <h4 className="analysis-title">💡 AI 투자 의견</h4>
            <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
              {result.ai_result.analysis}
            </p>
            <p className="price-tag">
              <strong>💵 예상 가격:</strong> {result.ai_result.price_predict}
            </p>
          </div>

          {/* 3. 뉴스 목록 */}
          <div className="news-section">
            <h4>📰 관련 뉴스 하이라이트</h4>
            <ul className="news-list">
              {result.news.map((news, idx) => (
                <li key={idx} className="news-item">
                  <span className="news-title">{news.title}</span>
                  <p className="news-summary">{news.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPredictPage;