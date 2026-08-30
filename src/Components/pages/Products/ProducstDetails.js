import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../ui/PageHeader";
import DataTable from "../../ui/DataTable";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { Button, IconButton } from "../../ui/Button";
import { PlusIcon, PencilIcon, TrashIcon } from "../../ui/Icons";
import { money, number } from "../../ui/format";
import ProductForm from "./ProductFrom";
import axiosInstance, { errorMessage } from "../../../config/AxiosInstance";

const LOW_STOCK_AT = 5;

function StockBadge({ qty }) {
  const value = Number(qty) || 0;
  // Only the exceptions wear a chip; a healthy count is just a number.
  const tone =
    value === 0
      ? "bg-danger/10 text-danger"
      : value <= LOW_STOCK_AT
        ? "bg-warning/10 text-warning"
        : "text-fg";
  const label =
    value === 0 ? "Out of stock" : value <= LOW_STOCK_AT ? "Low" : null;

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`rounded-md px-2 py-1 font-mono text-[12.5px] tabular-nums ${tone}`}
      >
        {number(value)}
      </span>
      {label && <span className="text-[12px] text-muted">{label}</span>}
    </span>
  );
}

function ProducstDetails() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [editId, setEditId] = useState(null);

  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getProductsData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/products");
      setProducts(res.data?.products || []);
    } catch (error) {
      toast.error(errorMessage(error, "Could not load products"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProductsData();
  }, [getProductsData]);

  const openCreate = () => {
    setEditData({});
    setEditId(null);
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setEditData(row);
    setEditId(row._id);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditData({});
    setEditId(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      setDeleting(true);
      const res = await axiosInstance.delete(`/products/${pendingDelete._id}`);
      if (res.data?.success) {
        toast.success("Product deleted");
        setPendingDelete(null);
        await getProductsData();
        return;
      }
      toast.error(res.data?.message || "Could not delete the product");
    } catch (error) {
      toast.error(errorMessage(error, "Could not delete the product"));
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "productname",
        header: "Product",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate font-medium text-fg">
              {row.productname || "—"}
            </p>
            <p className="truncate text-[12px] text-faint">#{row.id}</p>
          </div>
        ),
      },
      {
        key: "availableproductqty",
        header: "In stock",
        cell: ({ value }) => <StockBadge qty={value} />,
      },
      {
        key: "unitprice",
        header: "Unit price",
        align: "right",
        cell: ({ value }) => (
          <span className="font-mono tabular-nums">{money(value)}</span>
        ),
      },
      {
        key: "stockValue",
        header: "Stock value",
        align: "right",
        searchable: false,
        accessor: (row) =>
          (Number(row.unitprice) || 0) * (Number(row.availableproductqty) || 0),
        cell: ({ value }) => (
          <span className="font-mono tabular-nums text-muted">
            {money(value)}
          </span>
        ),
      },
    ],
    []
  );

  const totals = useMemo(
    () =>
      products.reduce(
        (acc, p) => {
          acc.units += Number(p.availableproductqty) || 0;
          acc.value +=
            (Number(p.unitprice) || 0) * (Number(p.availableproductqty) || 0);
          return acc;
        },
        { units: 0, value: 0 }
      ),
    [products]
  );

  return (
    <>
      <PageHeader
        title="Products"
        description="What you sell, and how much of it is left."
        actions={
          <Button icon={PlusIcon} onClick={openCreate}>
            New product
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        searchPlaceholder="Search products..."
        emptyTitle="No products yet"
        emptyDescription="Add the items you sell so they can be picked when billing."
        emptyAction={
          <Button size="sm" icon={PlusIcon} onClick={openCreate}>
            New product
          </Button>
        }
        toolbar={
          products.length > 0 && (
            <span className="hidden items-center gap-3 text-[13px] text-muted lg:flex">
              <span>
                <span className="font-mono tabular-nums text-fg">
                  {number(totals.units)}
                </span>{" "}
                units
              </span>
              <span className="h-3.5 w-px bg-line" />
              <span>
                <span className="font-mono tabular-nums text-fg">
                  {money(totals.value)}
                </span>{" "}
                on hand
              </span>
            </span>
          )
        }
        rowActions={(row) => (
          <>
            <IconButton
              icon={PencilIcon}
              label="Edit product"
              onClick={() => openEdit(row)}
            />
            <IconButton
              icon={TrashIcon}
              label="Delete product"
              tone="danger"
              onClick={() => setPendingDelete(row)}
            />
          </>
        )}
      />

      <ProductForm
        id={editId}
        open={formOpen}
        handleClose={closeForm}
        editData={editData}
        getProductsData={getProductsData}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this product?"
        description={
          pendingDelete
            ? `"${pendingDelete.productname}" will be removed from the catalogue. Existing bills keep their line items.`
            : undefined
        }
      />
    </>
  );
}

export default ProducstDetails;
