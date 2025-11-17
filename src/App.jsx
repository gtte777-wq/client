import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import BoardList from './pages/BoardList.jsx'; 
import MemoUpsert from './pages/MemoUpsert.jsx';
import NewsList from './pages/NewsList.jsx';
import About from './pages/About.jsx';
import CalculatorPage from './pages/CalculatorPage.jsx'; // 새로 만든 계산기 페이지 임포트
import Profile from './pages/Profile.jsx'; // Profile 페이지 임포트
import MemoDetail from './pages/MemoDetail.jsx'; // 새로 만든 상세 페이지 임포트

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Profile />} /> {/* 첫 화면을 Profile로 설정 */}
      <Route path="/home" element={<Home />} /> {/* /home 경로를 대시보드로 설정 */}
      <Route path="/board" element={<BoardList />} /> 
      <Route path="/write" element={<MemoUpsert />} /> {/* '/write' 경로를 MemoUpsert 컴포넌트로 연결 */}
      <Route path="/news" element={<NewsList />} />
      <Route path="/about" element={<About />} />
      <Route path="/detail/:postId" element={<MemoDetail />} /> {/* 상세 페이지 경로 추가 */}
      <Route path="/calculator" element={<CalculatorPage />} /> {/* /calculator 경로 추가 */}
      <Route path="*" element={<Profile />} /> {/* 일치하는 경로가 없으면 첫 화면으로 */}
    </Routes>
  );
}