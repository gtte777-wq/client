import React, { useState, useEffect } from "react";

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/weather");
        const result = await response.json();
        if (result.success) {
          setWeather(result.data);
        }
      } catch (error) {
        console.error("날씨 로딩 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // 10분마다 날씨 갱신
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return <div style={{ color: "#94a3b8" }}>날씨 로딩 중... 🌤️</div>;
  if (!weather) return <div style={{ color: "#ef4444" }}>날씨 정보 없음</div>;

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        padding: "15px 25px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        minWidth: "200px",
      }}
    >
      {/* 아이콘 영역 */}
      <div style={{ fontSize: "2.5rem" }}>{weather.icon}</div>

      {/* 텍스트 영역 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#fff" }}>
          {weather.temp}°C
        </span>
        <span style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>
          {weather.location} | {weather.condition}
        </span>
      </div>
    </div>
  );
}
