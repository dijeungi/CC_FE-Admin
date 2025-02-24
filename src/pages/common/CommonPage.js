import React, { useEffect, useState } from 'react';
import CategoryModal from '../../components/category/CategoryModal';
import CategoryEditModal from '../../components/category/CategoryEditModal';
import AlertModal from '../../components/common/AlertModal';
import PageComponent from '../../components/common/PageComponent';
import {
  getProductCategoryList,
  registerProductCategory,
  editProductCategory,
  removeProductCategory,
} from '../../api/categoryApi';
import styles from '../../styles/CategoryPage.module.css';

const CategoryPage = () => {
  const [productCategories, setProductCategories] = useState([]);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, [page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const fetchCategories = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
    };

    try {
      const response = await getProductCategoryList(params);
      setProductCategories(response.dtoList || []);
      setTotalPages(response.totalPage || 0);
    } catch (error) {
      console.error('공통코드 목록 로딩 실패:', error);
    }
  };

  const handleProductSubmit = async (formData) => {
    try {
      await registerProductCategory(formData);
      fetchCategories();
    } catch (error) {
      console.error('공통코드 등록 실패:', error);
    }
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleEditConfirm = async (formData) => {
    try {
      await editProductCategory(formData);
      setEditModalOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('공통코드 수정 실패:', error);
    }
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await removeProductCategory(selectedCategory.id);
      setDeleteModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('공통코드 삭제 실패:', error);
    }
  };

  return (
    <div className={styles.categoryPage}>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <div className={styles.headerRow}>
            <h1 className={styles.pageTitle}>공통코드 관리</h1>
            <button
              className={styles.addButton}
              onClick={() => setOpenProductModal(true)}
            >
              <span className={styles.addIcon}>＋</span> 공통코드 추가
            </button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.categoryTable}>
            <thead>
              <tr className={styles.tableHeaderRow}>
                <th className={`${styles.tableHeaderCell} ${styles.count}`}>
                  순번
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.codeId}`}>
                  코드ID
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.codeName}`}>
                  코드명
                </th>
                <th className={`${styles.tableHeaderCell} ${styles.used}`}>
                  사용유무
                </th>
                <th className={styles.tableHeaderCellCenter}>관리</th>
              </tr>
            </thead>
            <tbody>
              {productCategories.map((category, index) => (
                <tr key={category.id || index} className={styles.tableRow}>
                  <td className={styles.tableCell}>{index + 1}</td>
                  <td className={styles.tableCell}>{category.id}</td>
                  <td className={styles.tableCell}>{category.name}</td>
                  <td className={styles.tableCell}>{category.useYn}</td>
                  <td
                    className={`${styles.tableCell} ${styles.tableCellCenter}`}
                  >
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditClick(category)}
                    >
                      <span className={styles.editIcon}>✎</span>
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(category)}
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

        <CategoryModal
          open={openProductModal}
          handleClose={() => setOpenProductModal(false)}
          title="공통코드 등록"
          onSubmit={handleProductSubmit}
        />

        <CategoryEditModal
          open={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          title="공통코드 수정"
          category={{
            id: selectedCategory?.id || '',
            name: selectedCategory?.name || '',
            useYn: selectedCategory?.useYn || 'Y',
          }}
          onSubmit={handleEditConfirm}
        />

        <AlertModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="공통코드 삭제"
          message="정말 삭제하시겠습니까?"
          isSuccess={false}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
