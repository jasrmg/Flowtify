import MapClient from "./MapClient";
import "./map.css";

export const metadata = {
  title: "Flowtify | Map View",
  description:
    "View an interactive map highlighting areas with user-submitted flood reports.",
};

// This is now the simple Server Component page
export default function Page() {
  return <MapClient />;
}
