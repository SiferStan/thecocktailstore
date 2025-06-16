import { CartPageUI } from "./ui/cartPageUI.js";
import { cartUI } from "./ui/cartUI.js";
import { products } from "./data/products.js";

class CartPage {

  initializeApp() {
    // Esto mantiene el comportamiento original
    this.cartPageUI = new CartPageUI();
    window.cartUIInstance = cartUI;

    // Eventos de tracking
    this.trackViewCart();
    this.setupBeginCheckout();
    this.setupAddCoupon();
  }

  getCartItemsFromDOM() {
    const cartItems = document.querySelectorAll(".cart-item");
    const items = [];

    cartItems.forEach((item, index) => {
      const id = item.dataset.id;
      const name = item.querySelector(".item-name")?.textContent?.trim();
      const priceText = item.querySelector(".item-price")?.textContent?.trim();
      const quantityText = item.querySelector(".item-quantity span")?.textContent;

      if (!id || !name || !priceText || !quantityText) return;

      const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
      const quantity = parseInt(quantityText);
      const match = products.find((p) => p.id.toString() === id);
      const category = match?.category || "unknown";
      const stock = true;

      items.push({
        item_id: id,
        item_name: name,
        price: price,
        item_category: category,
        stock: stock,
        quantity: quantity,
      });
    });

    return items;
  }

  trackViewCart() {
      const items = this.getCartItemsFromDOM();
      if (!items.length) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "view_cart",
        ecommerce: {
          items: items,
        },
      });

      console.log("[view_cart]", items);
  }

  setupBeginCheckout() {
    const btn = document.querySelector(".checkout-button");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const items = this.getCartItemsFromDOM();
      if (!items.length) return;

      const totalText = document.querySelector(".cart-total")?.textContent?.trim();
      if (!totalText) return;

      const value = parseFloat(totalText.replace(/[^0-9.]/g, ""));
      if (isNaN(value)) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: "USD",
          value: parseFloat(value.toFixed(2)),
          items: items,
        },
      });

      console.log("[begin_checkout]", { value, items });
    });
  }


  setupAddCoupon() {
    const btn = document.querySelector(".apply-coupon");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const totalText = document.querySelector(".cart-total")?.textContent.trim();
      const total = parseFloat(totalText.replace(/[^0-9.]/g, ""));
      const couponValue = parseFloat((total * 0.1).toFixed(2));

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "add_coupon",
        ecommerce: {
          coupon_id: "DESCUENTO10",
          coupon_value: couponValue,
          coupon_activation: true,
        },
      });

      console.log("[add_coupon]", {
        coupon_id: "DESCUENTO10",
        coupon_value: couponValue,
        coupon_activation: true,
      });
    });
  }
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  const cart = new CartPage();
  cart.initializeApp();
});
