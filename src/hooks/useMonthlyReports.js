import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const useMonthlyReports = (monthsToShow = 6) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reportsQuery = query(collection(db, "reports"));

    const unsubscribe = onSnapshot(
      reportsQuery,
      (snapshot) => {
        const reports = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Get the last N months
        const monthsData = [];
        const now = new Date();

        for (let i = monthsToShow - 1; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = date.toLocaleDateString("en-US", {
            month: "short",
          });
          const year = date.getFullYear();
          const month = date.getMonth();

          // Count reports for this month
          const reportsInMonth = reports.filter((report) => {
            if (!report.createdAt) return false;
            const reportDate = report.createdAt.toDate();
            return (
              reportDate.getFullYear() === year &&
              reportDate.getMonth() === month
            );
          });

          monthsData.push({
            month: monthName,
            value: reportsInMonth.length,
            year: year,
          });
        }

        setMonthlyData(monthsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching monthly reports:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [monthsToShow]);

  return { monthlyData, loading };
};
