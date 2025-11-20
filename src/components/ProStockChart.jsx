import React, { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";

export default function ProStockChart({ data }) {
  const chartContainerRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94a3b8",
      },
      localization: {
        priceFormatter: (price) => price.toLocaleString(), 
    },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.1)" },
        horzLines: { color: "rgba(255, 255, 255, 0.1)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      crosshair: {
        mode: 1, // Magnet 모드 (데이터 포인트에 자석처럼 붙음) -> 0으로 하면 자유 이동
    },

      // 1. 메인 캔들 차트 영역 설정 (화면 위쪽 70%만 쓰도록 제한)
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        scaleMargins: {
          top: 0.05, // 위쪽 여백 5%
          bottom: 0.3, // 아래쪽 여백 30% (여기에 거래량이 들어갈 거임)
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
    });

    // 2. 캔들스틱 시리즈 추가
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#ef4444",
      downColor: "#3b82f6",
      borderVisible: false,
      wickUpColor: "#ef4444",
      wickDownColor: "#3b82f6",
    });
    candlestickSeries.setData(data);

    // 3. 거래량 시리즈 추가 (화면 아래쪽 20%에 찌그러트려 넣기)
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#26a69a",
      priceFormat: { type: "volume" },
      priceScaleId: "", // 메인 스케일과 분리하지 않고 overlay로 처리하되 마진으로 위치 조정
    });

    // 🚨 핵심: 거래량은 별도의 스케일 옵션을 줘서 바닥에 붙임
    chart.priceScale("").applyOptions({
      scaleMargins: {
        top: 0.8, // 위쪽 80%를 비워둠 (즉, 아래 20%만 씀)
        bottom: 0,
      },
    });

    volumeSeries.setData(
      data.map((d) => ({
        time: d.time,
        value: d.value,
        color: d.color,
      }))
    );

    // 반응형 처리
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />
  );
}
