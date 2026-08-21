import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import Login from "./pages/Login";

import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

import Farms from "./pages/Farms";

import Crops from "./pages/Crop";

import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import AIAssistance from "./components/AIAssistance";
function App() {

  return (

    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/farm" element={<Farms />} />

        <Route path="/crops" element={<Crops />} />

        <Route path="/income" element={<Income />} />
        <Route path="/expenses" element={<Expense />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai-assistance" element={<AIAssistance />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;