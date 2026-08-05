import { Navigate } from "react-router-dom";

import { DashboardPage } from "@/components/pages/dashboard-page";

export function PartnerRequiredDashboard() {
  const hasLinkedPartner = sessionStorage.getItem("twogetherly:partner-linked") === "true";
  return hasLinkedPartner ? <DashboardPage /> : <Navigate to="/partner-setup" replace />;
}
