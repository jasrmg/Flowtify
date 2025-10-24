# 🌊 Flowtify

**Community-Based Flood Monitoring and Reporting System**

Flowtify is a community-driven web application designed to help **residents** and **local government units (LGUs)** in the Philippines share and verify **real-time flood updates**.  
By combining user-generated reports with admin verification, Flowtify provides a **reliable, centralized source of flood information** to enhance **public safety** and **disaster response**.

---

## 📖 Description

Residents can report flood incidents with photos, descriptions, and automatic location tagging via the browser’s geolocation API.  
Administrators (LGUs) review these reports, verify their accuracy, and publish them to the public feed. This ensures that only credible information reaches the community.

---

## 👥 User Roles & Functionalities

### 🧍 Resident

- Register and log in using **Firebase Authentication**
- Submit flood reports with:
  - Photo upload
  - Description/details
  - Automatic location tagging via the **Geolocation API**
- View **verified** reports in the public feed
- Edit or delete their own reports _(optional feature)_

### 🛡️ Admin

- View all submitted reports, including **pending** ones
- **Verify** or **reject** reports before they appear publicly
- Update report status:
  - `Pending → Verified → Resolved`
- Delete inaccurate or duplicate reports
- Post official **announcements** and **safety advisories**

---
