import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductPage from './pages/product/ProductPage';
import MemberPage from './pages/MemberPage';
import OrderPage from './pages/OrderPage';
import ContentPage from './pages/ContentPage';
import CategoryPage from './pages/category/CategoryPage';
import ProductRegisterPage from './pages/product/ProductRegisterPage';
import ProductDetailPage from './pages/product/ProductDetailPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<HomePage />} />
        {/* 로그인 */}
        <Route path="/login" element={<LoginPage />} />
        {/* 카테고리 */}
        <Route path="/category" element={<CategoryPage />} />
        {/* 상품 */}
        {/* 상품조회 */}
        <Route path="/product" element={<ProductPage />} />
        {/* 상품등록 */}
        <Route path="/product/register" element={<ProductRegisterPage />} />
        {/* 상품상세 */}
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        {/* 콘텐츠 */}
        <Route path="/content" element={<ContentPage />} />
        {/* 회원 */}
        <Route path="/member" element={<MemberPage />} />
        {/* 주문 */}
        <Route path="/order" element={<OrderPage />} />
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
