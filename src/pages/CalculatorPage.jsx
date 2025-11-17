import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Calculator.css';

export default function CalculatorPage() {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');

    const handleButtonClick = (value) => {
        if (value === 'C') {
            setInput('');
            setResult('');
        } else if (value === '=') {
            try {
                // eval은 보안에 취약할 수 있으나, 간단한 계산기 구현을 위해 사용합니다.
                const evalResult = eval(input.replace(/×/g, '*').replace(/÷/g, '/'));
                setResult(evalResult);
            } catch (error) {
                setResult('오류');
            }
        } else {
            setInput(prevInput => prevInput + value);
        }
    };

    const buttons = [
        '7', '8', '9', '÷',
        '4', '5', '6', '×',
        '1', '2', '3', '-',
        'C', '0', '=', '+'
    ];

    return (
        <div className="calculator-page-container">
            <button className="back-button fixed-top-right" onClick={() => navigate('/home')}>
                🏠 홈으로
            </button>
            <div className="calculator-wrapper">
                <h1 className="calculator-title">🧮 간단 계산기</h1>
                <div className="display-area">
                    <div className="input-display">{input || '0'}</div>
                    <div className="result-display">{result}</div>
                </div>
                <div className="button-grid">
                    {buttons.map((btn) => (
                        <button
                            key={btn}
                            onClick={() => handleButtonClick(btn)}
                            className={`calc-btn ${
                                ['÷', '×', '-', '+', '='].includes(btn) ? 'operator' : ''
                            } ${btn === 'C' ? 'clear' : ''}`}
                        >
                            {btn}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}