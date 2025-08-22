import React, { useState, useEffect, useRef } from "react";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
import ClickSound from "/mouse_click_sound.mp3";

function AddItem({ API_BASE, fetchProducts }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
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
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const [successMessage, setSuccessMessage] = useState("");

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
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
        setSuccessMessage("New Item Added Successfully!");
        fetchProducts();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setSuccessMessage("Failed to add product!");
    } finally {
      setIsAdding(false);
    }
  };

  function handleButtonClick() {
    const clickSound = new Audio(ClickSound);
    clickSound.play();
  }

  return (
    <>
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
          min="0"
          step="any"
          required
          className="price-input"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <div
          className="image-input"
          onClick={() => fileInputRef.current.click()}
        >
          {imagePreview ? (
            <div className="image-input-img">
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <p>Click on image to change</p>
            </div>
          ) : (
            <span>Upload Product Image</span>
          )}
        </div>

        <input
          type="file"
          name="image"
          accept=".jpg, .jpeg, .png"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        <button type="submit" disabled={isAdding} onClick={handleButtonClick}>
          {isAdding ? "Adding..." : "Add Product"}
        </button>
      </form>
      {successMessage && (
        <div className="alert">
          <div className="alert-container">
            <p>{successMessage}</p>
            <div className="alert-container-buttons">
              <button
                onClick={() => {
                  setSuccessMessage("");
                  handleButtonClick();
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddItem;
