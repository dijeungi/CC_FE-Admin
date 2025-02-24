import React, { useEffect, useState } from 'react';
import AlertModal from '../../components/common/AlertModal';
import PageComponent from '../../components/common/PageComponent';
import { useNavigate } from 'react-router-dom';
import { getApplyList, accessRegister, refusal } from '../../api/festivalApi';
import styles from '../../styles/AccessPage.module.css';

const AccessPage = () => {
  const [applys, setApplys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [refusalModalOpen, setRefusalModalOpen] = useState(false);
  const [selectedApply, setSelectedApply] = useState(null);
  const navigate = useNavigate();

  const fetchApplys = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      name: searchTerm,
    };

    try {
      const response = await getApplyList(params);
      setApplys(response.dtoList || []);
      setTotalPages(response.totalPage || 0);
    } catch (error) {
      console.error('등록 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchApplys();
  }, [page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAccessClick = (apply) => {
    setSelectedApply(apply);
    setAccessModalOpen(true);
  };

  const handleRefusalClick = (apply) => {
    setSelectedApply(apply);
    setRefusalModalOpen(true);
  };

  const handleAccessConfirm = async () => {
    setAccessModalOpen(false);
    try {
      await accessRegister(selectedApply.accessId, selectedApply.festivalId);
      fetchApplys();
    } catch (error) {
      console.error('등록승인 실패:', error);
    }
  };

  const handleRefusalConfirm = async () => {
    setRefusalModalOpen(false);
    try {
      await refusal(selectedApply.festivalId);
      fetchApplys();
    } catch (error) {
      console.error('등록거부 실패:', error);
    }
  };

  return (
    <div className={styles.accessPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>공연등록 관리</h1>
        </div>

        <div className={styles.searchCard}>
          <div className={styles.searchCardContent}>
            <input
              type="text"
              placeholder="공연명 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button onClick={fetchApplys} className={styles.searchButton}>
              <span className={styles.searchIcon}>🔍</span>
            </button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeaderRow}>
                <th className={`${styles.tableHeaderCell} ${styles.count}`}>
                  순번
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.name}`}>
                  공연명
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.url}`}>
                  참고영상 URL
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.manage}`}>
                  관리
                </th>
              </tr>
            </thead>
            <tbody>
              {applys.map((apply, index) => (
                <tr key={apply.accessId} className={styles.tableRow}>
                  <td className={styles.tableCell}>{index + 1}</td>
                  <td className={styles.tableCell}>{apply.festivalName}</td>
                  <td className={styles.tableCell}>
                    {apply.festivalMediaLink}
                  </td>
                  <td
                    className={`${styles.tableCell} ${styles.tableCellCenter}`}
                  >
                    <button
                      className={styles.approveButton}
                      onClick={() => handleAccessClick(apply)}
                    >
                      승인
                    </button>
                    <button
                      className={styles.rejectButton}
                      onClick={() => handleRefusalClick(apply)}
                    >
                      거부
                    </button>
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
        open={accessModalOpen}
        onClose={() => setAccessModalOpen(false)}
        title="등록승인"
        message="정말 승인하시겠습니까?"
        isSuccess={false}
        onConfirm={handleAccessConfirm}
      />
      <AlertModal
        open={refusalModalOpen}
        onClose={() => setRefusalModalOpen(false)}
        title="등록거부"
        message="정말 거부하시겠습니까?"
        isSuccess={false}
        onConfirm={handleRefusalConfirm}
      />
    </div>
  );
};

export default AccessPage;
