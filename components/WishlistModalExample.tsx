"use client";

import { useState } from "react";
import WishlistModal from "./WishlistModal";

// Example usage of the WishlistModal component
export default function WishlistModalExample() {
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [itemName, setItemName] = useState("MacBook Pro M3");
  const [itemPrice, setItemPrice] = useState(2499);
  const [itemDescription, setItemDescription] = useState("16-inch laptop for development work");

  const handleSaveItem = () => {
    // Save logic here
    console.log("Saving item:", { itemName, itemPrice, itemDescription });
    setShowWishlistModal(false);
  };

  return (
    <div className="p-4">
      <button
        onClick={() => setShowWishlistModal(true)}
        className="bg-gradient-to-r from-gold to-gold/80 text-black px-6 py-3 rounded-xl font-semibold hover:from-gold/90 hover:to-gold/70 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-gold/20"
      >
        ✨ Add to Wishlist
      </button>

      {showWishlistModal && (
        <WishlistModal
          onClose={() => setShowWishlistModal(false)}
          title="Dream Item"
          icon="💫"
          size="md"
          footer={
            <div className="flex gap-3">
              <button
                onClick={() => setShowWishlistModal(false)}
                className="flex-1 px-4 py-2 bg-muted/20 text-muted-foreground hover:bg-muted/30 hover:text-foreground rounded-xl transition-all duration-300 border border-muted/30 hover:border-muted/50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-gold to-gold/80 text-black rounded-xl font-semibold hover:from-gold/90 hover:to-gold/70 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-gold/20"
              >
                ✨ Save Dream
              </button>
            </div>
          }
        >
          {/* Item Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Dream Item Name
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full bg-background/50 border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all duration-300 backdrop-blur-sm"
                placeholder="What do you dream of?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold font-bold">$</span>
                <input
                  type="number"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(Number(e.target.value))}
                  className="w-full bg-background/50 border border-gold/20 rounded-xl pl-8 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all duration-300 backdrop-blur-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Why do you want this?
              </label>
              <textarea
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                rows={3}
                className="w-full bg-background/50 border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all duration-300 backdrop-blur-sm resize-none"
                placeholder="Tell us about your dream..."
              />
            </div>

            {/* Preview Card */}
            <div className="bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/30 rounded-2xl p-4 mt-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💎</span>
                <div>
                  <h3 className="font-bold text-foreground">{itemName || "Your Dream Item"}</h3>
                  <p className="text-lg font-bold text-gold">
                    ${itemPrice ? itemPrice.toLocaleString() : "0"}
                  </p>
                </div>
              </div>
              {itemDescription && (
                <p className="text-sm text-muted-foreground bg-black/20 rounded-lg p-3">
                  💭 {itemDescription}
                </p>
              )}
            </div>
          </div>
        </WishlistModal>
      )}
    </div>
  );
}