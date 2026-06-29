import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Categories from "../pages/Categories";
import Sales from "../pages/Sales";
import Fournisseurs from "../pages/Fournisseurs";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/Fournisseurs" element={<Fournisseurs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;