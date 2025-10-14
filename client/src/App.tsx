import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminBar from "./components/AdminBar";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import NotFound from "@/pages/not-found";

const Dashboard = lazy(() => import("@/pages/dashboard"));
const Admin = lazy(() => import("@/pages/admin"));
const PublicProfile = lazy(() => import("@/pages/public-profile"));
const InvitePage = lazy(() => import("@/pages/invite-page"));
const TicketPage = lazy(() => import("@/pages/ticket"));
const ScanPage = lazy(() => import("@/pages/scan"));
const ForgotPasswordPage = lazy(() => import("@/pages/forgot-password"));
const ResetPasswordPage = lazy(() => import("@/pages/reset-password"));
const ForceChangePassword = lazy(() => import("@/pages/force-change-password"));
const PublicClaimPage = lazy(() => import("@/pages/PublicClaim"));
const MyTicketsPage = lazy(() => import("@/pages/my-tickets"));
const QRDashboard = lazy(() => import("@/pages/qr-dashboard"));

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/force-change-password" component={ForceChangePassword} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/admin" component={Admin} />
        <Route path="/my-tickets" component={MyTicketsPage} />
        <Route path="/qr-dashboard" component={QRDashboard} />
        <Route path="/u/:username" component={PublicProfile} />
        <Route path="/invite/:slug" component={InvitePage} />
        <Route path="/ticket/:code" component={TicketPage} />
        <Route path="/q/:code" component={TicketPage} />
        <Route path="/scan" component={ScanPage} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route path="/reset-password" component={ResetPasswordPage} />
        <Route path="/p/:username" component={PublicClaimPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminBar />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
