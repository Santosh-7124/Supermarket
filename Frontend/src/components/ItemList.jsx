import React, { useState, useEffect, useRef } from "react";
import Loading from "../Loading";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function ItemList({ products, loading }) {
  return (
    <>
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
    </>
  );
}

export default ItemList;
