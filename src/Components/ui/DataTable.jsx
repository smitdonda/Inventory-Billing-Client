import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import cn from "./cn";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SearchIcon,
  SortIcon,
  InboxIcon,
  CopyIcon,
  CheckIcon,
  XIcon,
} from "./Icons";
import { Button, IconButton } from "./Button";

/* ------------------------------------------------------------------ */
/*  helpers                                                            */
/* ------------------------------------------------------------------ */

const rawValue = (row, col) =>
  typeof col.accessor === "function" ? col.accessor(row) : row?.[col.key];

const searchText = (row, col) => {
  if (col.searchValue) return String(col.searchValue(row) ?? "");
  const value = rawValue(row, col);
  if (value == null) return "";
  if (Array.isArray(value))
    return value.map((v) => v?.productname ?? v).join(" ");
  return String(value);
};

const compare = (a, b) => {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  const da = Date.parse(a);
  const db = Date.parse(b);
  if (
    !Number.isNaN(da) &&
    !Number.isNaN(db) &&
    typeof a === "string" &&
    a.includes("-")
  ) {
    return da - db;
  }
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb) && a !== "" && b !== "")
    return na - nb;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
};

const alignClass = (col) =>
  cn(
    col.align === "right" && "text-right tabular-nums",
    col.align === "center" && "text-center"
  );

/* ------------------------------------------------------------------ */
/*  copy-to-clipboard cell                                             */
/* ------------------------------------------------------------------ */

function CopyValue({ value }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (value == null || value === "")
    return <span className="text-faint">—</span>;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
    } catch {
      /* clipboard blocked (insecure origin) — leave the value selectable */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy ${value}`}
      className="group/copy inline-flex max-w-full items-center gap-1.5 rounded-md px-1.5 py-1 -mx-1.5 text-left transition-colors hover:bg-strong/40 focus-ring"
    >
      <span className="truncate font-mono text-[12.5px]">{String(value)}</span>
      {copied ? (
        <CheckIcon size={13} className="shrink-0 text-success" />
      ) : (
        <CopyIcon
          size={13}
          className="shrink-0 text-faint opacity-0 transition-opacity group-hover/copy:opacity-100"
        />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  table                                                              */
/* ------------------------------------------------------------------ */

function DataTable({
  columns = [],
  data = [],
  loading = false,
  rowActions,
  getRowId = (row, index) => row?._id ?? index,
  searchable = true,
  searchPlaceholder = "Search...",
  pageSizeOptions = [8, 15, 30, 60],
  initialPageSize = 8,
  minWidth = "52rem",
  emptyTitle = "Nothing here yet",
  emptyDescription,
  emptyAction,
  toolbar,
  className = "",
  server = null,
}) {
  /*
   * Two modes, one component.
   *
   * Without `server` the table owns its search, sort and paging and works over
   * whatever rows it was handed — right for a short, fully loaded list.
   *
   * With `server` (see hooks/useServerTable) those three pieces of state live
   * outside and each change refetches one page. `data` is then already the
   * page: nothing here filters, sorts or slices it, because the database did.
   */
  const controlled = Boolean(server);

  const [localQuery, setLocalQuery] = useState("");
  const [localSort, setLocalSort] = useState({ key: null, dir: "asc" });
  const [localPageSize, setLocalPageSize] = useState(initialPageSize);
  const [localPage, setLocalPage] = useState(0);

  const query = controlled ? server.query : localQuery;
  const setQuery = controlled ? server.onQueryChange : setLocalQuery;
  const sort = controlled ? server.sort : localSort;
  const setSort = controlled ? server.onSortChange : setLocalSort;
  const pageSize = controlled ? server.pageSize : localPageSize;
  const setPageSize = controlled ? server.onPageSizeChange : setLocalPageSize;
  const page = controlled ? server.page : localPage;
  const setPage = controlled ? server.onPageChange : setLocalPage;

  const filtered = useMemo(() => {
    if (controlled) return data;
    const q = query.trim().toLowerCase();
    if (!q) return data;
    const searchCols = columns.filter((col) => col.searchable !== false);
    return data.filter((row) =>
      searchCols.some((col) => searchText(row, col).toLowerCase().includes(q))
    );
  }, [controlled, data, columns, query]);

  const sorted = useMemo(() => {
    if (controlled || !sort.key) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort(
      (a, b) =>
        factor *
        compare(
          col.sortValue ? col.sortValue(a) : rawValue(a, col),
          col.sortValue ? col.sortValue(b) : rawValue(b, col)
        )
    );
  }, [controlled, filtered, columns, sort]);

  // In server mode these describe the whole result set, not the loaded page.
  const totalRows = controlled ? server.total : sorted.length;
  const pageCount = controlled
    ? Math.max(1, server.pageCount)
    : Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);

  const rows = useMemo(
    () =>
      controlled
        ? sorted
        : sorted.slice(safePage * pageSize, safePage * pageSize + pageSize),
    [controlled, sorted, safePage, pageSize]
  );

  useEffect(() => {
    // The server hook resets its own page; doing it here too would fight it.
    if (!controlled) setLocalPage(0);
  }, [controlled, query, pageSize, data]);

  /* Wide tables scroll sideways with nothing to say so. These two fades are
     the only hint that a column is hiding past the edge. */
  const scrollRef = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const syncEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 2,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
    });
  }, []);

  useEffect(() => {
    syncEdges();
    window.addEventListener("resize", syncEdges);
    return () => window.removeEventListener("resize", syncEdges);
  }, [syncEdges, rows, loading]);

  const toggleSort = (col) => {
    if (col.sortable === false) return;
    setSort((prev) =>
      prev.key !== col.key
        ? { key: col.key, dir: "asc" }
        : prev.dir === "asc"
          ? { key: col.key, dir: "desc" }
          : { key: null, dir: "asc" }
    );
  };

  const renderCell = (row, col, index) => {
    const value = rawValue(row, col);
    if (col.cell) return col.cell({ value, row, index });
    if (col.copyable) return <CopyValue value={value} />;
    if (value == null || value === "")
      return <span className="text-faint">—</span>;
    return value;
  };

  const colCount = columns.length + (rowActions ? 1 : 0);
  const showEmpty = !loading && totalRows === 0;

  const emptyBlock = (
    <EmptyBlock
      title={query ? "No matches" : emptyTitle}
      description={query ? `Nothing matched "${query}".` : emptyDescription}
      action={
        query ? (
          <Button variant="secondary" size="sm" onClick={() => setQuery("")}>
            Clear search
          </Button>
        ) : (
          emptyAction
        )
      }
    />
  );

  /* border-collapse drops a sticky header's own border as it scrolls, so the
     header rule is drawn as an inset shadow instead. */
  const headCell =
    "sticky top-0 z-10 bg-elevated px-4 py-3 first:pl-5 last:pr-5 text-left " +
    "text-[11.5px] font-semibold uppercase tracking-[0.07em] text-muted " +
    "shadow-[inset_0_-1px_0_0_rgb(var(--strong))]";

  return (
    <div className={cn("card overflow-hidden", className)}>
      {/* toolbar ---------------------------------------------------- */}
      {(searchable || toolbar) && (
        <div className="flex flex-col gap-3 border-b border-line p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          {searchable && (
            <div className="relative w-full sm:max-w-xs">
              <SearchIcon
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="h-10 w-full rounded-xl border border-line bg-bg pl-10 pr-9 text-sm text-fg placeholder:text-faint transition-colors hover:border-strong focus:border-fg focus:outline-none focus:ring-2 focus:ring-fg/15"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-faint transition-colors hover:text-fg focus-ring"
                >
                  <XIcon size={14} />
                </button>
              )}
            </div>
          )}
          <div className="flex items-center gap-2.5">
            {toolbar}
            <span className="hidden shrink-0 rounded-full border border-line bg-elevated px-2.5 py-1 text-[12px] font-medium tabular-nums text-muted sm:inline">
              {totalRows} {totalRows === 1 ? "record" : "records"}
            </span>
          </div>
        </div>
      )}

      {/* desktop table ---------------------------------------------- */}
      <div className="relative hidden md:block">
        <div
          ref={scrollRef}
          onScroll={syncEdges}
          className="max-h-[70vh] overflow-auto"
        >
          <table
            className="w-full border-collapse text-sm"
            style={{ minWidth }}
          >
            <thead>
              <tr>
                {columns.map((col) => {
                  const active = sort.key === col.key;
                  const sortable = col.sortable !== false;
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      style={col.width ? { width: col.width } : undefined}
                      className={cn(headCell, alignClass(col))}
                    >
                      {sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(col)}
                          aria-label={`Sort by ${col.header}`}
                          className={cn(
                            "group/sort inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 -mx-1",
                            /* A button does not inherit the header cell's
                               text-transform, so the case is restated here or
                               sortable columns read differently to the rest. */
                            "uppercase tracking-[0.07em]",
                            "transition-colors hover:text-fg focus-ring",
                            active && "text-fg",
                            col.align === "right" && "flex-row-reverse"
                          )}
                        >
                          {col.header}
                          {active ? (
                            sort.dir === "asc" ? (
                              <ChevronUpIcon size={13} />
                            ) : (
                              <ChevronDownIcon size={13} />
                            )
                          ) : (
                            /* Idle arrows on every column are noise; they
                               show up only under the pointer. */
                            <SortIcon
                              size={12}
                              className="opacity-0 transition-opacity group-hover/sort:opacity-50"
                            />
                          )}
                        </button>
                      ) : (
                        col.header
                      )}
                    </th>
                  );
                })}
                {rowActions && (
                  <th
                    scope="col"
                    className={cn(
                      headCell,
                      "w-px whitespace-nowrap text-right"
                    )}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading &&
                Array.from({ length: Math.min(pageSize, 6) }).map((_, r) => (
                  <tr
                    key={`sk-${r}`}
                    className="border-b border-line last:border-0"
                  >
                    {Array.from({ length: colCount }).map((__, c) => (
                      <td
                        key={`sk-${r}-${c}`}
                        className="px-4 py-3.5 first:pl-5 last:pr-5"
                      >
                        <div
                          className="skeleton h-4"
                          style={{ width: `${45 + ((r + c) % 4) * 14}%` }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading &&
                rows.map((row, index) => (
                  <tr
                    key={getRowId(row, index)}
                    className="group border-b border-line transition-colors last:border-0 hover:bg-elevated"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3.5 first:pl-5 last:pr-5 align-middle text-fg",
                          alignClass(col),
                          col.mono && "font-mono text-[13px]",
                          col.truncate && "max-w-[16rem] truncate"
                        )}
                      >
                        {renderCell(row, col, index)}
                      </td>
                    ))}
                    {rowActions && (
                      <td className="whitespace-nowrap px-4 py-3.5 pr-5 text-right">
                        {/* Dimmed rather than hidden: still findable without a
                            pointer, but it stops competing with the data. */}
                        <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                          {rowActions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}

              {showEmpty && (
                <tr>
                  <td colSpan={colCount} className="px-4 py-16">
                    {emptyBlock}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-20 w-6 bg-gradient-to-r from-fg/10 to-transparent transition-opacity duration-150",
            edges.left ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-20 w-6 bg-gradient-to-l from-fg/10 to-transparent transition-opacity duration-150",
            edges.right ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      {/* mobile cards ------------------------------------------------ */}
      <div className="divide-y divide-line md:hidden">
        {loading &&
          Array.from({ length: 3 }).map((_, r) => (
            <div key={`msk-${r}`} className="space-y-2.5 p-4">
              <div className="skeleton h-4 w-1/3" />
              <div className="skeleton h-3 w-2/3" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          ))}

        {!loading &&
          rows.map((row, index) => {
            const [primary, ...restCols] = columns;
            return (
              <div
                key={getRowId(row, index)}
                className="p-4 transition-colors active:bg-elevated"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 font-medium text-fg">
                    {renderCell(row, primary, index)}
                  </div>
                  {rowActions && (
                    <div className="flex shrink-0 items-center gap-1">
                      {rowActions(row)}
                    </div>
                  )}
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-line pt-3">
                  {restCols.map((col) => (
                    <div key={col.key} className={cn(col.wide && "col-span-2")}>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.07em] text-faint">
                        {col.header}
                      </dt>
                      <dd className="mt-1 break-words text-[13.5px] text-fg">
                        {renderCell(row, col, index)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}

        {showEmpty && <div className="p-10">{emptyBlock}</div>}
      </div>

      {/* pagination -------------------------------------------------- */}
      {!showEmpty && (
        <div className="flex flex-col gap-3 border-t border-line bg-elevated/40 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex items-center gap-2 text-[13px] text-muted">
            <span className="hidden sm:inline">Rows</span>
            <select
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
              aria-label="Rows per page"
              className="h-8 rounded-lg border border-line bg-surface px-2 text-[13px] text-fg transition-colors hover:border-strong focus:border-fg focus:outline-none focus:ring-2 focus:ring-fg/15"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="tabular-nums">
              {totalRows === 0
                ? "0"
                : `${safePage * pageSize + 1}–${Math.min(
                    (safePage + 1) * pageSize,
                    totalRows
                  )}`}{" "}
              of {totalRows}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <IconButton
              icon={ChevronsLeftIcon}
              label="First page"
              disabled={safePage === 0}
              onClick={() => setPage(0)}
              className="disabled:opacity-30 disabled:pointer-events-none"
            />
            <IconButton
              icon={ChevronLeftIcon}
              label="Previous page"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="disabled:opacity-30 disabled:pointer-events-none"
            />
            <span className="px-2 text-[13px] font-medium tabular-nums text-fg">
              Page {safePage + 1}
              <span className="font-normal text-muted"> of {pageCount}</span>
            </span>
            <IconButton
              icon={ChevronRightIcon}
              label="Next page"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              className="disabled:opacity-30 disabled:pointer-events-none"
            />
            <IconButton
              icon={ChevronsRightIcon}
              label="Last page"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage(pageCount - 1)}
              className="disabled:opacity-30 disabled:pointer-events-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyBlock({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-elevated text-faint">
        <InboxIcon size={22} />
      </div>
      <div>
        <p className="font-medium text-fg">{title}</p>
        {description && (
          <p className="mt-1 max-w-sm text-[13px] text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export default DataTable;
