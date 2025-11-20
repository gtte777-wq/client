import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProStockChart from "../components/ProStockChart";

// 🚨 Server Port 확인
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
  const [priceDiff, setPriceDiff] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchChartData = useCallback(async (symbol) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/stock/candles?symbol=${symbol}`);
      const result = await response.json();

      if (!result.success || !result.data) {
        console.error("캔들 데이터 로딩 실패:", result.message);
        return;
      }

      // 🚨 [에러 수정 핵심 부분]
      // 데이터 매핑 시 stck_bsdy(날짜)가 없는 데이터는 건너뛰도록 처리
      const formattedData = result.data
        .map((item) => {
          // 🛡️ 안전장치: 날짜 데이터가 없으면 null 반환
          if (!item.stck_bsdy) return null;

          const open = parseInt(item.stck_oprc);
          const close = parseInt(item.stck_clpr);
          const isUp = close >= open;

          // 날짜 파싱 (slice 에러 방지를 위해 위에서 null 체크 함)
          const dateStr = `${item.stck_bsdy.slice(0, 4)}-${item.stck_bsdy.slice(4, 6)}-${item.stck_bsdy.slice(6, 8)}`;
          const timeStamp = new Date(dateStr).getTime() / 1000;

          return {
            time: timeStamp,
            open: open,
            high: parseInt(item.stck_hgpr),
            low: parseInt(item.stck_lwpr),
            close: close,
            value: parseInt(item.acml_vol),
            color: isUp ? "rgba(239, 68, 68, 0.5)" : "rgba(59, 130, 246, 0.5)",
          };
        })
        .filter((item) => item !== null) // null 값 제거 (유효한 데이터만 남김)
        .reverse(); // 최신순 -> 과거순 정렬

      setChartData(formattedData);

    } catch (error) {
      console.error(`API Error - 캔들 [${symbol}]:`, error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentPrice = useCallback(async (symbol) => {
    try {
      const response = await fetch(`${BASE_URL}/api/stock/current-price?symbol=${symbol}`);
      const result = await response.json();

      if (!result.success || !result.data) {
        return;
      }

      const price = parseInt(result.data.stck_prpr);
      const diff = parseInt(result.data.prdy_vrss);

      setCurrentPrice(price);
      setPriceDiff(diff);

    } catch (error) {
      console.error(`API Error - 현재가 [${symbol}]:`, error);
    }
  }, []);

  useEffect(() => {
    const symbol = activeStock.code;
    fetchChartData(symbol);
    fetchCurrentPrice(symbol);
    
    const priceInterval = setInterval(() => fetchCurrentPrice(symbol), 3000);
    return () => clearInterval(priceInterval);
  }, [activeStock, fetchChartData, fetchCurrentPrice]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `url("https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_960_720.jpg") center/cover fixed`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "40px",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      {/* 상단 네비게이션 */}
      <div
        style={{
          width: "90%",
          maxWidth: "1000px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            borderRadius: "30px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.1)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            backdropFilter: "blur(5px)",
          }}
        >
          🏠 Home
        </button>
      </div>

      {/* 종목 선택 탭 */}
      <div
        style={{
          width: "90%",
          maxWidth: "1000px",
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          paddingBottom: "5px",
        }}
      >
        {STOCK_CODES.map((stock) => (
          <button
            key={stock.code}
            onClick={() => setActiveStock(stock)}
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              border:
                activeStock.code === stock.code
                  ? "1px solid #ef4444"
                  : "1px solid rgba(255,255,255,0.1)",
              background:
                activeStock.code === stock.code
                  ? "rgba(239, 68, 68, 0.2)"
                  : "rgba(15, 23, 42, 0.6)",
              color: activeStock.code === stock.code ? "white" : "#94a3b8",
              cursor: "pointer",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              transition: "0.2s",
            }}
          >
            {stock.name}
          </button>
        ))}
      </div>

      {/* 가격 정보 */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "1.8rem" }}>
          {activeStock.name} <span style={{ fontSize: "0.9rem", color: "#94a3b8" }}>{activeStock.code}</span>
        </h1>
        <span style={{ fontSize: "2.5rem", fontWeight: "bold", color: priceDiff >= 0 ? "#ef4444" : "#3b82f6" }}>
          {currentPrice.toLocaleString()} KRW
        </span>
        <span style={{ fontSize: "1.2rem", marginLeft: "10px", color: priceDiff >= 0 ? "#ef4444" : "#3b82f6" }}>
          {priceDiff > 0 ? "▲" : "▼"} {Math.abs(priceDiff).toLocaleString()}
        </span>
      </div>

      {/* 캔들 + 거래량 차트 영역 */}
      <div
        style={{
          width: "90%",
          maxWidth: "1000px",
          height: "550px",
          minHeight: "550px",
          background: "rgba(15, 23, 42, 0.95)",
          borderRadius: "20px",
          padding: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <p style={{ color: "white", textAlign: "center" }}>
            데이터 로딩 중... 📊
          </p>
        ) : chartData.length > 0 ? (
          <ProStockChart data={chartData} />
        ) : (
          <p style={{ color: "white", textAlign: "center" }}>
            차트 데이터를 불러오지 못했습니다.
          </p>
        )}
      </div>
    </div>
  );
}