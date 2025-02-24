import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import style from '../../styles/MainLayout.module.css';

export default function MainLayout() {
  return (
    <div className={style.layout}>
      <Header />
      <Outlet />
    </div>
  );
}
