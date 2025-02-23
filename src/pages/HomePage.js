import React from 'react';
import Header from '../components/layouts/Header';

const HomePage = () => {
  return (
    <div style={{ backgroundColor: '#FFF0FB', minHeight: '100vh' }}>
      <Header />
      <div style={{ padding: '2rem' }}>
        <h1
          style={{
            color: '#333',
            fontSize: '2.5rem',
            marginBottom: '2rem',
          }}
        >
          관리자 대시보드
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* 대시보드 카드들 */}
          <DashboardCard title="총 공연" value="69" />
          <DashboardCard title="총 배우" value="1,000" />
          <DashboardCard title="신규 회원" value="12" />
          <DashboardCard title="문의사항" value="5" />
        </div>
      </div>
    </div>
  );
};

// 대시보드 카드 컴포넌트
const DashboardCard = ({ title, value }) => (
  <div
    style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      cursor: 'pointer',
      ':hover': {
        transform: 'translateY(-5px)',
      },
    }}
  >
    <h3
      style={{
        color: '#666',
        marginBottom: '1rem',
      }}
    >
      {title}
    </h3>
    <p
      style={{
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#FFB7F2',
      }}
    >
      {value}
    </p>
  </div>
);

export default HomePage;
