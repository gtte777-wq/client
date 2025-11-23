import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProStockChart from "../components/ProStockChart";

const BASE_URL = 'http://localhost:3000'; 

const STOCK_CODES = [
  { name: "삼성전자", code: "005930" },
  { name: "SK하이닉스", code: "000660" },
  { name: "LG에너지솔루션", code: "373220" },
  { name: "삼성바이오로직스", code: "207940" },
  { name: "현대차", code: "005380" },
  { name: "기아", code: "000270" }
];

export default function StockChartPage() {
  const navigate = useNavigate();
  const [activeStock, setActiveStock] = useState(STOCK_CODES[0]);
  const [chartData, setChartData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🤖 봇 제어 상태
  const [botRunning, setBotRunning] = useState(false);
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);

  // 1. 초기 봇 상태 로드
  useEffect(() => {
    fetch(`${BASE_URL}/api/bot/status`)
      .then(res => res.json())
      .then(data => {
        if(data.success) {
            setBotRunning(data.data.isRunning);
            setBuyPrice(data.data.buyPrice);
            setSellPrice(data.data.sellPrice);
        }
      });
  }, []);

  // 2. 봇 설정 저장
  const saveBotSettings = async () => {
    try {
        await fetch(`${BASE_URL}/api/bot/config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                symbol: activeStock.code,
                buyPrice: Number(buyPrice),
                sellPrice: Number(sellPrice)
            })
        });
        alert(`✅ [${activeStock.name}] 설정 저장 완료!\n매수: ${Number(buyPrice).toLocaleString()}원\n매도: ${Number(sellPrice).toLocaleString()}원`);
    } catch (e) { alert("설정 저장 실패"); }
  };

  // 3. 봇 토글 (시작/정지)
  const toggleBot = async () => {
    const res = await fetch(`${BASE_URL}/api/bot/toggle`, { method: "POST" });
    const data = await res.json();
    setBotRunning(data.isRunning);
  };

  const fetchChartData = useCallback(async (symbol) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/stock/candles?symbol=${symbol}`);
      const result = await response.json();

      if (!result.success || !result.data) {
        setChartData([]); return;
      }

      // 데이터 매핑 (서버에서 필드명 수정해줬으므로 stck_bsdy 사용)
      const formattedData = result.data
        .map((item) => {
          if (!item.stck_bsdy) return null;
          
          const dateStr = `${item.stck_bsdy.slice(0, 4)}-${item.stck_bsdy.slice(4, 6)}-${item.stck_bsdy.slice(6, 8)}`;
          const timeStamp = new Date(dateStr).getTime() / 1000;

          const open = parseInt(item.stck_oprc);
          const close = parseInt(item.stck_clpr);

          return {
            time: timeStamp,
            open: open,
            high: parseInt(item.stck_hgpr),
            low: parseInt(item.stck_lwpr),
            close: close,
            value: parseInt(item.acml_vol || 0),
            color: close >= open ? "rgba(239, 68, 68, 0.8)" : "rgba(59, 130, 246, 0.8)",
          };
        })
        .filter((item) => item !== null);

      setChartData(formattedData);

    } catch (error) {
      console.error("API Error:", error);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentPrice = useCallback(async (symbol) => {
    try {
      const response = await fetch(`${BASE_URL}/api/stock/current-price?symbol=${symbol}`);
      const result = await response.json();
      if (result.success && result.data) {
          setCurrentPrice(parseInt(result.data.stck_prpr));
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchChartData(activeStock.code);
    fetchCurrentPrice(activeStock.code);
    const priceInterval = setInterval(() => fetchCurrentPrice(activeStock.code), 2000);
    return () => clearInterval(priceInterval);
  }, [activeStock, fetchChartData, fetchCurrentPrice]);

  return (
    <div
      style={{
        minHeight: "100vh",
        // 🌌 우주 배경 이미지 복구
        background: `url("https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_960_720.jpg") center/cover fixed`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "40px",
        paddingBottom: "40px",
        fontFamily: "Pretendard, sans-serif",
        color: "white"
      }}
    >
      {/* 상단 네비게이션 */}
      <div style={{ width: "90%", maxWidth: "1000px", marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => navigate("/")}
          style={{
            padding: "10px 20px", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.1)", color: "white", fontWeight: "bold", cursor: "pointer", backdropFilter: "blur(5px)"
          }}
        >
          🏠 Home
        </button>
      </div>

      {/* 종목 선택 탭 */}
      <div style={{ width: "90%", maxWidth: "1000px", marginBottom: "20px", display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "5px" }}>
        {STOCK_CODES.map((stock) => (
          <button key={stock.code} onClick={() => setActiveStock(stock)}
            style={{
              padding: "10px 20px", borderRadius: "20px",
              border: activeStock.code === stock.code ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
              background: activeStock.code === stock.code ? "rgba(239, 68, 68, 0.4)" : "rgba(15, 23, 42, 0.6)",
              color: "white", cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap", transition: "0.2s", backdropFilter: "blur(5px)"
            }}
          >
            {stock.name}
          </button>
        ))}
      </div>

      {/* 가격 정보 */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: "2.5rem", textShadow: "0 0 20px rgba(0,0,0,0.5)" }}>
          {activeStock.name} <span style={{ fontSize: "1rem", color: "#cbd5e1" }}>{activeStock.code}</span>
        </h1>
        <div style={{ fontSize: "3.5rem", fontWeight: "bold", color: "#fff", textShadow: "0 0 20px rgba(239, 68, 68, 0.8)" }}>
          {currentPrice.toLocaleString()} <span style={{fontSize:"1.5rem"}}>KRW</span>
        </div>
      </div>

      {/* 🕹️ 봇 제어 패널 (Glassmorphism 스타일 적용) */}
      <div style={{
          width: "90%", maxWidth: "800px", marginBottom: "30px", padding: "25px",
          background: "rgba(15, 23, 42, 0.7)", // 반투명 배경
          backdropFilter: "blur(15px)",        // 유리 효과
          borderRadius: "20px",
          border: botRunning ? "2px solid #4ade80" : "1px solid rgba(255,255,255,0.15)",
          boxShadow: botRunning ? "0 0 30px rgba(74, 222, 128, 0.3)" : "0 10px 30px rgba(0,0,0,0.5)"
      }}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px", borderBottom:"1px solid rgba(255,255,255,0.1)", paddingBottom:"15px"}}>
              <h3 style={{margin:0, fontSize:"1.2rem"}}>🤖 자동매매 AI 컨트롤러</h3>
              <div style={{
                  padding:"6px 15px", borderRadius:"20px", fontWeight:"bold", fontSize:"0.9rem",
                  background: botRunning ? "linear-gradient(135deg, #22c55e, #16a34a)" : "#ef4444",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
              }}>
                  {botRunning ? "● SYSTEM ONLINE" : "● SYSTEM OFFLINE"}
              </div>
          </div>

          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", marginBottom:"20px"}}>
              <div>
                  <label style={{display:"block", color:"#94a3b8", marginBottom:"8px", fontSize:"0.9rem"}}>📉 매수 타겟 (Low)</label>
                  <input type="number" value={buyPrice} onChange={(e)=>setBuyPrice(e.target.value)} 
                      style={{
                          width:"100%", padding:"12px", background:"rgba(0,0,0,0.3)", 
                          border:"1px solid rgba(255,255,255,0.2)", color:"white", borderRadius:"8px", fontSize:"1.1rem", outline:"none"
                      }} />
              </div>
              <div>
                  <label style={{display:"block", color:"#94a3b8", marginBottom:"8px", fontSize:"0.9rem"}}>📈 매도 타겟 (High)</label>
                  <input type="number" value={sellPrice} onChange={(e)=>setSellPrice(e.target.value)} 
                      style={{
                          width:"100%", padding:"12px", background:"rgba(0,0,0,0.3)", 
                          border:"1px solid rgba(255,255,255,0.2)", color:"white", borderRadius:"8px", fontSize:"1.1rem", outline:"none"
                      }} />
              </div>
          </div>

          <div style={{display:"flex", gap:"15px"}}>
              <button onClick={saveBotSettings} 
                  style={{
                      flex:1, padding:"15px", background:"rgba(59, 130, 246, 0.8)", border:"none", borderRadius:"12px", 
                      color:"white", cursor:"pointer", fontWeight:"bold", fontSize:"1rem", transition:"0.2s"
                  }}
                  onMouseOver={(e) => e.target.style.background = "rgba(37, 99, 235, 1)"}
                  onMouseOut={(e) => e.target.style.background = "rgba(59, 130, 246, 0.8)"}
              >
                  💾 설정 저장
              </button>
              <button onClick={toggleBot} 
                  style={{
                      flex:1, padding:"15px", border:"none", borderRadius:"12px", color:"white", cursor:"pointer", fontWeight:"bold", fontSize:"1rem",
                      background: botRunning ? "rgba(239, 68, 68, 0.8)" : "rgba(34, 197, 94, 0.8)",
                      boxShadow: botRunning ? "0 0 20px rgba(239, 68, 68, 0.4)" : "0 0 20px rgba(34, 197, 94, 0.4)",
                      transition:"0.2s"
                  }}
              >
                  {botRunning ? "⏹️ 긴급 정지 (STOP)" : "▶️ 자동매매 시작 (START)"}
              </button>
          </div>
      </div>

      {/* 캔들 차트 영역 (Glassmorphism) */}
      <div
        style={{
          width: "90%", maxWidth: "1000px", height: "550px",
          background: "rgba(15, 23, 42, 0.7)", // 투명도 조절
          backdropFilter: "blur(10px)",         // 블러 처리
          borderRadius: "20px",
          padding: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          display: "flex", justifyContent: "center", alignItems: "center", position: "relative"
        }}
      >
        {loading ? (
          <p style={{ color: "#94a3b8", fontSize: "1.2rem" }}>데이터 로딩 중... 🛰️</p>
        ) : chartData.length > 0 ? (
          <ProStockChart data={chartData} />
        ) : (
          <div style={{textAlign:"center", color:"#94a3b8"}}>
            <p style={{fontSize:"1.2rem"}}>데이터를 불러올 수 없습니다.</p>
            <p style={{fontSize:"0.9rem"}}>장 휴장일이거나 API 설정을 확인해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}