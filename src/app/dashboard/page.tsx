"use client";

import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { DashboardPage } from "@/views/dashboard/dashboard-page";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}
