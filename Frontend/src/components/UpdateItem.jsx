import React, { useState, useRef } from "react";
import ClickSound from "/mouse_click_sound.mp3";

function UpdateItem({ API_BASE, fetchProducts }) {
  const [searchName, setSearchName] = useState("");
  const [product, setProduct] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState("");

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
        setErrorMessage("");
      } else {
        setProduct(null);
        setErrorMessage("Item not found");
      }
    } catch (error) {
      console.error("Search error:", error);
      setErrorMessage("Something went wrong while searching");
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

  const [successMessage, setSuccessMessage] = useState("");

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
        setSuccessMessage("Item updated successfully.");
        setProduct(null);
        setSearchName("");
        fetchProducts();
      } else {
        setSuccessMessage("Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error);
      setSuccessMessage("Something went wrong. Please try again ⚠️");
    } finally {
      setIsUpdating(false);
    }
  };

  function handleCancel() {
    setProduct(false);
    setSearchName("");
    handleButtonClick();
  }

  function handleButtonClick() {
    const clickSound = new Audio(ClickSound);
    clickSound.play();
  }

  return (
    <>
      {!product ? (
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter product name to update"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            required
          />
          <button type="submit" onClick={handleButtonClick}>
            Search
          </button>
        </form>
      ) : (
        <form onSubmit={handleUpdate} encType="multipart/form-data">
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
            min="0"
            step="any"
            required
            className="price-input"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={product.category}
            onChange={handleFormChange}
            required
          />

          <div
            className="image-input"
            onClick={() => fileInputRef.current.click()}
          >
            {product.image ? (
              <div className="image-input-img">
                <img
                  src={URL.createObjectURL(product.image)}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <p>Click on image to change</p>
              </div>
            ) : product.imageUrl ? (
              <div className="image-input-img">
                <img
                  src={product.imageUrl}
                  alt="Current"
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

          <button onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            onClick={handleButtonClick}
          >
            {isUpdating ? "Updating..." : "Update Item"}
          </button>
        </form>
      )}
      {errorMessage && (
        <div className="alert">
          <div className="alert-container">
            <p>{errorMessage}</p>
            <div className="alert-container-buttons">
              <button
                onClick={() => {
                  setErrorMessage("");
                  handleButtonClick();
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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

export default UpdateItem;
