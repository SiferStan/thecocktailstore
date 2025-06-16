import { CheckoutUI } from "./ui/checkoutUI.js";
import { products } from "./data/products.js";

class CheckoutPage {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.checkoutUI = new CheckoutUI();
    this.setupShippingInfoTracking();
  }

  getItemsFromSummary() {
    const itemElements = document.querySelectorAll(".order-item");
    const items = [];

    itemElements.forEach((el, index) => {
      const name = el.querySelector("h4")?.textContent.trim();
      const quantityText = el.querySelector(".item-quantity")?.textContent.trim();
      const priceText = el.querySelector("p")?.textContent.trim();

      if (!name || !quantityText || !priceText) return;

      const quantity = parseInt(quantityText);
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
      const product = products.find((p) => p.name === name);
      const id = product?.id || "unknown";
      const category = product?.category || "unknown";
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
    const btn = document.querySelector('a.button--secondary[href="cart.html"]');
    if (!btn) return;

    btn.addEventListener("click", () => {
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
    });
  }

  setupBeginCheckout() {
  const btn = document.querySelector('a.button--primary[href="checkout.html"]');
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
  setupShippingInfoTracking() {
    const form = document.getElementById("shipping-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const items = this.getItemsFromSummary();
      if (!items.length) return;

      // Obtener valor total
      const totalText = document.querySelector(".total-final span:last-child")?.textContent.trim();
      const value = parseFloat(totalText.replace(/[^0-9.]/g, ""));
      if (isNaN(value)) return;

      // Obtener método de envío
      const shippingInput = document.querySelector('input[name="shipping"]:checked');
      const shippingLabel = shippingInput?.closest(".shipping-option")?.querySelector(".shipping-price")?.textContent.trim();
      const shippingPrice = shippingLabel ? parseFloat(shippingLabel.replace(/[^0-9.]/g, "")) : 0;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "add_shipping_info",
        ecommerce: {
          currency: "USD",
          value: parseFloat(value.toFixed(2)),
          shipping_price: shippingPrice,
          items: items,
        },
      });

      console.log("[add_shipping_info]", {
        value,
        currency: "USD",
        shipping_price: shippingPrice,
        items,
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CheckoutPage();
});
