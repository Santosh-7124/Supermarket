import React, { useState, useRef } from "react";

function UpdateItem({ API_BASE, fetchProducts }) {
  const [searchName, setSearchName] = useState("");
  const [product, setProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      const found = data.find((item) => item.name === searchName);

      if (found) {
        setProduct({
          name: found.name,
          price: found.price,
          category: found.category,
          image: null,
          imageUrl: found.imageUrl,
        });
      } else {
        alert("Item not found");
        setProduct(null);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("category", product.category);
    if (product.image) {
      formData.append("image", product.image);
    }

    try {
      const response = await fetch(`${API_BASE}/products/${searchName}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        alert("Item updated successfully");
        setProduct(null);
        setSearchName("");
        fetchProducts();
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  function handleCancel() {
    setProduct(false);
    setSearchName("");
  }

  return (
    <>
      <h2>Update Product by Name</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter product name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {product && (
        <form onSubmit={handleUpdate} encType="multipart/form-data">
          <h3>Update Form</h3>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleFormChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={product.category}
            onChange={handleFormChange}
            required
          />

          <div>
            <p>Current Image:</p>
            {product.imageUrl && (
              <img src={product.imageUrl} alt="current" width="100" />
            )}
          </div>
          {product.image && (
            <div>
              <p>Selected New Image:</p>
              <img
                src={URL.createObjectURL(product.image)}
                alt="preview"
                width="100"
              />
            </div>
          )}

          <input
            type="file"
            name="image"
            accept=".jpg, .jpeg, .png"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          <button onClick={handleCancel}>Cancel</button>
          <button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Item"}
          </button>
        </form>
      )}
    </>
  );
}

export default UpdateItem;
