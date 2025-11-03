import { MapView } from "./MapView";
import "./map.css";

export const metadata = {
  title: "Flowtify | Map View",
  description:
    "View an interactive map highlighting areas with user-submitted flood reports. Click markers to see brief details and access full report information.",
};

export const Map = () => {
  return <MapView />;
};

export default Map;
