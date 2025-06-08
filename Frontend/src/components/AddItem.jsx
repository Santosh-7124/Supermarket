import React, { useState, useEffect, useRef } from "react";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function AddItem({ API_BASE, fetchProducts }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
  });
  const fileInputRef = useRef(null);
  const [isAdding, setIsAdding] = useState(false);

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
  return (
    <>
      <h2>Add New Product</h2>
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
    </>
  );
}

export default AddItem;
