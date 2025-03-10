
import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Index from "./pages/Index";
import Editor from "./pages/Editor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex h-screen w-full overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} />
            
            <div 
              className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
                isSidebarOpen ? 'ml-64' : 'ml-16'
              }`}
            >
              <Navbar 
                toggleSidebar={toggleSidebar} 
                isSidebarOpen={isSidebarOpen} 
              />
              
              <main className="flex-1 overflow-auto bg-background">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/editor/:id" element={<Editor />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
