# Flowtify

**AP6 Project** - Flowtify is a flood reporting application that allows residents to view and report flood incidents, while giving administrators tools to manage and verify reports in real time. The platform provides both a feed and a map view for residents, enabling easy access to verified flood information and emergency updates.

## Features

### Resident Side

- **Feed View:** See verified flood reports, searchable by barangay, city, or reporter name.
- **Report Flood:** Residents can submit new flood reports via a modal containing:
  - Map for selecting flood location
  - Severity level dropdown
  - Description field
  - Optional photos (up to 5)
- **Weather Integration:** Displays current weather using OpenWeather API.
- **Map View:** Visual representation of flood reports with interactive markers. Clicking a marker shows a pop-up with a "View Full Description" option.

### Admin Side

- **Pending Reports:** Table of reports awaiting verification with options to approve or reject.
- **Verified Unresolved Reports:** Table of verified reports with a "Mark as Resolved" action, notifying reporters upon resolution.
- **Active Flood Alerts:** Add alerts that residents can see in the feed sidebar.
- **Emergency Hotline:** Add emergency hotlines with number, description, and agency name visible to residents.
- **Statistics Overview:** Cards displaying total reports, pending reports, verified reports, resolved reports, total users, and active alerts.
- **Monthly Trends:** Bar graph visualizing flood report trends by month.
- **System Logs:** Detailed logs for administrative monitoring.

## Screenshots

## Tech Stack

- **Frontend:** Next.js with React
- **Backend / Database:** Firebase
- **Storage:** Cloudinary for image uploads
- **Deployment:** Vercel

## Author

- **jasrmg** – Sole developer of Flowtify

## License

This project is private/restricted and not open-source.
