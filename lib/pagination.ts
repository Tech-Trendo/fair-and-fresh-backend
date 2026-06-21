export function paginate<T>(
  items: T[],
  requestUrl: URL,
  defaultPageSize: number = 10,
  maxPageSize: number = 100
) {
  const searchParams = requestUrl.searchParams;
  
  const pageStr = searchParams.get('page');
  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const currentPage = isNaN(page) || page < 1 ? 1 : page;

  const pageSizeStr = searchParams.get('page_size');
  const limit = pageSizeStr ? parseInt(pageSizeStr, 10) : defaultPageSize;
  const currentPageSize = isNaN(limit) || limit < 1 ? defaultPageSize : Math.min(limit, maxPageSize);

  const totalCount = items.length;
  const totalPages = Math.ceil(totalCount / currentPageSize);

  const startIdx = (currentPage - 1) * currentPageSize;
  const endIdx = startIdx + currentPageSize;

  const paginatedItems = items.slice(startIdx, endIdx);

  let nextUrl: string | null = null;
  if (currentPage < totalPages) {
    const nextUrlObj = new URL(requestUrl.toString());
    nextUrlObj.searchParams.set('page', String(currentPage + 1));
    nextUrlObj.searchParams.set('page_size', String(currentPageSize));
    nextUrl = nextUrlObj.pathname + nextUrlObj.search;
  }

  let previousUrl: string | null = null;
  if (currentPage > 1 && currentPage <= totalPages + 1) {
    const prevUrlObj = new URL(requestUrl.toString());
    prevUrlObj.searchParams.set('page', String(currentPage - 1));
    prevUrlObj.searchParams.set('page_size', String(currentPageSize));
    previousUrl = prevUrlObj.pathname + prevUrlObj.search;
  }

  return {
    count: totalCount,
    next: nextUrl,
    previous: previousUrl,
    results: paginatedItems,
  };
}
