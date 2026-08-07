import { createBrowserRouter, Navigate } from "react-router-dom";

import { RootLayout } from "@/components/layouts/root-layout";
import { DashboardPage } from "@/components/pages/dashboard-page";
import { DiaryPage } from "@/components/pages/diary-page";
import { LoginPage } from "@/components/pages/login-page";
import { PartnerOnboardingPage } from "@/components/pages/partner-onboarding-page";
import { ProfileSettingsPage } from "@/components/pages/profile-settings-page";
import { SignUpPage } from "@/components/pages/sign-up-page";
import { VerificationSuccessPage } from "@/components/pages/verification-success-page";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "sign-up",
        element: <SignUpPage />,
      },
      {
        path: "verify-email",
        element: <VerificationSuccessPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "partner-setup",
        element: <PartnerOnboardingPage />,
      },
      {
        path: "diary",
        element: <DiaryPage />,
      },
      {
        path: "profile-settings",
        element: <ProfileSettingsPage />,
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  },
]);
