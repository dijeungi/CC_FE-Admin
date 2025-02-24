import React from 'react';
import styles from '../styles/HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.content}>
        <h1 className={styles.title}>관리자 대시보드</h1>
        <div className={styles.dashboardGrid}>
          <DashboardCard title="총 공연" value="69" />
          <DashboardCard title="총 배우" value="1,000" />
          <DashboardCard title="신규 회원" value="12" />
          <DashboardCard title="문의사항" value="5" />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value }) => (
  <div className={styles.dashboardCard}>
    <h3 className={styles.dashboardCardTitle}>{title}</h3>
    <p className={styles.dashboardCardValue}>{value}</p>
  </div>
);

export default HomePage;
