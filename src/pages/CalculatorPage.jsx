import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Calculator.css";

export default function CalculatorPage() {
  const navigate = useNavigate();

  const [input, setInput] = useState(""); // 현재 입력 중인 값
  const [process, setProcess] = useState(""); // 계산 과정 보여주기 (예: 12 + 5 =)
  const [result, setResult] = useState(""); // 최종 결과

  // 숫자/연산자 입력
  const handleClick = (value) => {
    // 결과가 나온 상태에서 숫자를 누르면 새로 시작
    if (result && !["+", "-", "*", "/"].includes(value)) {
      setInput(value);
      setProcess("");
      setResult("");
      return;
    }
    // 연산자를 누르면 결과값을 이어서 사용
    if (result && ["+", "-", "*", "/"].includes(value)) {
      setInput(result + value);
      setResult("");
      setProcess("");
      return;
    }

    setInput((prev) => prev + value);
  };

  // 초기화 (C)
  const handleClear = () => {
    setInput("");
    setProcess("");
    setResult("");
  };

  // 계산 실행 (=)
  const handleCalculate = () => {
    try {
      if (!input) return;
      // eslint-disable-next-line no-eval
      const calcResult = eval(input);

      setProcess(input + " ="); // 과정을 위에 기록
      setResult(String(calcResult)); // 결과를 아래에 표시
      setInput(String(calcResult)); // 다음 계산을 위해 입력값 갱신
    } catch (error) {
      setResult("Error");
    }
  };

  return (
    <div className="calculator-page-container">
      <div className="fixed-top-right">
        <button className="back-button" onClick={() => navigate("/")}>
          🏠 Home
        </button>
      </div>

      <div className="calculator-wrapper">
        <h2 className="calculator-title">🚀 Space Calc</h2>

        <div
          className="display-area"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* 1. 계산 과정 (작고 흐린 글씨) */}
          <div
            className="process-display"
            style={{
              minHeight: "20px",
              fontSize: "1rem",
              color: "#94a3b8",
              marginBottom: "5px",
            }}
          >
            {process}
          </div>
          {/* 2. 현재 입력/결과 (크고 진한 글씨) */}
          <div
            className="input-display"
            style={{ fontSize: "2.5rem", color: "white", fontWeight: "bold" }}
          >
            {result ? result : input || "0"}
          </div>
        </div>

        <div className="button-grid">
          <button className="calc-btn clear" onClick={handleClear}>
            C
          </button>
          <button
            className="calc-btn operator"
            onClick={() => handleClick("/")}
          >
            /
          </button>
          <button
            className="calc-btn operator"
            onClick={() => handleClick("*")}
          >
            ×
          </button>
          <button
            className="calc-btn operator"
            onClick={() => handleClick("-")}
          >
            -
          </button>

          <button className="calc-btn" onClick={() => handleClick("7")}>
            7
          </button>
          <button className="calc-btn" onClick={() => handleClick("8")}>
            8
          </button>
          <button className="calc-btn" onClick={() => handleClick("9")}>
            9
          </button>
          <button
            className="calc-btn operator"
            onClick={() => handleClick("+")}
          >
            +
          </button>

          <button className="calc-btn" onClick={() => handleClick("4")}>
            4
          </button>
          <button className="calc-btn" onClick={() => handleClick("5")}>
            5
          </button>
          <button className="calc-btn" onClick={() => handleClick("6")}>
            6
          </button>
          <button
            className="calc-btn operator"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "white",
              border: "none",
            }}
            onClick={handleCalculate}
          >
            =
          </button>

          <button className="calc-btn" onClick={() => handleClick("1")}>
            1
          </button>
          <button className="calc-btn" onClick={() => handleClick("2")}>
            2
          </button>
          <button className="calc-btn" onClick={() => handleClick("3")}>
            3
          </button>
          <button className="calc-btn" onClick={() => handleClick("0")}>
            0
          </button>
        </div>
      </div>
    </div>
  );
}
