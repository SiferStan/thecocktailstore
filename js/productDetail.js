import { ProductDetailUI } from "./ui/productDetailUI.js";
import { cartUI } from "./ui/cartUI.js";

class ProductPageApp {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    // Esto mantiene el comportamiento original
    this.productDetailUI = new ProductDetailUI();
    window.cartUIInstance = cartUI;

    // Eventos de tracking
    this.trackViewItem();
    this.trackAddToCart();
  }

  trackViewItem() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    const name = document.querySelector(".product-title")?.textContent.trim();
    const priceText = document.querySelector(".product-price")?.textContent.trim();
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
    const category = document.querySelector(".category")?.textContent.trim().toLowerCase();
    const stock = document.querySelector(".stock-status")?.classList.contains("in-stock");

    if (!name || isNaN(price)) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "view_item",
      ecommerce: {
        items: [
          {
            item_id: id,
            item_name: name,
            price: price,
            item_category: category,
            stock: stock,
          },
        ],
      },
    });

    console.log("view_item (detalle):", { id, name, price, category, stock });
  }


  trackAddToCart() {
    const button = document.querySelector(".add-to-cart");
    if (!button) return;

    button.addEventListener("click", () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      const name = document.querySelector(".product-title")?.textContent.trim();
      const priceText = document.querySelector(".product-price")?.textContent.trim();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
      const category = document.querySelector(".category")?.textContent.trim().toLowerCase();
      const stock = document.querySelector(".stock-status")?.classList.contains("in-stock");
      const quantity = parseInt(document.getElementById("quantity")?.value) || 1;

      if (!id || !name || isNaN(price)) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          currency: "USD",
          items: [
            {
              item_id: id,
              item_name: name,
              price: price,
              item_category: category,
              stock: stock,
              quantity: quantity
            },
          ],
        },
      });

      console.log("add_to_cart (detalle):", { id, name, price, category, stock, quantity });
    });
  }
}

// ✅ Esto sí se mantiene igual
document.addEventListener("DOMContentLoaded", () => {
  window.app = new ProductPageApp();
});
