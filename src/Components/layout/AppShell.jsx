import React, { useCallback, useEffect, useMemo, useState } from "react";
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

/* Grouped so the rail reads as three jobs rather than one flat list of five. */
const NAV = [
  {
    title: "Overview",
    items: [{ to: "/", label: "Dashboard", icon: HomeIcon, end: true }],
  },
  {
    title: "Records",
    items: [
      { to: "/customersdetails", label: "Customers", icon: UsersIcon },
      { to: "/productsdetails", label: "Products", icon: PackageIcon },
      { to: "/billinformation", label: "Bills", icon: ReceiptIcon },
    ],
  },
  {
    title: "Settings",
    items: [{ to: "/myprofile", label: "Company", icon: UserCircleIcon }],
  },
];

const COLLAPSE_KEY = "billbook-sidebar-collapsed";

const readCollapsed = () => {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
};

/* The collapsed rail has no room for a label, and the native title attribute
   takes about a second to appear. This is the same hint, instantly. */
function Tip({ children }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-fg px-2.5 py-1.5 text-[12px] font-medium text-bg opacity-0 shadow-pop transition-opacity duration-150 group-hover:opacity-100 lg:block"
    >
      {children}
    </span>
  );
}

/* Collapsing is one motion, so every piece of it moves on the same clock.
   Nothing unmounts or flips to `hidden`: text shrinks its own width and fades,
   and the icons ride a transform into the centre of the narrow rail. */
/* An expo curve spends 95%% of its travel in the first fifth of the clock, so
   the rail arrived before the eye caught it moving. This one spreads the
   distance across the whole duration, which is what makes it read as motion. */
const CURVE = "ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none";
const RAIL = `duration-[380ms] ${CURVE}`;
const ITEM = `duration-[260ms] ${CURVE}`;

/* Every label and caption in the rail, top to bottom. Opening deals them out
   in that order; closing takes them all at once, because a staggered exit just
   reads as lag. */
const ORDER = (() => {
  const order = new Map();
  let i = 0;
  NAV.forEach((group) => {
    order.set(group.title, i++);
    group.items.forEach((item) => order.set(item.to, i++));
  });
  return order;
})();

const stagger = (collapsed, key) => ({
  transitionDelay: collapsed ? "0ms" : `${50 + (ORDER.get(key) ?? 0) * 26}ms`,
});

const labelMotion = (collapsed) =>
  cn(
    "overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin]",
    ITEM,
    "ml-3 max-w-[11rem] opacity-100",
    collapsed && "lg:ml-0 lg:max-w-0 lg:opacity-0"
  );

/* px-3 inside a px-3 nav puts an icon 24px in; the rail is 72px wide, so a
   3px nudge is exactly its centre. The icons also grow a little on the way,
   since at that size they carry the whole rail on their own. */
const iconMotion = (collapsed) =>
  cn(
    "shrink-0 transition-transform",
    RAIL,
    collapsed && "lg:translate-x-[3px] lg:scale-110"
  );

function NavItems({ collapsed, onNavigate }) {
  return (
    <nav className="flex flex-col gap-6 px-3">
      {NAV.map((group) => (
        <div key={group.title} className="flex flex-col gap-1">
          <span
            style={stagger(collapsed, group.title)}
            className={cn(
              "block overflow-hidden whitespace-nowrap px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint",
              "transition-[max-height,opacity,margin]",
              ITEM,
              "mb-1 max-h-4 opacity-100",
              collapsed && "lg:mb-0 lg:max-h-0 lg:opacity-0"
            )}
          >
            {group.title}
          </span>

          {group.items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center rounded-xl px-3 py-2.5 text-sm",
                  "transition-colors duration-150 focus-ring",
                  isActive
                    ? "bg-accent font-semibold text-accent-fg shadow-soft"
                    : "font-medium text-muted hover:bg-elevated hover:text-fg"
                )
              }
            >
              <Icon size={18} className={iconMotion(collapsed)} />
              <span
                style={stagger(collapsed, to)}
                className={labelMotion(collapsed)}
              >
                {label}
              </span>
              {collapsed && <Tip>{label}</Tip>}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}

function Brand({ collapsed }) {
  return (
    <Link to="/" className="flex items-center rounded-xl px-3 py-1 focus-ring">
      {/* A 36px mark sitting 24px in; -6px lands it on the rail's centre. */}
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-fg shadow-soft",
          "transition-transform",
          RAIL,
          collapsed && "lg:-translate-x-1.5"
        )}
      >
        <BrandIcon size={18} />
      </span>
      <span
        style={{ transitionDelay: collapsed ? "0ms" : "50ms" }}
        className={cn(
          "overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin]",
          ITEM,
          "ml-2.5 max-w-[10rem] opacity-100",
          collapsed && "lg:ml-0 lg:max-w-0 lg:opacity-0"
        )}
      >
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

  const current = useMemo(() => {
    for (const group of NAV) {
      const item = group.items.find((entry) =>
        entry.end ? pathname === entry.to : pathname.startsWith(entry.to)
      );
      if (item) return { group: group.title, label: item.label };
    }
    return null;
  }, [pathname]);

  const logOutClasses =
    "group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger focus-ring";

  return (
    <div className="min-h-screen bg-bg">
      {/* ---- desktop sidebar ---- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden shrink-0 flex-col border-r border-line bg-surface lg:flex",
          `transition-[width] ${RAIL}`,
          collapsed ? "w-[4.5rem]" : "w-[16rem]"
        )}
      >
        <div className="flex h-16 shrink-0 items-center border-b border-line/70 px-3">
          <Brand collapsed={collapsed} />
        </div>

        <div
          className={cn(
            "flex-1 py-5",
            /* Clipping would cut the collapsed rail's tooltips in half. */
            collapsed ? "overflow-visible" : "overflow-y-auto"
          )}
        >
          <NavItems collapsed={collapsed} />
        </div>

        <div className="shrink-0 border-t border-line p-3">
          <button
            type="button"
            onClick={logOut}
            className={cn(logOutClasses, "w-full")}
          >
            <LogOutIcon size={18} className={iconMotion(collapsed)} />
            <span
              style={{
                transitionDelay: collapsed ? "0ms" : `${50 + ORDER.size * 26}ms`,
              }}
              className={labelMotion(collapsed)}
            >
              Log out
            </span>
            {collapsed && <Tip>Log out</Tip>}
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
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line/70 px-3">
              <Brand collapsed={false} />
              <IconButton
                icon={XIcon}
                label="Close menu"
                onClick={closeDrawer}
              />
            </div>
            <div className="flex-1 overflow-y-auto py-5">
              <NavItems collapsed={false} onNavigate={closeDrawer} />
            </div>
            <div className="shrink-0 border-t border-line p-3">
              <button
                type="button"
                onClick={logOut}
                className={cn(logOutClasses, "w-full gap-3")}
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
          "flex min-h-screen flex-col",
          `transition-[padding] ${RAIL}`,
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
          {/* Same corner as the phone menu button above: on desktop the rail is
              already there, so this widens and narrows it instead. */}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-fg focus-ring active:scale-95 lg:inline-flex"
          >
            <PanelLeftIcon
              size={17}
              className={cn(
                "transition-transform duration-200",
                collapsed && "rotate-180"
              )}
            />
          </button>
          {/* Phones get the bare section name. Desktop gets its group in front
              of it, so the bar carries the one thing the page's own H1 cannot:
              where this screen sits. */}
          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5 truncate text-[15px] font-semibold tracking-tight text-fg">
              {current?.group && (
                <span className="hidden items-center gap-1.5 font-medium text-faint lg:flex">
                  {current.group}
                  <span aria-hidden="true">/</span>
                </span>
              )}
              {current?.label || "Bill Book"}
            </span>
          </nav>
          <div className="flex items-center gap-2">
            {/* The desktop rail carries its own log out, so this one stops at
                the tablet range where the rail is still hidden. */}
            <button
              type="button"
              onClick={logOut}
              className="hidden h-9 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-fg focus-ring sm:inline-flex lg:hidden"
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
