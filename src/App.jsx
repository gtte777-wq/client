import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import BoardList from "./pages/BoardList.jsx";
import MemoUpsert from "./pages/MemoUpsert.jsx";
import NewsList from "./pages/NewsList.jsx";
import About from "./pages/About.jsx";
import CalculatorPage from "./pages/CalculatorPage.jsx"; // 새로 만든 계산기 페이지 임포트
import Profile from "./pages/Profile.jsx"; // Profile 페이지 임포트
import MemoDetail from "./pages/MemoDetail.jsx"; // 새로 만든 상세 페이지 임포트
import StockChartPage from "./pages/StockChartPage.jsx";
import AIPage from "./pages/AIPage.jsx";
import AIMuffinPage from "./pages/AIMuffinPage.jsx";
import AIPlantPage from "./pages/AIPlantPage.jsx";
import AIRicePage from "./pages/AIRicePage.jsx";
import AIFacePage from "./pages/AIFacePage.jsx";
import AIHistoryPage from "./pages/AIHistoryPage.jsx";
import StockPredictPage from './pages/StockPredictPage';
import GamePage from './pages/GamePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Profile />} />
      <Route path="/home" element={<Home />} />{" "}
      {/* /home 경로를 대시보드로 설정 */}
      <Route path="/board" element={<BoardList />} />
      <Route path="/write" element={<MemoUpsert />} />{" "}
      <Route path="/news" element={<NewsList />} />
      <Route path="/stock" element={<StockChartPage />} />{" "}
      <Route path="/about" element={<About />} />
      <Route path="/detail/:postId" element={<MemoDetail />} />{" "}
      <Route path="/calculator" element={<CalculatorPage />} />{" "}
      <Route path="/predict" element={<StockPredictPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="*" element={<Profile />} />{" "}
      {/* 일치하는 경로가 없으면 첫 화면으로 */}
      <Route path="/ai" element={<AIPage />} />
      <Route path="/ai/muffin" element={<AIMuffinPage />} />
      <Route path="/ai/plant" element={<AIPlantPage />} />
      <Route path="/ai/rice" element={<AIRicePage />} />
      <Route path="/ai/face" element={<AIFacePage />} />
      <Route path="/ai/history" element={<AIHistoryPage />} />
    </Routes>
  );
}
