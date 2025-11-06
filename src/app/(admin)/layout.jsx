import { Navbar } from "@/app/components/Navbar";
import { Sidebar } from "./dashboard/components/Sidebar/Sidebar";
import { ThemeToggle } from "../components/ThemeToggle";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const AdminLayout = ({ children }) => {
  return (
    <>
      <ProtectedRoute allowedRoles={["admin"]}>
        {/* ThemeToggle */}
        <ThemeToggle />
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="layout-container">
          <Sidebar />
          <main className="main-content">{children}</main>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default AdminLayout;
