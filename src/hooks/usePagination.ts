import { useState, useMemo } from 'react';

export interface PaginationOptions {
  page: number;
  pageSize: number;
  total: number;
}

export const usePagination = <T>(items: T[], initialPageSize: number = 25) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }, [items, page, pageSize]);

  const totalPages = Math.ceil(items.length / pageSize);

  const goToPage = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const changePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  return {
    page,
    pageSize,
    totalPages,
    total: items.length,
    paginatedItems,
    goToPage,
    changePageSize,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
