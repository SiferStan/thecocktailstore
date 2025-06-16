import { cartUI } from "./ui/cartUI.js";
import { productsUI } from "./ui/productsUI.js";

class App {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    this.cartUI = cartUI;
    this.productsUI = productsUI;

    this.setupMobileMenu();
    this.trackViewItemList();
    this.trackViewItem();
    this.trackAddToCart();
  }

  setupMobileMenu() {
    const menuButton = document.createElement("button");
    menuButton.className = "nav__toggle";
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';

    const nav = document.querySelector(".nav");
    const menu = document.querySelector(".nav__menu");

    nav.insertBefore(menuButton, menu);

    menuButton.addEventListener("click", () => {
      menu.classList.toggle("show");
    });

    const navLinks = document.querySelectorAll(".nav__link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("show");
      });
    });

    if (!document.getElementById("mobileStyles")) {
      const styles = document.createElement("style");
      styles.id = "mobileStyles";
      styles.textContent = `
        .nav__toggle {
          display: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: var(--text-color);
          transition: .3s;
        }

        @media screen and (max-width: 768px) {
          .nav__toggle {
            display: block;
          }

          .nav__menu {
            position: fixed;
            top: 4rem;
            left: -100%;
            width: 80%;
            height: 100vh;
            padding: 2rem;
            background-color: var(--bg-color);
            box-shadow: 2px 0 4px rgba(0,0,0,.1);
            transition: .4s;
          }

          .nav__menu.show {
            left: 0;
          }

          .nav__list {
            flex-direction: column;
          }

          .nav__item {
            margin: 1.5rem 0;
          }
        }
      `;
      document.head.appendChild(styles);
    }
  }

  // ✅ view_item_list: al cargar lista de productos
  trackViewItemList() {
    const productElements = document.querySelectorAll('.product__content');
    const items = [];

    productElements.forEach((el, index) => {
      const name = el.querySelector('.product__title a').textContent.trim();
      const price = parseFloat(el.querySelector('.product__price').textContent.replace(/[^0-9.]/g, ''));
      const id = el.querySelector('.product__button').dataset.id;
      const category = el.dataset.category || 'smartphones';
      const stock = true; // Modificar si es dinámico

      items.push({
        item_id: id,
        item_name: name,
        price: price,
        item_category: category,
        stock: stock
      });
    });

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'view_item_list',
      ecommerce: {
        item_list_id: "1",
        items: items
      }
    });
  }

  // ✅ view_item: al hacer clic en botón "Ver detalles"
  trackViewItem () {
    document.querySelectorAll('.button--secondary[href^="product.html?id="]').forEach((btn) => {
      btn.addEventListener("click", function () {
        const card = btn.closest(".product__card");

        // Obtener ID desde el href del botón
        const url = new URL(btn.href, window.location.origin);
        const id = url.searchParams.get("id");

        // Extraer nombre del producto
        const name = card.querySelector(".product__title a").textContent.trim();

        // Extraer precio y convertirlo a número
        const priceText = card.querySelector(".product__price").textContent.trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));

        // Stock fijo a true (puedes hacerlo dinámico si se necesita)
        const stock = true;

        // Enviar al dataLayer
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "view_item",
          ecommerce: {
            items: [
              {
                item_id: id,
                item_name: name,
                price: price,
                stock: stock,
              },
            ],
          },
        });

        // Opcional: console.log para verificar
        console.log("Evento view_item enviado:", { id, name, price, stock });
      });
    });
  }

  // ✅ add_to_cart: al hacer clic en botón "Añadir al carrito"
  trackAddToCart() {
    document.querySelectorAll('.product__button').forEach((button, index) => {
      button.addEventListener('click', function () {
        const card = button.closest('.product__card');

        const id = button.dataset.id;
        const name = card.querySelector('.product__title a').textContent.trim();
        const priceText = card.querySelector('.product__price').textContent.trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const quantity = 1;
        const stock = true;

        // Enviar al dataLayer
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'add_to_cart',
          ecommerce: {
            currency: 'USD',
            items: [{
              item_id: id,
              item_name: name,
              price: price,
              stock: stock,
              quantity: quantity,
              index: index + 1
            }]
          }
        });

        console.log("Evento add_to_cart enviado:", { id, name, price, stock, quantity, index });
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
});
