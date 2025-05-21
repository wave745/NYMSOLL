import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DomainSearch from "@/pages/DomainSearch";
import VanityWallet from "@/pages/VanityWallet";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";
import NavBar from "@/components/NavBar";
import ThemeProvider from "@/components/ThemeProvider";
import { motion } from "framer-motion";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DomainSearch} />
      <Route path="/search" component={DomainSearch} />
      <Route path="/vanity" component={VanityWallet} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-background font-sans"
        >
          <NavBar />
          <main className="container mx-auto px-4 pt-24 pb-16 min-h-screen">
            <Router />
          </main>
        </motion.div>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
