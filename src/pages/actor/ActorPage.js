import React, { useEffect, useState } from 'react';
import { getList, remove } from '../../api/actorApi';
import { registerContentExcel } from '../../api/excelApi';
import Header from '../../components/layouts/Header';
import PageComponent from '../../components/common/PageComponent';
import AlertModal from '../../components/common/AlertModal';
import UploadModal from '../../components/common/UploadModal';
import ActorModal from '../../components/actor/ActorModel';
import styles from '../../styles/ActorPage.module.css';

const ActorPage = () => {
  const [contents, setContents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);

  const fetchContents = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      name: searchTerm,
    };

    try {
      const response = await getList(params);
      setContents(response.dtoList || []);
      setTotalPages(response.totalPage || 0);
    } catch (error) {
      console.error('콘텐츠 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (content) => {
    setSelectedContent(content);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await remove(selectedContent.id);
      setDeleteModalOpen(false);
      fetchContents();
    } catch (error) {
      console.error('콘텐츠 삭제 실패:', error);
    }
  };

  const handleContentSubmit = async (newContent) => {
    try {
      console.log('배우 등록 데이터:', newContent);
      setShowContentModal(false);
      fetchContents();
    } catch (error) {
      console.error('배우 등록 실패:', error);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      await registerContentExcel(file);
      setShowUploadModal(false);
      setUploadModalOpen(true);
      fetchContents();
    } catch (error) {
      console.error('엑셀 업로드 실패:', error);
    }
  };

  return (
    <div className={styles.actorPage}>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>배우 관리</h1>

          <div className={styles.searchCard}>
            <div className={styles.searchCardContent}>
              <input
                type="text"
                placeholder="공연명, 등장인물 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <button onClick={fetchContents} className={styles.searchButton}>
                <span className={styles.searchIcon}>🔍</span>
              </button>
            </div>
          </div>

          <div className={styles.headerButtons}>
            <button
              className={styles.addButton}
              onClick={() => setShowContentModal(true)}
            >
              배우 등록
            </button>
            <button
              className={styles.uploadButton}
              onClick={() => setShowUploadModal(true)}
            >
              엑셀 업로드
            </button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeaderRow}>
                <th className={`${styles.tableHeaderCell} $ ${styles.count}`}>
                  순번
                </th>
                <th className={`${styles.tableHeaderCell} $ ${styles.name}`}>
                  공연명
                </th>
                <th
                  className={`${styles.tableHeaderCell} $ ${styles.character}`}
                >
                  배역
                </th>
                <th
                  className={`${styles.tableHeaderCell} $ ${styles.actorname}`}
                >
                  성명
                </th>
                <th className={styles.tableHeaderCellCenter}>관리</th>
              </tr>
            </thead>
            <tbody>
              {contents.map((content, index) => (
                <tr key={content.id} className={styles.tableRow}>
                  <td className={`${styles.tableCell} ${styles.count}`}>
                    {index + 1}
                  </td>
                  <td className={`${styles.tableCell} ${styles.name}`}>
                    {content.festivalName}
                  </td>
                  <td className={`${styles.tableCell} ${styles.character}`}>
                    {content.actorCharacter}
                  </td>
                  <td className={`${styles.tableCell} ${styles.actorname}`}>
                    {content.actorName}
                  </td>
                  <td
                    className={`${styles.tableCell} ${styles.tableCellCenter}`}
                  >
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(content)}
                    >
                      <span className={styles.deleteIcon}>🗑</span>
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
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="콘텐츠 삭제"
        message="정말 삭제하시겠습니까?"
        isSuccess={false}
        onConfirm={handleDeleteConfirm}
      />
      <AlertModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="엑셀 업로드"
        message="업로드가 완료되었습니다!"
        isSuccess={true}
        onConfirm={() => setUploadModalOpen(false)}
      />
      <ActorModal
        open={showContentModal}
        handleClose={() => setShowContentModal(false)}
        title="배우 등록"
        onSubmit={handleContentSubmit}
      />
      <UploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
};

export default ActorPage;
