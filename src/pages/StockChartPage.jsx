import React, { useState, useEffect, useCallback } from "react";
import ProStockChart from "../components/ProStockChart";

// 🚨 서버 주소 확인 필수! (마지막에 슬래시 없어야 함)
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
  const [activeStock, setActiveStock] = useState(COIN_LIST[0]);
  const [chartData, setChartData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceDiff, setPriceDiff] = useState(0);

  useEffect(() => {
    const fetchUpbitData = async () => {
      try {
        const response = await fetch(
          `https://api.upbit.com/v1/candles/minutes/60?market=${activeStock.code}&count=200`
        );
        const data = await response.json();

        if (!data || data.error) return;

        // 📊 데이터 가공 (거래량 + 색상 로직 추가)
        const formattedData = data.map((item) => {
          const isUp = item.trade_price >= item.opening_price; // 양봉(상승) 여부

          return {
            time:
              new Date(item.candle_date_time_kst).getTime() / 1000 +
              9 * 60 * 60,
            open: item.opening_price,
            high: item.high_price,
            low: item.low_price,
            close: item.trade_price,
            // 👇 거래량 데이터 추가
            value: item.candle_acc_trade_volume,
            // 👇 양봉이면 빨강(투명도), 음봉이면 파랑(투명도)
            color: isUp ? "rgba(239, 68, 68, 0.5)" : "rgba(59, 130, 246, 0.5)",
          };
        });

        const reversedData = formattedData.reverse();
        setChartData(reversedData);

        if (reversedData.length > 0) {
          const lastCandle = reversedData[reversedData.length - 1];
          const prevCandle = reversedData[reversedData.length - 2];
          setCurrentPrice(lastCandle.close);
          setPriceDiff(lastCandle.close - prevCandle.close);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchUpbitData();
    const interval = setInterval(fetchUpbitData, 1000);
    return () => clearInterval(interval);
  }, [activeStock]);

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
        {COIN_LIST.map((stock) => (
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
        {chartData.length > 0 ? (
          <ProStockChart data={chartData} />
        ) : (
          <p style={{ color: "white", textAlign: "center" }}>
            실시간 데이터 수신 중...
          </p>
        )}
      </div>
    </div>
  );
}