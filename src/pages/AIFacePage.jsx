import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Home.css";

export default function AIFacePage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("modelType", "face"); // 🚨 'face' 모델 요청

    try {
      const response = await fetch("http://localhost:8080/api/ai-predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) setResult(data.result);
      else alert("분석 실패: " + (data.message || data.error));
    } catch (error) {
      alert("서버 에러");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page-background">
      <div
        className="home-content-container"
        style={{ maxWidth: "600px", border: "1px solid #06b6d4" }}
      >
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
              color: "#22d3ee",
              margin: 0,
              textShadow: "0 0 10px rgba(34, 211, 238, 0.6)",
            }}
          >
            👤 인물 신원 확인
          </h1>
          <button
            onClick={() => navigate("/ai")}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "1px solid rgba(34, 211, 238, 0.5)",
              background: "rgba(0,0,0,0.5)",
              color: "#22d3ee",
              cursor: "pointer",
            }}
          >
            ↩ 돌아가기
          </button>
        </div>

        <div
          style={{
            background: "rgba(0,0,0,0.6)",
            padding: "30px",
            borderRadius: "20px",
            border: "1px solid rgba(34, 211, 238, 0.3)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "300px",
              background: "rgba(0,0,0,0.8)",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              marginBottom: "20px",
              border: "2px dashed #0891b2",
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <span style={{ color: "#0891b2" }}>사진을 스캔해주세요</span>
            )}
          </div>

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
              background: "#0e7490",
              color: "white",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            📸 사진 선택
          </label>

          <button
            onClick={handleSubmit}
            disabled={!selectedImage || loading}
            style={{
              padding: "10px 30px",
              background: loading ? "#374151" : "#06b6d4",
              color: "black",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "신원 조회 중..." : "ID 스캔 실행"}
          </button>
        </div>

        {result && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "rgba(6, 182, 212, 0.1)",
              border: "1px solid #22d3ee",
              borderRadius: "10px",
            }}
          >
            <h2 style={{ margin: "0 0 10px 0", color: "#22d3ee" }}>
              ✅ 신원 확인됨
            </h2>
            <p
              style={{ fontSize: "1.5rem", color: "white", fontWeight: "bold" }}
            >
              {result.label}
            </p>
            <p style={{ color: "#67e8f9" }}>일치율: {result.confidence}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
