import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Home.css"; // 우주 테마 스타일 사용

export default function AIMuffinPage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null); // 이전 결과 초기화
    }
  };

  // 분석 요청 핸들러
  const handleSubmit = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("modelType", "muffin"); // 🚨 중요: Node.js에게 '머핀 모델 써!'라고 알려줌

    try {
      // Node.js 서버(8080)로 전송 -> Node가 Python(8000)으로 토스
      const response = await fetch("http://localhost:8080/api/ai-predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResult(data.result);
      } else {
        alert("분석 실패: " + (data.message || data.error));
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert("서버 통신 에러");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page-background">
      <div className="home-content-container" style={{ maxWidth: "600px" }}>
        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <h1
            className="home-title"
            style={{ fontSize: "1.8rem", color: "#fbbf24", margin: 0 }}
          >
            🐶 머핀 vs 치와와
          </h1>
          <button
            onClick={() => navigate("/ai")}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              cursor: "pointer",
            }}
          >
            ↩ 메뉴로
          </button>
        </div>

        {/* 업로드 영역 */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "30px",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
          }}
        >
          {/* 이미지 미리보기 */}
          <div
            style={{
              width: "100%",
              height: "300px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              marginBottom: "20px",
              border: "2px dashed rgba(255,255,255,0.2)",
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <span style={{ color: "#9ca3af" }}>이미지를 선택해주세요</span>
            )}
          </div>

          {/* 파일 선택 버튼 */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "#4b5563",
              color: "white",
              borderRadius: "10px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            📂 파일 찾기
          </label>

          {/* 분석 시작 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={!selectedImage || loading}
            style={{
              padding: "10px 30px",
              background: loading
                ? "#6b7280"
                : "linear-gradient(135deg, #fbbf24, #d97706)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {loading ? "분석 중... ⏳" : "🔍 AI 분석 시작"}
          </button>
        </div>

        {/* 결과 표시 영역 */}
        {result && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "rgba(16, 185, 129, 0.2)",
              border: "1px solid #10b981",
              borderRadius: "15px",
              animation: "fadeIn 0.5s",
            }}
          >
            <h2 style={{ margin: "0 0 10px 0", color: "#34d399" }}>
              🎉 분석 결과
            </h2>
            <p style={{ fontSize: "1.2rem", color: "white", margin: "5px 0" }}>
              이 사진은 <strong>{result.label}</strong> 입니다!
            </p>
            <p style={{ color: "#d1d5db", margin: 0 }}>
              정확도: {(result.confidence * 100).toFixed(1)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
