import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "../components/Navbar";
import Side from "../components/Side";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Categories from "../pages/Categories";
import Sales from "../pages/Sales";
import Fournisseurs from "../pages/Fournisseurs";
import Achats from "../pages/Achats";
import NewAchat from "../pages/NewAchat";
import DetailAchat from "../pages/DetailAchat";
import NewSale from "../pages/NewSale";
import DetailSale from "../components/DetailSale";

function AppRoutes() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <BrowserRouter>

      <div className="d-flex">

        {/* Sidebar */}
        <Side collapsed={collapsed} />

        {/* Partie droite */}
        <div className="flex-grow-1">

          {/* Navbar */}
          <Navbar
            toggleSidebar={() => setCollapsed(!collapsed)}
          />

          {/* Pages */}
          <div className="p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/sales" element={<Sales />} />

              <Route path="/sales/new" element={<NewSale />} />

              <Route path="/sales/:id" element={<DetailSale />} />
              <Route path="/fournisseurs" element={<Fournisseurs />} />
              <Route path="/Achats" element={<Achats />} />
              <Route path="/achats/nouveau" element={<NewAchat />} />
              <Route path="/achats/:id" element={<DetailAchat />} />
              <Route path="/sales" element={<Sales />} />

              <Route path="/sales/new" element={<NewSale />} />

              <Route path="/sales/:id" element={<DetailSale />} />
            </Routes>
          </div>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default AppRoutes;