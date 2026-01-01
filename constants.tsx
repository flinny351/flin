
import React from 'react';

export const APP_NAME = "ShopInsta";
export const APP_DESCRIPTION = "The easiest way to launch your storefront.";

export const DEFAULT_SHOP_HTML = `
<div class="shop-container">
  <h1>Welcome to my Awesome Shop</h1>
  <p>Check out our amazing products below!</p>
  <div class="product-grid">
    <div class="product-card">
      <img src="https://picsum.photos/seed/shop1/300/200" alt="Product" />
      <h3>Cool Sneakers</h3>
      <p>$99.00</p>
      <button onclick="addToCart('Cool Sneakers')">Add to Cart</button>
    </div>
  </div>
</div>
`.trim();

export const DEFAULT_SHOP_CSS = `
body { font-family: sans-serif; margin: 0; padding: 20px; background: #f4f4f4; }
.shop-container { max-width: 800px; margin: auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
h1 { color: #333; text-align: center; }
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 30px; }
.product-card { border: 1px solid #eee; padding: 15px; border-radius: 8px; text-align: center; transition: transform 0.2s; }
.product-card:hover { transform: translateY(-5px); }
.product-card img { width: 100%; border-radius: 4px; }
button { background: #2563eb; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; margin-top: 10px; }
button:hover { background: #1d4ed8; }
`.trim();

export const DEFAULT_SHOP_JS = `
function addToCart(item) {
  alert('Added ' + item + ' to cart!');
}
console.log('Shop initialized');
`.trim();
