import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Calculator.css";

export default function CalculatorPage() {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [process, setProcess] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value) => {
    if (result && !["+", "-", "*", "/"].includes(value)) {
      setInput(value);
      setProcess("");
      setResult("");
      return;
    }
    if (result && ["+", "-", "*", "/"].includes(value)) {
      setInput(result + value);
      setResult("");
      setProcess("");
      return;
    }
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
    setProcess("");
    setResult("");
  };

  const handleCalculate = () => {
    try {
      if (!input) return;
      // eslint-disable-next-line no-eval
      const calcResult = eval(input);
      setProcess(input + " =");
      setResult(String(calcResult));
      setInput(String(calcResult));
    } catch (error) {
      setResult("Error");
    }
  };

  return (
    <div className="calculator-page-container">
      {/* 🚨 [UX Patch] 우측 상단 버튼 그룹화 */}
      <div className="fixed-top-right" style={{ display: "flex", gap: "10px" }}>
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          title="뒤로 가기"
        >
          ↩
        </button>
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
