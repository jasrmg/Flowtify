// scripts/seedReports.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { floodReportsWithCoordinates } from "./src/app/lib/mockData.js"; // adjust path if needed

// ✅ 1. Your Firebase Config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ✅ 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ 3. Seeding Function
const seedReports = async () => {
  try {
    for (const report of floodReportsWithCoordinates) {
      const newReport = {
        reporter: report.reporter,
        location: report.location,
        description: report.description,
        fullDescription: report.fullDescription,
        status: report.status || "pending",
        timestamp: report.timestamp,
        date: report.date,
        lat: report.lat,
        lng: report.lng,
        photo: Array.isArray(report.photo) ? report.photo : [report.photo],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "reports"), newReport);
      console.log(`✅ Report added with ID: ${docRef.id}`);
    }
    console.log("🎉 All reports successfully seeded!");
  } catch (error) {
    console.error("❌ Error seeding reports:", error);
  }
};

seedReports();
