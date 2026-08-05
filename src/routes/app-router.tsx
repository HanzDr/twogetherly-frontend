import { createBrowserRouter, Navigate } from "react-router-dom";

import { RootLayout } from "@/components/layouts/root-layout";
import { DiaryPage } from "@/components/pages/diary-page";
import { LoginPage } from "@/components/pages/login-page";
import { PartnerOnboardingPage } from "@/components/pages/partner-onboarding-page";
import { ProfileSettingsPage } from "@/components/pages/profile-settings-page";
import { SignUpPage } from "@/components/pages/sign-up-page";
import { PartnerRequiredDashboard } from "@/components/routes/partner-required-dashboard";

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
        path: "dashboard",
        element: <PartnerRequiredDashboard />,
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
