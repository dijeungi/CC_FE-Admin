import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import FestivalPage from './pages/festival/FestivalPage';
import AccessPage from './pages/festival/AccessPage';
import MemberPage from './pages/MemberPage';
import OrderPage from './pages/order/OrderPage';
import ActorPage from './pages/actor/ActorPage';
import CommonPage from './pages/common/CommonPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<HomePage />} />
        {/* 로그인 */}
        <Route path="/login" element={<LoginPage />} />
        {/* 공통코드 */}
        <Route path="/common" element={<CommonPage />} />
        {/* 공연 */}
        {/* 공연조회 */}
        <Route path="/festival" element={<FestivalPage />} />
        {/* 동록허가 */}
        <Route path="/access" element={<AccessPage />} />
        {/* 공연등록 */}
        {/* <Route path="/product/register" element={<ProductRegisterPage />} /> */}
        {/* 공연상세 */}
        {/* <Route path="/product/:productId" element={<ProductDetailPage />} /> */}
        {/* 배우 */}
        <Route path="/actor" element={<ActorPage />} />
        {/* 회원 */}
        <Route path="/member" element={<MemberPage />} />
        {/* 결제 */}
        <Route path="/payment" element={<OrderPage />} />
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
