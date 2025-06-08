import React, { useState, useEffect, useRef } from "react";

function DeleteItem({ API_BASE, fetchProducts }) {
  const [deleteName, setDeleteName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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
        fetchProducts();
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
    <>
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
    </>
  );
}

export default DeleteItem;
