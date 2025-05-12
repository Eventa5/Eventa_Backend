export const getOffset = (page = 1, limit = 10): number => (page - 1) * limit; // default limit is 10

export interface PaginationInfo {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const getPagination = (totalItems: number, page = 1, limit = 10): PaginationInfo => {
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.min(Math.max(page, 1), totalPages || 1);

  return {
    currentPage,
    totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};
