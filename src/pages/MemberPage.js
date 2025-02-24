import React, { useEffect, useState } from 'react';
import { getList, remove } from '../api/memberApi';
import AlertModal from '../components/common/AlertModal';
import PageComponent from '../components/common/PageComponent';
import Header from '../components/layouts/Header';
import styles from '../styles/MemberPage.module.css';

const MemberPage = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchMembers = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      name: searchTerm,
      categoryId: null,
    };

    try {
      const response = await getList(params);
      setMembers(response.dtoList || []);
      setTotalPages(response.totalPage || 0);
    } catch (error) {
      console.error('회원 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDeleteClick = (member) => {
    setSelectedMember(member);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await remove(selectedMember.id);
      setDeleteModalOpen(false);
      fetchMembers();
    } catch (error) {
      console.error('회원 삭제 실패:', error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div className={styles.memberPage}>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>회원 관리</h1>
        </div>

        <div className={styles.searchCard}>
          <input
            type="text"
            placeholder="회원명 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button onClick={fetchMembers} className={styles.searchButton}>
            <span className={styles.searchIcon}>🔍</span>
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeaderRow}>
                <th className={styles.tableHeaderCell}>ID</th>
                <th className={styles.tableHeaderCell}>이름</th>
                <th className={styles.tableHeaderCell}>이메일</th>
                <th className={styles.tableHeaderCell}>전화번호</th>
                <th className={styles.tableHeaderCell}>등록일</th>
                <th className={styles.tableHeaderCell}>수정일</th>
                <th className={styles.tableHeaderCellCenter}>관리</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{member.id}</td>
                  <td className={styles.tableCell}>{member.name}</td>
                  <td className={styles.tableCell}>{member.email}</td>
                  <td className={styles.tableCell}>{member.phone}</td>
                  <td className={styles.tableCell}>{member.createdAt}</td>
                  <td className={styles.tableCell}>{member.modifiedAt}</td>
                  <td
                    className={`${styles.tableCell} ${styles.tableCellCenter}`}
                  >
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(member)}
                    >
                      <span className={styles.deleteIcon}>🗑</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AlertModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="회원 삭제"
          message="정말 삭제하시겠습니까?"
          isSuccess={false}
          onConfirm={handleDeleteConfirm}
        />

        <PageComponent
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default MemberPage;
