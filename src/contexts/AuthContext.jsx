// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut as firebaseSignOut, // Firebase의 signOut 함수를 구분하기 위해 이름 변경
} from "firebase/auth";

// 1. Context 객체 생성
const AuthContext = createContext({
  user: null, // 초기 사용자 정보는 null (로그아웃 상태)
  loading: true, // 초기 로딩 상태는 true
  logout: () => {}, // 초기 로그아웃 함수
});

// 2. Custom Hook: Context를 쉽게 사용할 수 있도록
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Provider 컴포넌트: 인증 상태를 관리하고 제공
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    // ⭐ 핵심: Firebase의 인증 상태 변화를 실시간으로 감지합니다.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // 로그인 시 User 객체, 로그아웃 시 null
      setLoading(false); // 상태 확인이 완료되면 로딩 종료
    });

    // 컴포넌트가 사라질 때(언마운트) 리스너를 해제하여 메모리 누수를 방지합니다.
    return () => unsubscribe();
  }, []); // 빈 배열은 컴포넌트 마운트 시 한 번만 실행됨을 의미

  // 로그아웃 함수
  const logout = () => {
    const auth = getAuth();
    // Firebase의 기본 로그아웃 함수 호출
    return firebaseSignOut(auth);
  };

  const value = {
    user,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* 로딩이 완료된 후에만 자식 컴포넌트들을 렌더링합니다. */}
      {loading ? <div>로딩 중...</div> : children}
    </AuthContext.Provider>
  );
}
