"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  LogOut,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Tasks",
    path: "/tasks",
    icon: CheckSquare,
  },
  {
    label: "Team",
    path: "/team",
    icon: Users,
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("auth");
      sessionStorage.clear();
    }

    router.replace("/login");
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === path ||
      pathname.startsWith(`${path}/`)
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <LayoutDashboard size={20} />
        </div>

        <div>
          <h2>TaskMatrix</h2>
          <span>Workspace</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-section-title">
          MAIN MENU
        </p>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.path}
                className={`sidebar-link ${
                  isActive(item.path)
                    ? "active"
                    : ""
                }`}
                onClick={() => router.push(item.path)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>

        <div className="sidebar-version">
          <span>TaskMatrix</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}