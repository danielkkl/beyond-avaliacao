import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Ficha from "./pages/Ficha";
import Pricing from "./pages/Pricing";
import Reports from "./pages/Reports";
import DashboardAprimorado from "./pages/DashboardAprimorado";
import PatientProfile from "./pages/PatientProfile";
import Upgrade from "./pages/Upgrade";

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;

  return (
    <Switch>
      {/* Rotas públicas */}
      <Route path={"/"} component={LandingPage} />
      <Route path={"/home"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/pricing"} component={Pricing} />
      
      {/* Rotas protegidas */}
      {isAuthenticated && (
        <>
          <Route path={"/dashboard"} component={Dashboard} />
          <Route path={"/ficha/:id?"} component={Ficha} />
          <Route path={"/reports"} component={Reports} />
          <Route path={"/dashboard-novo"} component={DashboardAprimorado} />
          <Route path={"/paciente/:id"} component={PatientProfile} />
          <Route path={"/upgrade"} component={Upgrade} />
        <>
      )}
      
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-right" richColors />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
