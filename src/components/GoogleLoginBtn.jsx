import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FaGoogle } from "react-icons/fa"; // 흰색 아이콘 (FaGoogle 사용 가정)

export default function GoogleLoginBtn({ onLoginSuccess }) {
  // ... (handleLogin 함수는 동일)
  const handleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        padding: "10px 20px",
        // === 수정된 스타일 (다크 모드) ===
        backgroundColor: "#000000", // 배경을 검은색으로
        color: "white", // 텍스트 색상을 흰색으로 변경
        border: "none",
        // ================================
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        transition: "background-color 0.2s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333333")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#000000")}
    >
      <FaGoogle size={20} color="white" /> {/* 흰색 아이콘으로 변경 가정 */}
      **Google 계정으로 로그인**
    </button>
  );
}
