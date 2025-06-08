import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
import ItemList from "./components/ItemList";
import AddItem from "./components/AddItem";
import DeleteItem from "./components/DeleteItem";
import UpdateItem from "./components/UpdateItem";
import Navbar from "./Navbar";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      setProducts(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <AddItem fetchProducts={fetchProducts} API_BASE={API_BASE} />
            }
          />
          <Route
            path="add"
            element={
              <AddItem fetchProducts={fetchProducts} API_BASE={API_BASE} />
            }
          />
          <Route
            path="update"
            element={
              <UpdateItem fetchProducts={fetchProducts} API_BASE={API_BASE} />
            }
          />
          <Route
            path="delete"
            element={
              <DeleteItem fetchProducts={fetchProducts} API_BASE={API_BASE} />
            }
          />
          <Route
            path="*"
            element={
              <AddItem fetchProducts={fetchProducts} API_BASE={API_BASE} />
            }
          />
        </Route>
      </Routes>
      <ItemList products={products} loading={loading} />
    </BrowserRouter>
    // <div>
    //   <AddItem fetchProducts={fetchProducts} API_BASE={API_BASE} />
    //   <ItemList products={products} loading={loading} />
    //   <UpdateItem fetchProducts={fetchProducts} API_BASE={API_BASE} />
    //   <DeleteItem fetchProducts={fetchProducts} API_BASE={API_BASE} />
    // </div>
  );
}

export default App;
