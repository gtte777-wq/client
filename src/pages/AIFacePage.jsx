import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Home.css";

import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
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
    formData.append("modelType", "face"); // 🚨 파이썬한테 보낼 이름

    try {
      const response = await fetch("http://localhost:8080/api/ai-predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResult(data.result);

        // 👇 [저장 코드] 인물용 이름표
        try {
          await addDoc(collection(db, "ai_history"), {
            modelType: "인물 신원 확인", // 📝 기록실에 보여질 이름
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
      <div
        className="home-content-container"
        style={{ maxWidth: "600px", border: "1px solid #06b6d4" }}
      >
        {/* 1. 헤더 & 뒤로가기 버튼 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
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
            onClick={() =>
              navigate(-1)
            } /* ⬅️ 뒤로 가기 기능 (이전 페이지로 이동) */
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "1px solid rgba(34, 211, 238, 0.5)",
              background: "rgba(0,0,0,0.5)",
              color: "#22d3ee",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ↩ 뒤로 가기
          </button>
        </div>

        {/* 2. 🚨 인식 가능 인물 안내 (요청하신 부분) */}
        <div
          style={{
            background: "rgba(6, 182, 212, 0.1)",
            border: "1px dashed #22d3ee",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "30px",
            textAlign: "left",
          }}
        >
          <p
            style={{
              margin: "0 0 10px 0",
              color: "#67e8f9",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            📋 현재 식별 가능한 인물 (DB)
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {/* 5명 이름표 배지 */}
            {[
              "강호동",
              "카리나",
              "박명수",
              "앤서니 조슈아",
              "프란시스 은가누",
            ].map((name, idx) => (
              <span
                key={idx}
                style={{
                  background: "rgba(34, 211, 238, 0.2)",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "15px",
                  fontSize: "0.85rem",
                  border: "1px solid rgba(34, 211, 238, 0.3)",
                }}
              >
                {name}
              </span>
            ))}
          </div>
          <p
            style={{
              margin: "10px 0 0 0",
              color: "#9ca3af",
              fontSize: "0.8rem",
            }}
          >
            * 위 5명 외의 인물은 'Unknown'으로 표시될 수 있습니다.
          </p>
        </div>

        {/* 3. 업로드 영역 */}
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
              <span style={{ color: "#0891b2" }}>분석할 사진을 올려주세요</span>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="file-upload-face"
          />
          <label
            htmlFor="file-upload-face"
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

        {/* 4. 결과 영역 */}
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
