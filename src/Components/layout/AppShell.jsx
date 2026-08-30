import React, { useCallback, useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import cn from "../ui/cn";
import { IconButton } from "../ui/Button";
import { removeItem } from "../../config/cookieStorage";
import {
  HomeIcon,
  UsersIcon,
  PackageIcon,
  ReceiptIcon,
  UserCircleIcon,
  MenuIcon,
  XIcon,
  LogOutIcon,
  PanelLeftIcon,
  ReceiptIcon as BrandIcon,
} from "../ui/Icons";

const NAV = [
  { to: "/", label: "Dashboard", icon: HomeIcon, end: true },
  { to: "/customersdetails", label: "Customers", icon: UsersIcon },
  { to: "/productsdetails", label: "Products", icon: PackageIcon },
  { to: "/billinformation", label: "Bills", icon: ReceiptIcon },
  { to: "/myprofile", label: "Company", icon: UserCircleIcon },
];

const COLLAPSE_KEY = "billbook-sidebar-collapsed";

const readCollapsed = () => {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
};

function NavItems({ collapsed, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          title={collapsed ? label : undefined}
          className={({ isActive }) =>
            cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
              "transition-colors duration-150 focus-ring",
              collapsed && "lg:justify-center lg:px-0",
              isActive
                ? "bg-elevated text-fg"
                : "text-muted hover:bg-elevated/70 hover:text-fg"
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  "absolute left-0 h-5 w-[3px] rounded-r-full bg-fg transition-opacity duration-150",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />
              <Icon size={19} />
              <span className={cn(collapsed && "lg:hidden")}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand({ collapsed }) {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 rounded-xl px-3 py-1 focus-ring"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-fg">
        <BrandIcon size={18} />
      </span>
      <span className={cn("min-w-0", collapsed && "lg:hidden")}>
        <span className="block truncate text-[15px] font-semibold tracking-tight text-fg">
          Bill Book
        </span>
        <span className="block truncate text-[11px] text-faint">
          Inventory &amp; billing
        </span>
      </span>
    </Link>
  );
}

/**
 * App chrome: a rail that collapses on desktop and slides in as a drawer on
 * phones. All of it is React state — no direct DOM style writes.
 */
function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      /* storage unavailable — the choice just won't survive a reload */
    }
  }, [collapsed]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onEsc = (event) => event.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [drawerOpen]);

  const logOut = () => {
    removeItem("token");
    navigate("/login", { replace: true });
  };

  const current = NAV.find((item) =>
    item.end ? pathname === item.to : pathname.startsWith(item.to)
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* ---- desktop sidebar ---- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden shrink-0 flex-col border-r border-line bg-surface lg:flex",
          "transition-[width] duration-200 ease-out",
          collapsed ? "w-[4.5rem]" : "w-[16rem]"
        )}
      >
        <div className="flex h-16 items-center px-3">
          <Brand collapsed={collapsed} />
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <NavItems collapsed={collapsed} />
        </div>
        <div className="border-t border-line p-3">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted",
              "transition-colors hover:bg-elevated hover:text-fg focus-ring",
              collapsed && "justify-center px-0"
            )}
          >
            <PanelLeftIcon size={18} />
            <span className={cn(collapsed && "hidden")}>Collapse</span>
          </button>
        </div>
      </aside>

      {/* ---- mobile drawer ---- */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-zinc-950/50 backdrop-blur-[2px] animate-fade-in"
            onClick={closeDrawer}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[17rem] max-w-[85vw] flex-col border-r border-line bg-surface shadow-pop">
            <div className="flex h-16 items-center justify-between px-3">
              <Brand collapsed={false} />
              <IconButton
                icon={XIcon}
                label="Close menu"
                onClick={closeDrawer}
              />
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <NavItems collapsed={false} onNavigate={closeDrawer} />
            </div>
            <div className="border-t border-line p-3">
              <button
                type="button"
                onClick={logOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger focus-ring"
              >
                <LogOutIcon size={18} />
                Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ---- main column ---- */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-200 ease-out",
          collapsed ? "lg:pl-[4.5rem]" : "lg:pl-[16rem]"
        )}
      >
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur-md sm:px-6">
          <IconButton
            icon={MenuIcon}
            label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden"
          />
          {/* The sidebar names the section on desktop and the page's own H1
              repeats it, so the bar only labels itself on phones. */}
          <div className="min-w-0 flex-1 lg:hidden">
            <span className="block truncate text-[15px] font-semibold tracking-tight text-fg">
              {current?.label || "Bill Book"}
            </span>
          </div>
          <div className="hidden flex-1 lg:block" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={logOut}
              className="hidden h-9 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-fg focus-ring sm:inline-flex"
            >
              <LogOutIcon size={16} />
              Log out
            </button>
            <IconButton
              icon={LogOutIcon}
              label="Log out"
              tone="danger"
              onClick={logOut}
              className="sm:hidden"
            />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
