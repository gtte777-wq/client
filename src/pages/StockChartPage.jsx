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
    const [activeStock, setActiveStock] = useState(STOCK_CODES[0]);
    const [chartData, setChartData] = useState([]);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [priceDiff, setPriceDiff] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // 2시간 간격 (상수)
    const REFRESH_INTERVAL = 2 * 60 * 60 * 1000; 

    // ---------------------------------------------
    // 1. 캔들 데이터 패칭 (차트용)
    // ---------------------------------------------
    const fetchCandleData = useCallback(async (symbol, signal) => {
        setIsLoading(true);
        try {
            console.log(`[캔들 요청] ${symbol} 데이터 요청 시작...`);
            const endpoint = `${BASE_URL}/api/stock/candles?symbol=${symbol}&unit=D`;
            
            const response = await fetch(endpoint, { signal });
            
            if (!response.ok) {
                throw new Error(`서버 응답 에러: ${response.status}`);
            }

            const result = await response.json();
            console.log("[캔들 응답]", result); // 🚨 브라우저 콘솔 확인용

            if (!result.success || !result.data || result.data.length === 0) {
                console.warn("데이터가 비어있거나 success가 false입니다.");
                setChartData([]);
                return;
            }

            // 데이터 변환
            const formattedData = result.data.map((item) => {
                const open = parseFloat(item.stck_oprc);
                const close = parseFloat(item.stck_clpr);
                return {
                    time: new Date(item.stck_bsdy).getTime() / 1000,
                    open: open,
                    high: parseFloat(item.stck_hgpr),
                    low: parseFloat(item.stck_lwpr),
                    close: close,
                    value: parseFloat(item.acml_vol),
                    color: close >= open ? "rgba(239, 68, 68, 0.5)" : "rgba(59, 130, 246, 0.5)",
                };
            }).reverse();

            setChartData(formattedData);

        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("🚨 캔들 데이터 로드 치명적 오류:", error);
                setChartData([]); 
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ---------------------------------------------
    // 2. 실시간 현재가 패칭 (단일 종목 최적화 적용)
    // ---------------------------------------------
    const fetchCurrentPriceRealTime = useCallback(async (symbol, signal) => {
        try {
            // 🚀 [최적화] activeStock.code를 쿼리 파라미터로 전달
            // 백엔드 엔드포인트도 이에 맞춰 수정되어야 함 (/current-price 단수형 권장)
            const response = await fetch(`${BASE_URL}/api/stock/current-price?symbol=${symbol}`, { signal });
            
            if (!response.ok) return;

            const result = await response.json();

            if (result.success && result.data) {
                // 백엔드에서 이제 배열이 아니라 단일 객체를 준다고 가정
                const targetStock = result.data; 
                
                const price = parseInt(targetStock.stck_prpr);
                const prevClose = parseInt(targetStock.prdy_clpr);
                
                setCurrentPrice(price);
                setPriceDiff(price - prevClose);
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("현재가 로드 오류:", error);
            }
        }
    }, []);

    // ---------------------------------------------
    // 3. 통합 실행 로직
    // ---------------------------------------------
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const loadAllData = () => {
            fetchCandleData(activeStock.code, signal);
            fetchCurrentPriceRealTime(activeStock.code, signal);
        };

        // 즉시 실행
        loadAllData();

        // 2시간 타이머
        const intervalId = setInterval(() => {
            fetchCurrentPriceRealTime(activeStock.code, signal);
        }, REFRESH_INTERVAL);

        // 탭 활성화 시 즉시 갱신
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log("탭 복귀: 데이터 갱신");
                fetchCurrentPriceRealTime(activeStock.code, signal);
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(intervalId);
            abortController.abort();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [activeStock, fetchCandleData, fetchCurrentPriceRealTime]);

    // 이벤트 핸들러
    const handleStockChange = (stock) => {
        if (stock.code === activeStock.code) return;
        setActiveStock(stock);
        setChartData([]); 
        setCurrentPrice(0);
        setPriceDiff(0);
    };

    return (
        <div style={{ padding: "20px", background: "#0f172a", minHeight: "100vh", color: "white" }}>
            {/* 종목 선택 */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", overflowX: "auto" }}>
                {STOCK_CODES.map((stock) => (
                    <button
                        key={stock.code}
                        onClick={() => handleStockChange(stock)}
                        style={{
                            padding: "10px 20px", borderRadius: "20px",
                            border: activeStock.code === stock.code ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                            background: activeStock.code === stock.code ? "rgba(239, 68, 68, 0.2)" : "rgba(15, 23, 42, 0.6)",
                            color: activeStock.code === stock.code ? "white" : "#94a3b8",
                            cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap"
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

            {/* 차트 영역 */}
            <div style={{
                height: "550px", background: "rgba(15, 23, 42, 0.95)", borderRadius: "20px",
                padding: "20px", border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", justifyContent: "center", alignItems: "center"
            }}>
                {isLoading ? (
                    <p>데이터 로딩 중...</p>
                ) : chartData.length > 0 ? (
                    <ProStockChart data={chartData} />
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>차트 데이터를 불러오지 못했습니다.</p>
                        <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                            F12 개발자 도구 {'>'} Console 탭을 확인하여<br/>
                            [캔들 응답] 로그가 정상적으로 찍히는지 확인하세요.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}