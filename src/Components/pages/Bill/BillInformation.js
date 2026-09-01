import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";

import PageHeader from "../../ui/PageHeader";
import DataTable from "../../ui/DataTable";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { Button, IconButton } from "../../ui/Button";
import { money } from "../../ui/format";
import { PlusIcon, PencilIcon, TrashIcon, FileTextIcon } from "../../ui/Icons";
import useServerTable from "../../../hooks/useServerTable";
import axiosInstance, { errorMessage } from "../../../config/AxiosInstance";

function BillInformation() {
  const {
    rows: bills,
    meta,
    loading,
    reload,
    server,
  } = useServerTable({
    url: "/billInformation",
    dataKey: "billinfo",
    initialSort: { key: "createdAt", dir: "desc" },
    errorText: "Could not load bills",
  });

  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      setDeleting(true);
      const res = await axiosInstance.delete(
        `/billInformation/${pendingDelete._id}`
      );
      if (res.data?.success) {
        toast.success("Bill deleted");
        setPendingDelete(null);
        await reload();
        return;
      }
      toast.error(res.data?.message || "Could not delete the bill");
    } catch (error) {
      toast.error(errorMessage(error, "Could not delete the bill"));
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        header: "Bill",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate font-medium text-fg">
              {row.name || "Unnamed customer"}
            </p>
            <p className="truncate font-mono text-[12px] text-faint">
              #{row.id}
            </p>
          </div>
        ),
        searchValue: (row) =>
          `${row.name || ""} ${row.id ?? ""} ${row.gstNo || ""}`,
      },
      {
        key: "createdAt",
        header: "Date",
        cell: ({ value }) => (
          <span className="whitespace-nowrap text-muted">
            {value ? moment(value).format("DD MMM YYYY") : "—"}
          </span>
        ),
      },
      {
        key: "products",
        header: "Items",
        sortable: false,
        wide: true,
        searchValue: (row) =>
          (row.products || []).map((p) => p.productname).join(" "),
        cell: ({ value }) => {
          const items = value || [];
          if (!items.length) return <span className="text-faint">—</span>;
          const head = items.slice(0, 2);
          return (
            <div className="min-w-0">
              {head.map((p, i) => (
                <p
                  key={`${p.productname}-${i}`}
                  className="truncate text-[13px]"
                >
                  {p.productname}
                  {p.quantity ? (
                    <span className="ml-1.5 text-faint">×{p.quantity}</span>
                  ) : null}
                </p>
              ))}
              {items.length > head.length && (
                <p className="text-[12px] text-faint">
                  +{items.length - head.length} more
                </p>
              )}
            </div>
          );
        },
      },
      {
        key: "totalproductsprice",
        header: "Total",
        align: "right",
        cell: ({ value }) => (
          <span className="font-mono tabular-nums font-medium text-fg">
            {money(value)}
          </span>
        ),
      },
      {
        key: "invoice",
        header: "Invoice",
        align: "center",
        sortable: false,
        searchable: false,
        cell: ({ row }) => (
          <Link
            to={`/billtable/${row._id}`}
            aria-label="Open invoice"
            title="Open invoice"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-strong hover:text-fg focus-ring"
          >
            <FileTextIcon size={16} />
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <>
      <PageHeader
        title="Bills"
        description="Every invoice you have raised."
        actions={
          <Button to="/billform/new" icon={PlusIcon}>
            New bill
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={bills}
        loading={loading}
        server={server}
        searchPlaceholder="Search customer, id, product..."
        emptyTitle="No bills yet"
        emptyDescription="Raise your first invoice and it will show up here."
        emptyAction={
          <Button to="/billform/new" size="sm" icon={PlusIcon}>
            New bill
          </Button>
        }
        toolbar={
          meta.total > 0 && (
            /* Summed in the database over every matching bill. Adding it up
               here meant downloading all of them first. */
            <span className="hidden text-[13px] text-muted lg:inline">
              <span className="font-mono tabular-nums text-fg">
                {money(meta.totalBilled || 0)}
              </span>{" "}
              billed
            </span>
          )
        }
        rowActions={(row) => (
          <>
            <Link
              to={`/billform/${row._id}`}
              aria-label="Edit bill"
              title="Edit bill"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-fg focus-ring"
            >
              <PencilIcon size={16} />
            </Link>
            <IconButton
              icon={TrashIcon}
              label="Delete bill"
              tone="danger"
              onClick={() => setPendingDelete(row)}
            />
          </>
        )}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this bill?"
        description={
          pendingDelete
            ? `Bill #${pendingDelete.id} for "${pendingDelete.name}" will be removed and its stock returned to inventory.`
            : undefined
        }
      />
    </>
  );
}

export default BillInformation;
