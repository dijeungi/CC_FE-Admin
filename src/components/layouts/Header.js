import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutPost } from '../../api/loginApi';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../common/AlertModal';
import { logout } from '../../slices/loginSlice';
import styles from '../../styles/Header.module.css';

const Header = () => {
  const { id } = useSelector((state) => state.loginSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutPost();
      dispatch(logout());
      setAlertMessage('로그아웃이 되었습니다');
      setOpenAlert(true);
    } catch (error) {
      setAlertMessage('로그아웃 처리 중 오류가 발생했습니다');
      setOpenAlert(true);
    }
  };

  const checkLoginAndNavigate = (path) => {
    if (!id) {
      setAlertMessage('로그인을 해주세요!');
      setOpenAlert(true);
      return false;
    }
    navigate(path);
    return true;
  };

  const menuItems = [
    { text: '홈', path: '/', onClick: () => checkLoginAndNavigate('/') },
    {
      text: '공통코드',
      path: '/common',
      onClick: () => checkLoginAndNavigate('/common'),
    },
    {
      text: '공연',
      path: '/festival',
      onClick: () => checkLoginAndNavigate('/festival'),
    },
    {
      text: '등록허가',
      path: '/access',
      onClick: () => checkLoginAndNavigate('/access'),
    },
    {
      text: '배우',
      path: '/actor',
      onClick: () => checkLoginAndNavigate('/actor'),
    },
    {
      text: '회원',
      path: '/member',
      onClick: () => checkLoginAndNavigate('/member'),
    },
    {
      text: '결제내역',
      path: '/payment',
      onClick: () => checkLoginAndNavigate('/payment'),
    },
    {
      text: id ? '로그아웃' : '로그인',
      path: '/login',
      onClick: id ? handleLogout : () => navigate('/login'),
    },
  ];

  const handleCloseAlert = () => {
    setOpenAlert(false);
    if (!id) {
      navigate('/login');
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.navbar}>
          <h1 className={styles.title}>CampusConcert 관리페이지</h1>
          <nav className={styles.menuBox}>
            {menuItems.map((item) => (
              <button
                key={item.text}
                onClick={item.onClick}
                className={styles.menuButton}
              >
                {item.text}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {mobileOpen && (
        <aside className={styles.drawer}>
          <div className={styles.drawerBox}>
            <ul>
              {menuItems.map((item) => (
                <li key={item.text}>
                  <Link to={item.path} onClick={handleDrawerToggle}>
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}

      <AlertModal
        open={openAlert}
        message={alertMessage}
        onClose={handleCloseAlert}
      />
    </>
  );
};

export default Header;
