import React, { useEffect, useState } from 'react';
import { getList, remove } from '../../api/festivalApi';
import { registerProductExcel, downloadProductExcel } from '../../api/excelApi';
import PageComponent from '../../components/common/PageComponent';
import AlertModal from '../../components/common/AlertModal';
import UploadModal from '../../components/common/UploadModal';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/FestivalPage.module.css';

const FestivalPage = () => {
  const [festivals, setFestivals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFestivals, setSelectedFestivals] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const fetchFestivals = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      name: searchTerm,
    };

    try {
      const response = await getList(params);
      setFestivals(response.dtoList || []);
      setTotalPages(response.totalPage || 0);
    } catch (error) {
      console.error('공연 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, [page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (festival) => {
    setSelectedFestival(festival);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await remove(selectedFestival.id);
      setDeleteModalOpen(false);
      fetchFestivals();
    } catch (error) {
      console.error('공연 삭제 실패:', error);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      await registerProductExcel(file);
      setShowUploadModal(false);
      setUploadModalOpen(true);
      fetchFestivals();
    } catch (error) {
      console.error('엑셀 업로드 실패:', error);
    }
  };

  const handleSelectProduct = (festivalId) => {
    setSelectedFestivals((prev) => {
      if (prev.includes(festivalId)) {
        return prev.filter((id) => id !== festivalId);
      } else {
        return [...prev, festivalId];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedFestivals(festivals.map((festival) => festival.id));
    } else {
      setSelectedFestivals([]);
    }
  };

  const handleDownload = async () => {
    if (selectedFestivals.length === 0) {
      setAlertMessage('공연 체크를 먼저 해주셔야 합니다!');
      setShowAlert(true);
      return;
    }
    try {
      const response = await downloadProductExcel(selectedFestivals);
      console.log('Download response headers:', response.headers);
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'products.xlsx';
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="(.+)"/);
        if (matches && matches[1]) {
          filename = decodeURIComponent(matches[1]);
        }
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Excel download failed:', error);
      setAlertMessage('다운로드 중 오류가 발생했습니다.');
      setShowAlert(true);
    }
  };

  return (
    <div className={styles.festivalPage}>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>공연 관리</h1>

          <div className={styles.searchCard}>
            <div className={styles.searchCardContent}>
              <input
                type="text"
                placeholder="공연명 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <button onClick={fetchFestivals} className={styles.searchButton}>
                <span className={styles.searchIcon}>🔍</span>
              </button>
            </div>
          </div>

          {/* 엑셀 업로드/다운로드 버튼 영역 (필요시 주석 해제) */}
          {/*
          <div className={styles.buttonGroup}>
            <button className={styles.uploadButton} onClick={() => setShowUploadModal(true)}>
              엑셀 업로드
            </button>
            <button className={styles.downloadButton} onClick={handleDownload}>
              엑셀 다운로드
            </button>
          </div>
          */}
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeaderRow}>
                {/* <th className={styles.tableHeaderCell}>
                  <input
                    type="checkbox"
                    checked={
                      selectedFestivals.length === festivals.length &&
                      festivals.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th> */}
                <th className={`${styles.tableHeaderCell} ${styles.count}`}>
                  순번
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.category}`}>
                  카테고리
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.festivalname}`}
                >
                  공연명
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.region}`}>
                  지역
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.startDate}`}>
                  시작일
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.endDate}`}>
                  종료일
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.state}`}>
                  공연상태
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.discount}`}>
                  할인율
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.price}`}>
                  가격
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.discountPrice}`}
                >
                  할인가격
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.time}`}>
                  상영시간
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.age}`}>
                  연령가
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.mdPick}`}>
                  MD PICK
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.aww}`}>
                  수상작유무
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.ranking}`}>
                  인기순위
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.manage}`}>
                  관리
                </th>
              </tr>
            </thead>
            <tbody>
              {festivals.map((festival, index) => (
                <tr key={festival.id} className={styles.tableRow}>
                  {/* <td className={styles.tableCell}>
                    <input
                      type="checkbox"
                      checked={selectedFestivals.includes(festival.id)}
                      onChange={() => handleSelectProduct(festival.id)}
                    />
                  </td> */}
                  <td className={styles.tableCell}>{index + 1}</td>
                  <td className={styles.tableCell}>{festival.categoryId}</td>
                  <td className={styles.tableCell}>{festival.festivalName}</td>
                  <td className={styles.tableCell}>{festival.placeName}</td>
                  <td className={styles.tableCell}>{festival.fromDate}</td>
                  <td className={styles.tableCell}>{festival.toDate}</td>
                  <td className={styles.tableCell}>
                    {festival.festivalStateName}
                  </td>
                  <td className={styles.tableCell}>
                    {festival.salePercent?.toLocaleString()}%
                  </td>
                  <td className={styles.tableCell}>
                    {festival.festivalPrice?.toLocaleString()}원
                  </td>
                  <td className={styles.tableCell}>
                    {festival.salePrice?.toLocaleString()}원
                  </td>
                  <td className={styles.tableCell}>{festival.runningTime}</td>
                  <td className={styles.tableCell}>{festival.age}</td>
                  <td className={styles.tableCell}>{festival.mdPick}</td>
                  <td className={styles.tableCell}>{festival.premier}</td>
                  <td className={styles.tableCell}>{festival.ranking}</td>
                  <td
                    className={`${styles.tableCell} ${styles.tableCellCenter}`}
                  >
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(festival)}
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
        title="공연 삭제"
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
      <AlertModal
        open={showAlert}
        onClose={() => setShowAlert(false)}
        title="알림"
        message={alertMessage}
        isSuccess={false}
        onConfirm={() => setShowAlert(false)}
      />
      <UploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
};

export default FestivalPage;
