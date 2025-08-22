import React, { useState } from "react";
import ClickSound from "/mouse_click_sound.mp3";

function DeleteItem({ API_BASE, fetchProducts }) {
  const [searchName, setSearchName] = useState("");
  const [product, setProduct] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!product?.name) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE}/products/${product.name}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccessMessage("Product deleted successfully.");
        setProduct(null);
        setSearchName("");
        fetchProducts();
      } else {
        setSuccessMessage("Product not be deleted.");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setSuccessMessage("Something went wrong while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  function handleCancel() {
    setProduct(null);
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
            placeholder="Enter product name to delete"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            required
          />
          <button type="submit" onClick={handleButtonClick}>
            Search
          </button>
        </form>
      ) : (
        <form onSubmit={handleDelete}>
          <input type="text" value={product.name} readOnly />
          <input
            type="number"
            value={product.price}
            readOnly
            className="price-input"
          />
          <input type="text" value={product.category} readOnly />

          <div className="image-input">
            <div className="image-input-img">
              <img
                src={product.imageUrl}
                alt="Current"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          <button type="button" onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isDeleting}
            onClick={handleButtonClick}
          >
            {isDeleting ? "Deleting..." : "Delete Item"}
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

export default DeleteItem;
