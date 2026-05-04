import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SonnerToaster } from "@/components/SonnerToaster";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => (
  <>
    <SonnerToaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
