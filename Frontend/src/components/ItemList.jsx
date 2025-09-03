import React, { useState, useEffect, useRef } from "react";
import Loading from "../Loading";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function ItemList({ products, loading }) {
  return (
    <div className="app-right">
      <h2>Inventory</h2>
      {loading ? (
        <Loading />
      ) : (
        <div className="items-container">
          {products.map((item) => (
            <div className="item-set" key={item._id}>
              <div className="item-set-img">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} width="100" />
                )}
              </div>
              <div className="item-set-info">
                <div className="item-set-text">
                  <h3>{item.name}</h3>
                  <span> {item.category}</span>
                </div>
                <p>₹ {item.price} </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemList;
