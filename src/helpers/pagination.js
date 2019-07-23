const { url, API_VERSION } = process.env;

/**
 * @description - pagination query metadata
 *
 * @param {number} page the page number
 * @param {number} limit number of items on a page
 *
 * @returns {object} limit and offset to query the database
 */

export const paginationQueryMetadata = (page = 1, limit = 10) => {
  const pageNumber = page <= 0 ? 1 : page;
  const pageLimit = limit <= 0 ? 10 : limit;
  return { limit: pageLimit, offset: pageLimit * (pageNumber - 1) };
};

/**
 * @description - page metadata
 *
 * @param {number} page the page number
 * @param {number} limit number of items on a page
 * @param {number} totalItems total number of items in the database
 * @param {string} entity the entity to query
 *
 * @returns {object} totalItems, previousPage, currentPage, nextPage, totalPages
 */

export const pageMetadata = (page = 1, limit = 10, totalItems, entity = '') => {
  let pageNumber = page <= 0 ? 1 : page;
  const pageLimit = limit <= 0 ? 10 : limit;
  const totalPages = Math.ceil(totalItems / pageLimit);
  pageNumber = parseInt(pageNumber, 10);
  const previousPage =
    pageNumber > 1
      ? `${url}${API_VERSION}${entity}?page=${pageNumber -
          1}&limit=${pageLimit}`
      : null;
  const currentPage = pageNumber;
  const nextPage =
    pageNumber < totalPages
      ? `${url}${API_VERSION}${entity}?page=${pageNumber +
          1}&limit=${pageLimit}`
      : null;
  if (page > totalPages) {
    return 'No content on this page';
  }
  return {
    totalItems,
    previousPage,
    currentPage,
    nextPage,
    totalPages
  };
};
