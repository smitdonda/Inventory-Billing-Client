import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";

import PageHeader from "../../ui/PageHeader";
import StatCard from "../../ui/StatCard";
import BarChart from "../../ui/BarChart";
import { Button } from "../../ui/Button";
import { money, number, fromPaise } from "../../ui/format";
import {
  ReceiptIcon,
  UsersIcon,
  PackageIcon,
  WalletIcon,
  PlusIcon,
  AlertTriangleIcon,
  ChevronRightIcon,
  InboxIcon,
} from "../../ui/Icons";
import axiosInstance, { errorMessage } from "../../../config/AxiosInstance";

const EMPTY = {
  counts: { customer: 0, product: 0, billInformation: 0 },
  billed: 0,
  stockValue: 0,
  lowStockAt: 5,
  lowStockCount: 0,
  lowStock: [],
  chart: [],
  recentBills: [],
};

function Home() {
  const [summary, setSummary] = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  /*
   * One request for the whole dashboard.
   *
   * It used to make three, two of which downloaded every product and every
   * bill on the account so the browser could add them up and take the top few.
   * The sums and the top-N lists are the database's job now, so what arrives
   * is a fixed handful of rows however long the account has been running.
   */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/dashboard/summary");
        if (cancelled) return;
        if (res.data?.success) setSummary({ ...EMPTY, ...res.data });
      } catch (error) {
        if (!cancelled) {
          toast.error(errorMessage(error, "Could not load the dashboard"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const { counts, billed, stockValue, lowStock, lowStockCount, recentBills } =
    summary;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Stock, customers and billing at a glance."
        actions={
          <Button to="/billform/new" icon={PlusIcon}>
            New bill
          </Button>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Bills issued"
          value={counts.billInformation}
          caption={billed ? `${money(billed)} billed` : "No bills yet"}
          icon={ReceiptIcon}
          to="/billinformation"
          loading={loading}
        />
        <StatCard
          label="Customers"
          value={counts.customer}
          caption="On your books"
          icon={UsersIcon}
          to="/customersdetails"
          loading={loading}
        />
        <StatCard
          label="Products"
          value={counts.product}
          caption={
            lowStockCount ? `${lowStockCount} low on stock` : "All stocked up"
          }
          icon={PackageIcon}
          to="/productsdetails"
          loading={loading}
        />
        <StatCard
          label="Stock value"
          /* StatCard abbreviates a plain rupee number; the API speaks paise. */
          value={fromPaise(stockValue)}
          format="money"
          caption="Unit price × quantity on hand"
          icon={WalletIcon}
          loading={loading}
        />
      </div>

      {/* chart + low stock */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="card p-5 xl:col-span-2">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-fg">
                Stock on hand
              </h2>
              <p className="mt-0.5 text-[13px] text-muted">
                Your best-stocked products, highest first.
              </p>
            </div>
            <Link
              to="/productsdetails"
              className="hidden items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-medium text-muted transition-colors hover:text-fg focus-ring sm:inline-flex"
            >
              Manage
              <ChevronRightIcon size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton h-3.5 w-24 sm:w-36" />
                  <div
                    className="skeleton h-[18px] flex-1"
                    style={{ maxWidth: `${85 - i * 11}%` }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <BarChart data={summary.chart} valueLabel="units in stock" />
          )}
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangleIcon size={17} className="text-warning" />
            <h2 className="text-base font-semibold tracking-tight text-fg">
              Low stock
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-10" />
              ))}
            </div>
          ) : lowStock.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <InboxIcon size={20} className="text-faint" />
              <p className="text-sm text-muted">
                Nothing under {summary.lowStockAt} units.
              </p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-line">
                {lowStock.map((p) => (
                  <li
                    key={p._id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-fg">
                        {p.productname}
                      </p>
                      <p className="text-[12px] text-faint">
                        {money(p.unitprice)} per unit
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-md px-2 py-1 font-mono text-[12px] tabular-nums ${
                        Number(p.availableproductqty) === 0
                          ? "bg-danger/10 text-danger"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {number(p.availableproductqty)} left
                    </span>
                  </li>
                ))}
              </ul>
              {lowStockCount > lowStock.length && (
                <p className="mt-3 text-[12px] text-faint">
                  {lowStockCount - lowStock.length} more below{" "}
                  {summary.lowStockAt} units.
                </p>
              )}
            </>
          )}
        </section>
      </div>

      {/* recent bills */}
      <section className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line p-5">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-fg">
              Recent bills
            </h2>
            <p className="mt-0.5 text-[13px] text-muted">
              The last {recentBills.length || 5} invoices you raised.
            </p>
          </div>
          <Button to="/billinformation" variant="secondary" size="sm">
            View all
          </Button>
        </div>

        {loading ? (
          <div className="divide-y divide-line">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="skeleton h-4 w-16" />
                <div className="skeleton h-4 flex-1" />
                <div className="skeleton h-4 w-20" />
              </div>
            ))}
          </div>
        ) : recentBills.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <InboxIcon size={22} className="text-faint" />
            <p className="text-sm text-muted">No bills raised yet.</p>
            <Button to="/billform/new" size="sm" icon={PlusIcon}>
              Create the first one
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {recentBills.map((bill) => (
              <li key={bill._id}>
                <Link
                  to={`/billtable/${bill._id}`}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-elevated/60 focus-ring"
                >
                  <span className="hidden w-14 shrink-0 font-mono text-[12.5px] text-faint sm:block">
                    #{bill.id}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-fg">
                      {bill.name || "Unnamed customer"}
                    </span>
                    <span className="block text-[12px] text-faint">
                      {moment(bill.createdAt).format("DD MMM YYYY")} ·{" "}
                      {bill.productCount || 0} item
                      {bill.productCount === 1 ? "" : "s"}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-sm tabular-nums text-fg">
                    {money(bill.totalproductsprice)}
                  </span>
                  <ChevronRightIcon size={16} className="shrink-0 text-faint" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default Home;
