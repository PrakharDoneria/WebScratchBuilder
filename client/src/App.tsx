import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import ProjectsPage from "@/pages/ProjectsPage";
import EditorPage from "@/pages/EditorPage";
import PreviewPage from "@/pages/PreviewPage";
import Navbar from "@/components/Navbar";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function Router() {
  return (
    <Switch>
      <Route path="/" component={ProjectsPage} />
      <Route path="/editor/:id?" component={EditorPage} />
      <Route path="/preview/:id" component={PreviewPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1">
            <Router />
          </div>
        </div>
        <Toaster />
      </DndProvider>
    </QueryClientProvider>
  );
}

export default App;
