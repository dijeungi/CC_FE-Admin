import React, { useState } from 'react';
import { loginPost } from '../api/loginApi';
import AlertModal from '../components/common/AlertModal';
import { login } from '../slices/loginSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styles from '../styles/LoginPage.module.css';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginPost(id, password);
      dispatch(
        login({
          id: result.id,
          roles: result.roles,
          accessToken: result.accessToken,
        }),
      );
      setIsSuccess(true);
      setAlertMessage('로그인이 성공하였습니다');
      setOpenAlert(true);
      setId('');
      setPassword('');
    } catch (error) {
      setIsSuccess(false);
      setAlertMessage(error.response.data.errMsg);
      setOpenAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    if (isSuccess) {
      navigate('/');
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>로그인</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="id" className={styles.label}>
              계정
            </label>
            <input
              type="text"
              id="id"
              name="id"
              autoComplete="id"
              autoFocus
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className={styles.inputField}
            />
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.inputField}
            />
            <button type="submit" className={styles.submitButton}>
              로그인
            </button>
          </form>
        </div>
      </div>
      <AlertModal
        open={openAlert}
        onClose={handleCloseAlert}
        title={isSuccess ? '로그인 성공' : '로그인 실패'}
        message={alertMessage}
        isSuccess={isSuccess}
      />
    </div>
  );
};

export default LoginPage;
