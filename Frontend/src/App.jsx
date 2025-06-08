import React, { useState, useEffect, useRef } from "react";
import Loading from "./Loading";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
  });
  const [deleteName, setDeleteName] = useState("");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category", formData.category);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        setFormData({ name: "", price: "", category: "", image: null });
        if (fileInputRef.current) fileInputRef.current.value = null;
        alert("New Item Added Successfully");
        fetchProducts();
      }
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!deleteName.trim()) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE}/products/${deleteName}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Product deleted successfully");
        setDeleteName("");
        fetchProducts(); // re-fetch
      } else {
        alert("Product not found or could not be deleted");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
          autoComplete="on"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          accept=".jpg, .jpeg, .png"
          onChange={handleImageChange}
          ref={fileInputRef}
        />
        <button type="submit" disabled={isAdding}>
          {isAdding ? "Adding..." : "Add Product"}
        </button>
      </form>

      <h2>Products List</h2>
      {loading ? (
        <Loading />
      ) : (
        <ul>
          {products.map((item) => (
            <li key={item._id}>
              <p>
                {item.name} costs {item.price}₹ Category: {item.category}
              </p>
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} width="100" />
              )}
            </li>
          ))}
        </ul>
      )}

      <h2>Delete Product by Name</h2>
      <form onSubmit={handleDelete}>
        <input
          type="text"
          name="Delete Item"
          id="delete_item"
          placeholder="Enter product name to delete"
          value={deleteName}
          onChange={(e) => setDeleteName(e.target.value)}
          required
        />
        <button type="submit" disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </form>
    </div>
  );
}

export default App;
