import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/api";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { ToastContainer } from "./components/ui/ToastContainer";
import { AppRoutes } from "./routes/AppRoutes";
import { useAuthInit } from "./hooks/useAuthInit";

function App() {
  useAuthInit();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppRoutes />
          <ToastContainer />
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
