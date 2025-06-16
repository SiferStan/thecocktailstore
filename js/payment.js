import { PaymentUI } from "./ui/paymentUI.js";
import { products } from "./data/products.js";
import { cartService } from "./services/cart.js";
import { checkoutService } from "./services/checkout.js";

document.addEventListener("DOMContentLoaded", () => {
  const paymentUI = new PaymentUI();

  const form = document.getElementById("payment-form");
  if (!form) return;

  form.addEventListener("submit", () => {
    const cartItems = cartService.getItems();
    if (!cartItems.length) return;

    const items = cartItems.map((item) => {
      const match = products.find((p) => p.id === item.id);
      return {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        item_category: match?.category || "unknown",
        stock: true,
        quantity: item.quantity,
      };
    });

    const subtotal = cartService.getTotal();
    const shipping = checkoutService.getShippingCost();
    const tax = checkoutService.getTaxAmount();
    const total = parseFloat((subtotal + shipping + tax).toFixed(2));
    const paymentMethod = form.querySelector('input[name="payment"]:checked')?.value || "unknown";

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "add_payment_info",
      ecommerce: {
        currency: "USD",
        value: total,
        shipping: parseFloat(shipping.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        payment_type: paymentMethod,
        items: items,
      },
    });

    console.log("[add_payment_info]", {
      value: total,
      currency: "USD",
      shipping,
      tax,
      payment_type: paymentMethod,
      items,
    });
  });
});
