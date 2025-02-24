import React, { useEffect, useState } from 'react';
import AlertModal from '../../components/common/AlertModal';
import PageComponent from '../../components/common/PageComponent';
import { getList, refund } from '../../api/orderApi';
import styles from '../../styles/OrderPage.module.css';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFestivalName, setSearchFestivalName] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('');

  const fetchOrders = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      name: searchTerm,
      festivalName: searchFestivalName,
      refundState: paymentStatus,
    };

    try {
      const response = await getList(params);
      setOrders(response.dtoList || []);
      setTotalPages(response.totalPage || 0);
    } catch (error) {
      console.error('주문 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, paymentStatus]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRefundClick = (order) => {
    setSelectedOrder(order);
    setRefundModalOpen(true);
  };

  const handleRefundConfirm = async () => {
    setRefundModalOpen(false);
    try {
      await refund(selectedOrder.orderId, selectedOrder.locationNum);
      fetchOrders();
    } catch (error) {
      console.error('환불 실패:', error);
    }
  };

  return (
    <div className={styles.orderPage}>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>결제내역 관리</h1>
        </div>

        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.searchRow}>
              <div className={styles.searchInputWrapper}>
                <input
                  type="text"
                  placeholder="회원명 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                <button onClick={fetchOrders} className={styles.searchButton}>
                  <span className={styles.searchIcon}>🔍</span>
                </button>
              </div>
              <div className={styles.searchInputWrapper}>
                <input
                  type="text"
                  placeholder="공연명 검색"
                  value={searchFestivalName}
                  onChange={(e) => setSearchFestivalName(e.target.value)}
                  className={styles.searchInput}
                />
                <button onClick={fetchOrders} className={styles.searchButton}>
                  <span className={styles.searchIcon}>🔍</span>
                </button>
              </div>
              <div className={styles.selectWrapper}>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="">결제 상태 선택</option>
                  <option value="ALL">전체</option>
                  <option value="YET">결제완료</option>
                  <option value="REQUEST">환불신청</option>
                  <option value="COMPLETED">환불완료</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeaderRow}>
                <th className={styles.tableHeaderCell}>순번</th>
                <th className={styles.tableHeaderCell}>결제코드</th>
                <th className={styles.tableHeaderCell}>회원명</th>
                <th className={styles.tableHeaderCell}>공연명</th>
                <th className={styles.tableHeaderCell}>공연일시</th>
                <th className={styles.tableHeaderCell}>좌석</th>
                <th className={styles.tableHeaderCell}>결제일</th>
                <th className={styles.tableHeaderCell}>결제상태</th>
                <th className={styles.tableHeaderCell}>결제총금액</th>
                <th className={styles.tableHeaderCellCenter}>관리</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.orderId} className={styles.tableRow}>
                  <td className={styles.tableCell}>{index + 1}</td>
                  <td className={styles.tableCell}>{order.orderId}</td>
                  <td className={styles.tableCell}>{order.userName}</td>
                  <td className={styles.tableCell}>{order.festivalName}</td>
                  <td className={styles.tableCell}>{order.date}</td>
                  <td className={styles.tableCell}>{order.locationNum}</td>
                  <td className={styles.tableCell}>{order.paymentDate}</td>
                  <td className={styles.tableCell}>{order.refundStateName}</td>
                  <td className={styles.tableCell}>
                    {order.totalPrice.toLocaleString()}원
                  </td>
                  <td
                    className={`${styles.tableCell} ${styles.tableCellCenter}`}
                  >
                    {order.refundStateName === '결제완료' && (
                      <button
                        className={styles.refundButton}
                        onClick={() => handleRefundClick(order)}
                      >
                        환불
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PageComponent
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>

      <AlertModal
        open={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        title="티켓환불"
        message="정말 환불하시겠습니까?"
        isSuccess={false}
        onConfirm={handleRefundConfirm}
      />
    </div>
  );
};

export default OrderPage;
