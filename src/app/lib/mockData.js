export const pendingReports = [
  {
    id: 1,
    reporter: "Juan Dela Cruz",
    location: "Barangay Lahug, Gorordo Ave",
    description:
      "Severe flooding on main road, water level approximately 2 feet high. Multiple vehicles stranded.",
    date: "2024-10-30 14:30",
    photo:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    reporter: "Maria Santos",
    location: "Barangay Mabolo, Mango Square",
    description:
      "Flash flood in commercial area. Water accumulating rapidly near drainage systems.",
    date: "2024-10-30 13:15",
    photo:
      "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    reporter: "Pedro Garcia",
    location: "Barangay Capitol Site",
    description:
      "Heavy rain causing street flooding. Pedestrian walkways submerged.",
    date: "2024-10-30 12:00",
    photo:
      "https://images.unsplash.com/photo-1589820296156-2454bb98a4ba?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    reporter: "Ana Rodriguez",
    location: "Barangay Guadalupe",
    description:
      "Flood water entering residential homes. Residents requesting evacuation assistance.",
    date: "2024-10-30 11:45",
    photo:
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    reporter: "Carlos Mendoza",
    location: "Barangay Kamputhaw",
    description:
      "Major road closure due to flooding. Traffic being diverted to alternative routes.",
    date: "2024-10-30 10:20",
    photo:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&h=600&fit=crop",
  },
];

export const mapMarkers = [
  {
    id: 1,
    lat: 10.3157,
    lng: 123.8854,
    location: "Barangay Lahug",
    description:
      "Severe flooding on main road, water level approximately 2 feet high.",
    fullDescription:
      "Severe flooding reported on Gorordo Avenue in Barangay Lahug. Water level has reached approximately 2 feet, causing multiple vehicles to become stranded. Local authorities are working on clearing the drainage system. Residents are advised to avoid the area and use alternative routes.",
  },
  {
    id: 2,
    lat: 10.3208,
    lng: 123.901,
    location: "Barangay Mabolo",
    description: "Flash flood in commercial area near Mango Square.",
    fullDescription:
      "Flash flooding occurring in the commercial district of Barangay Mabolo, particularly around Mango Square. Water is accumulating rapidly near drainage systems. Business operations have been temporarily suspended. Emergency response teams are on site.",
  },
  {
    id: 3,
    lat: 10.3105,
    lng: 123.892,
    location: "Barangay Capitol Site",
    description: "Street flooding affecting pedestrian walkways.",
    fullDescription:
      "Heavy rainfall has caused significant street flooding in Barangay Capitol Site. Pedestrian walkways are currently submerged. The Capitol building area is experiencing water accumulation. Maintenance crews are working to restore normal conditions.",
  },
  {
    id: 4,
    lat: 10.2944,
    lng: 123.8753,
    location: "Barangay Guadalupe",
    description: "Flood water entering residential homes.",
    fullDescription:
      "Critical flooding situation in residential areas of Barangay Guadalupe. Water has begun entering ground-floor homes. Several families have requested evacuation assistance. Emergency shelters have been prepared. Relief operations are underway.",
  },
  {
    id: 5,
    lat: 10.305,
    lng: 123.896,
    location: "Barangay Kamputhaw",
    description: "Major road closure due to flooding.",
    fullDescription:
      "Significant road closure implemented in Barangay Kamputhaw due to severe flooding conditions. Main thoroughfares are impassable. Traffic is being diverted to alternative routes. Expected clearance time is 3-4 hours pending weather improvement.",
  },
];

export const activeAlerts = [
  {
    id: 1,
    title: "Severe Flooding Warning",
    location: "Barangay Lahug, Gorordo Ave",
    severity: "high",
    time: "Active now",
  },
  {
    id: 2,
    title: "Heavy Rainfall Advisory",
    location: "Metro Cebu Area",
    severity: "medium",
    time: "Active now",
  },
  {
    id: 3,
    title: "Road Closure Notice",
    location: "Barangay Mabolo",
    severity: "low",
    time: "Active for 2 hours",
  },
  {
    id: 4,
    title: "Evacuation Advisory",
    location: "Barangay Guadalupe",
    severity: "high",
    time: "Active now",
  },
];

export const emergencyHotlines = [
  {
    id: 1,
    name: "Cebu City Disaster Risk Reduction",
    number: "(032) 123-4567",
    description: "24/7 emergency response and disaster management",
  },
  {
    id: 2,
    name: "Philippine Red Cross - Cebu",
    number: "(032) 234-5678",
    description: "Emergency medical assistance and relief operations",
  },
  {
    id: 3,
    name: "Bureau of Fire Protection",
    number: "(032) 345-6789",
    description: "Fire emergency and rescue operations",
  },
  {
    id: 4,
    name: "Philippine National Police",
    number: "(032) 456-7890",
    description: "Police assistance and emergency response",
  },
];

export const systemLogs = [
  {
    id: 1,
    type: "info",
    message: "User authentication successful for admin@flowtify.com",
    time: "5 minutes ago",
  },
  {
    id: 2,
    type: "success",
    message: "Database backup completed successfully",
    time: "15 minutes ago",
  },
  {
    id: 3,
    type: "warning",
    message: "High server load detected - monitoring",
    time: "30 minutes ago",
  },
  {
    id: 4,
    type: "info",
    message: "15 new user registrations processed",
    time: "1 hour ago",
  },
  {
    id: 5,
    type: "success",
    message: "System update deployed successfully",
    time: "2 hours ago",
  },
  {
    id: 6,
    type: "info",
    message: "3 flood reports verified and published",
    time: "2 hours ago",
  },
];

export const monthlyReportData = [
  { month: "Jan", value: 85 },
  { month: "Feb", value: 120 },
  { month: "Mar", value: 95 },
  { month: "Apr", value: 140 },
  { month: "May", value: 180 },
  { month: "Jun", value: 160 },
  { month: "Jul", value: 200 },
  { month: "Aug", value: 175 },
  { month: "Sep", value: 190 },
  { month: "Oct", value: 220 },
];

export const statsData = [
  {
    id: 1,
    title: "Total Reports",
    value: "1,247",
    change: "+12%",
    changeType: "positive",
    period: "from last month",
    iconType: "primary",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
    ),
  },
  {
    id: 2,
    title: "Verified Reports",
    value: "892",
    change: "+8%",
    changeType: "positive",
    period: "from last month",
    iconType: "success",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
  },
  {
    id: 3,
    title: "Pending Review",
    value: "23",
    change: "+3%",
    changeType: "negative",
    period: "from yesterday",
    iconType: "warning",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
  },
  {
    id: 4,
    title: "Active Users",
    value: "3,421",
    change: "+24%",
    changeType: "positive",
    period: "from last month",
    iconType: "accent",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
];
