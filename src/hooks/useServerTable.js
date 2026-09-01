import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance, { errorMessage } from "../config/AxiosInstance";

const EMPTY_META = { page: 1, limit: 8, total: 0, pageCount: 1 };

/**
 * One page of a list endpoint, with the search, sort and paging state that
 * asks for it.
 *
 * The screens used to pull an entire collection and filter it in the browser,
 * which is fine at fifty rows and hopeless at fifty thousand. Searching,
 * sorting and paging now happen in the database; this hook is the thin piece
 * that keeps the query string and the table in step.
 *
 * `dataKey` is the property the endpoint puts its rows under ("products",
 * "customers", "billinfo").
 */
export default function useServerTable({
  url,
  dataKey,
  initialPageSize = 8,
  initialSort = null,
  errorText = "Could not load the data",
}) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ ...EMPTY_META, limit: initialPageSize });
  const [loading, setLoading] = useState(true);

  // Page is zero-based here to match the table component.
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(initialSort || { key: null, dir: "asc" });

  // Typing should not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // A new search or page size starts again from the first page.
  useEffect(() => {
    setPage(0);
  }, [search, pageSize]);

  /* Responses can arrive out of order — a slow page 1 landing after a quick
     page 2 would show the wrong rows. Only the newest request may write. */
  const latest = useRef(0);

  const load = useCallback(async () => {
    const ticket = latest.current + 1;
    latest.current = ticket;

    try {
      setLoading(true);
      const res = await axiosInstance.get(url, {
        params: {
          page: page + 1,
          limit: pageSize,
          ...(search ? { search } : {}),
          ...(sort.key ? { sort: sort.key, dir: sort.dir } : {}),
        },
      });
      if (ticket !== latest.current) return;

      setRows(res.data?.[dataKey] || []);
      setMeta(res.data?.meta || { ...EMPTY_META, limit: pageSize });
    } catch (error) {
      if (ticket !== latest.current) return;
      setRows([]);
      toast.error(errorMessage(error, errorText));
    } finally {
      if (ticket === latest.current) setLoading(false);
    }
  }, [url, dataKey, page, pageSize, search, sort, errorText]);

  useEffect(() => {
    load();
  }, [load]);

  // Deleting the last row of the last page would otherwise strand the pager
  // past the end of the data.
  useEffect(() => {
    if (page > 0 && page > meta.pageCount - 1) setPage(meta.pageCount - 1);
  }, [meta.pageCount, page]);

  /** The bundle <DataTable server={...}> expects. */
  const server = useMemo(
    () => ({
      total: meta.total,
      pageCount: meta.pageCount,
      page,
      pageSize,
      query,
      sort,
      onPageChange: setPage,
      onPageSizeChange: setPageSize,
      onQueryChange: setQuery,
      onSortChange: setSort,
    }),
    [meta.total, meta.pageCount, page, pageSize, query, sort]
  );

  return { rows, meta, loading, reload: load, server };
}
