import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Home.css"; // 우주 테마 스타일 재사용

export default function AIRicePage() {
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
      setResult(null); // 결과 초기화
    }
  };

  // 진단 요청 핸들러
  const handleSubmit = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);

    // 🚨 핵심: Node.js에게 '벼(rice) 모델'을 쓰라고 알려줌
    formData.append("modelType", "rice");

    try {
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
        {/* 헤더 영역 (에메랄드 그린 테마) */}
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
            style={{
              fontSize: "1.8rem",
              color: "#34d399",
              margin: 0,
              textShadow: "0 0 10px rgba(52, 211, 153, 0.5)",
            }}
          >
            🌾 벼 병해충 정밀 진단
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
            border: "1px solid rgba(52, 211, 153, 0.3)",
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
              border: "2px dashed rgba(52, 211, 153, 0.3)",
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <span style={{ color: "#9ca3af" }}>
                벼 잎사귀 사진을 올려주세요
              </span>
            )}
          </div>

          {/* 버튼 그룹 */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="file-upload-rice"
          />
          <label
            htmlFor="file-upload-rice"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "#059669",
              color: "white",
              borderRadius: "10px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            🌿 사진 찾기
          </label>

          <button
            onClick={handleSubmit}
            disabled={!selectedImage || loading}
            style={{
              padding: "10px 30px",
              background: loading
                ? "#6b7280"
                : "linear-gradient(135deg, #10b981, #047857)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {loading ? "AI가 분석 중... 🔬" : "🩺 진단 시작"}
          </button>
        </div>

        {/* 결과 리포트 영역 */}
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
              📋 진단 결과 리포트
            </h2>
            <p style={{ fontSize: "1.2rem", color: "white", margin: "5px 0" }}>
              병명: <strong>{result.label}</strong>
            </p>
            <p style={{ color: "#d1d5db", margin: 0 }}>
              확률(신뢰도): {result.confidence.toFixed(1)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
