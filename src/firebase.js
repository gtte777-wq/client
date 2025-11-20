import { initializeApp, getApps, getApp } from "firebase/app"; // 👈 getApps, getApp 추가
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMupDsXUrSD_OlVVA4sXdSYoAF3eFMQ0M",
  authDomain: "hobby-b6440.firebaseapp.com",
  projectId: "hobby-b6440",
  storageBucket: "hobby-b6440.firebaseapp.com",
  messagingSenderId: "545763773120",
  appId: "1:545763773120:web:db79b30420ccae2fe87b25",
  measurementId: "G-R5CBNBY2G4",
};

// 🚨 [수정] 중복 초기화 방지 로직
// "현재 실행된 앱의 개수(getApps().length)가 0보다 크면? -> 기존 앱 가져오기(getApp)"
// "아니면? -> 새로 초기화하기(initializeApp)"
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
