import { ProtectedRoute } from "@/components/ProtectedRoute";
import Navbar from "../components/Navbar";
import ThemeToggle from "../components/ThemeToggle";
import { UserSidebar } from "@/app/(user)/components/UserSidebar/UserSidebar";

// layout for user pages
export default function UserLayout({ children }) {
  return (
    <>
      <ProtectedRoute allowedRoles={["resident"]}>
        {/* Theme Toggle */}
        <ThemeToggle />
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="layout-container">
          <UserSidebar />
          {children}
        </div>
      </ProtectedRoute>
    </>
  );
}
