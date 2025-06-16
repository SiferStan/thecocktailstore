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

      form.submit(); // continuar a pago real si hace falta
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CheckoutPage();
});
