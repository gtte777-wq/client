import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Home.css";
import { db } from "../firebase"; // 방금 만든 설정 파일
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // DB 저장 도구

export default function AIPlantPage() {
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
    formData.append("modelType", "plant"); // 🚨 파이썬한테 보낼 이름

    try {
      const response = await fetch("http://localhost:8080/api/ai-predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResult(data.result);

        // 👇 [저장 코드] 식물용 이름표
        try {
          await addDoc(collection(db, "ai_history"), {
            modelType: "식물 병해충 진단", // 📝 기록실에 보여질 이름
            label: data.result.label,
            confidence: data.result.confidence,
            timestamp: serverTimestamp(),
          });
        } catch (e) {
          console.error("저장 실패", e);
        }
      } else {
        alert("분석 실패: " + (data.message || data.error));
      }
    } catch (error) {
      alert("서버 에러");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page-background">
      <div className="home-content-container" style={{ maxWidth: "600px" }}>
        {/* 헤더 & 뒤로가기 */}
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
            style={{ fontSize: "1.8rem", color: "#a3e635", margin: 0 }}
          >
            🌿 식물 병해충 진단
          </h1>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "1px solid rgba(163, 230, 53, 0.5)",
              background: "rgba(0,0,0,0.5)",
              color: "#a3e635",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ↩ 뒤로 가기
          </button>
        </div>

        {/* 업로드 영역 */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "30px",
            borderRadius: "20px",
            border: "1px solid rgba(163, 230, 53, 0.3)",
            textAlign: "center",
          }}
        >
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
              border: "2px dashed rgba(163, 230, 53, 0.3)",
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <span style={{ color: "#9ca3af" }}>식물 사진을 올려주세요</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="file-upload-plant"
          />
          <label
            htmlFor="file-upload-plant"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "#3f6212",
              color: "white",
              borderRadius: "10px",
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
              background: loading
                ? "#6b7280"
                : "linear-gradient(135deg, #65a30d, #365314)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "진단 중..." : "분석 시작"}
          </button>
        </div>

        {/* 결과 */}
        {result && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "rgba(132, 204, 22, 0.2)",
              border: "1px solid #84cc16",
              borderRadius: "15px",
            }}
          >
            <h2 style={{ margin: "0 0 10px 0", color: "#a3e635" }}>
              📋 결과 리포트
            </h2>
            <p style={{ fontSize: "1.2rem", color: "white" }}>
              진단명: <strong>{result.label}</strong>
            </p>
            <p style={{ color: "#d1d5db" }}>확률: {result.confidence}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
