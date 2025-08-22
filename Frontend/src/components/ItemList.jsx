import React, { useState, useEffect, useRef } from "react";
import Loading from "../Loading";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function ItemList({ products, loading }) {
  return (
    <div className="app-right">
      <h2>Inventory</h2>
      <div className="items-container">
        {loading ? (
          <Loading />
        ) : (
          <>
            {products.map((item) => (
              <div className="item-set" key={item._id}>
                <div className="item-set-img">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} width="100" />
                  )}
                </div>

                <p>
                  {item.name} costs {item.price}₹ Category: {item.category}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default ItemList;
