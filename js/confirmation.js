import { ConfirmationUI } from "./ui/confirmationUI.js";
import { products } from "./data/products.js";

document.addEventListener("DOMContentLoaded", () => {
  const confirmationUI = new ConfirmationUI();

  // Evento purchase
  const orderNumber = document.querySelector(".order-number")?.textContent?.trim();
  const shippingText = document.querySelector(".order-summary .summary-row:nth-child(2) span:last-child")?.textContent?.trim();
  const taxText = document.querySelector(".order-summary .summary-row:nth-child(3) span:last-child")?.textContent?.trim();
  const totalText = document.querySelector(".order-summary .summary-row.total span:last-child")?.textContent?.trim();

  const shipping = parseFloat(shippingText?.replace(/[^0-9.]/g, "") || 0);
  const tax = parseFloat(taxText?.replace(/[^0-9.]/g, "") || 0);
  const total = parseFloat(totalText?.replace(/[^0-9.]/g, "") || 0);

  const paymentText = document.querySelector(".order-details p:nth-child(6)")?.textContent?.toLowerCase();
  let paymentType = "unknown";
  if (paymentText?.includes("tarjeta")) paymentType = "credit_card";
  else if (paymentText?.includes("paypal")) paymentType = "paypal";

  const itemElements = document.querySelectorAll(".order-item");
  const items = [];

  itemElements.forEach((el) => {
    const name = el.querySelector("h4")?.textContent?.trim();
    const priceText = el.querySelector("p")?.textContent?.match(/\$([0-9.,]+)/)?.[1];
    const quantity = parseInt(el.querySelector(".item-quantity")?.textContent) || 1;

    if (!name || !priceText) return;

    const price = parseFloat(priceText.replace(/,/g, ""));
    const match = products.find((p) => p.name === name);
    const id = match?.id || "unknown";
    const category = match?.category || "unknown";

    items.push({
      item_id: id,
      item_name: name,
      price: price,
      item_category: category,
      stock: true,
      quantity: quantity,
    });
  });

  if (!orderNumber || !items.length) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: orderNumber,
      value: total,
      currency: "USD",
      shipping: shipping,
      tax: tax,
      payment_type: paymentType,
      items: items,
    },
  });

  console.log("[purchase]", {
    transaction_id: orderNumber,
    value: total,
    currency: "USD",
    shipping,
    tax,
    payment_type: paymentType,
    items,
  });
});
