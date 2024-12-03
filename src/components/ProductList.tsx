import React, { useRef, useState } from "react";

import sampleProductJson from "../assets/products.json";
import { ItemDistributor } from "../itemDistributor";
import { Item, Package } from "../types";

const PRODUCTS = sampleProductJson as Item[];

const ProductList: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [balancedPackages, setBalancedPackages] = useState<Package[]>([]);
  const packageRef = useRef<HTMLDivElement | null>(null);

  const handleItemSelection = (item: Item) => {
    setSelectedItems((previousItems) => {
      if (previousItems.includes(item)) {
        return previousItems.filter((item_) => item_ !== item);
      } else {
        return [...previousItems, item];
      }
    });
  };

  const placeOrder = () => {
    const orderItems: Item[] = PRODUCTS.filter((product) =>
      selectedItems.includes(product),
    );

    const packages = ItemDistributor.distributeItems(orderItems);
    setBalancedPackages(packages);

    // Scroll to packages
    packageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>

      {/* Product list */}
      <div className="space-y-2 mb-4">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedItems.includes(product)}
              onChange={() => handleItemSelection(product)}
              className="mr-2"
            />
            <span>
              {product.name} - ${product.price} - {product.weight} g
            </span>
          </div>
        ))}
      </div>

      {/* Place order button */}
      <button
        onClick={placeOrder}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Place Order
      </button>

      {/* Packages display */}
      {balancedPackages.length > 0 && (
        <div ref={packageRef} className="mt-4">
          <h2 className="text-xl font-semibold">
            This order has following packages:
          </h2>
          {balancedPackages.map((package_, index) => (
            <div key={index} className="border p-2 mb-2">
              <p>Package{index + 1}:</p>
              <span>
                Items - {package_.items.map((item) => `${item.name},`)}
              </span>
              <p>Total weight: {package_.totalWeight.toFixed(2)} g</p>
              <p>Total price: ${package_.totalPrice.toFixed(2)}</p>
              <p>Courier price: ${package_.courierPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
