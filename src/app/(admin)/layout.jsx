import { Navbar } from "@/app/components/Navbar";
import { Sidebar } from "./dashboard/components/Sidebar";

export const AdminLayout = ({ children }) => {
  return (
    <>
      {/* ThemeToggle */}

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="layout-container">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </>
  );
};

export default AdminLayout;
