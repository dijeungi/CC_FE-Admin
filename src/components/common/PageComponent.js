import React from 'react';
import styles from '../../styles/PageComponent.module.css';

function getDisplayedPages(page, totalPages) {
  const pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  if (page < 5) {
    for (let i = 1; i <= 5; i++) {
      pages.push(i);
    }
    pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  if (page > totalPages - 4) {
    pages.push(1);
    pages.push('...');
    for (let i = totalPages - 4; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);
  pages.push('...');
  pages.push(page - 1);
  pages.push(page);
  pages.push(page + 1);
  pages.push('...');
  pages.push(totalPages);

  return pages;
}

const PageComponent = ({ page, totalPages, handlePageChange }) => {
  const displayedPages = getDisplayedPages(page, totalPages);

  const handlePrev = () => {
    if (page > 1) {
      handlePageChange(null, page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      handlePageChange(null, page + 1);
    }
  };

  const onPageClick = (p) => {
    if (typeof p === 'number' && p !== page) {
      handlePageChange(null, p);
    }
  };

  return (
    <div className={styles.paginationWrapper}>
      {/* 이전 페이지 버튼 */}
      <button
        className={`${styles.arrowButton} ${page === 1 ? styles.disabled : ''}`}
        onClick={handlePrev}
        disabled={page === 1}
      >
        &lt;
      </button>

      {/* 페이지 번호들 */}
      {displayedPages.map((p, index) =>
        p === '...' ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            ...
          </span>
        ) : (
          <button
            key={`page-${p}`}
            onClick={() => onPageClick(p)}
            className={
              p === page
                ? `${styles.pageButton} ${styles.selected}`
                : styles.pageButton
            }
          >
            {p}
          </button>
        ),
      )}

      {/* 다음 페이지 버튼 */}
      <button
        className={`${styles.arrowButton} ${
          page === totalPages ? styles.disabled : ''
        }`}
        onClick={handleNext}
        disabled={page === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default PageComponent;
