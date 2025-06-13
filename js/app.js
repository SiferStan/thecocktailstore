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

  // ✅ view_item: al ver detalles del producto (si aplica)
  trackViewItem() {
    const isDetailPage = window.location.pathname.includes('product.html');
    if (!isDetailPage) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    const titleEl = document.querySelector('.product__title a');
    const priceEl = document.querySelector('.product__price');

    if (!titleEl || !priceEl) return;

    const name = titleEl.textContent.trim();
    const price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ''));
    const category = 'smartphones'; // O dinámico si lo tienes
    const stock = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'view_item',
      ecommerce: {
        items: [{
          item_id: id,
          item_name: name,
          price: price,
          item_category: category,
          stock: stock
        }]
      }
    });
  }

  // ✅ add_to_cart: al hacer clic en botón "Añadir al carrito"
  trackAddToCart() {
    document.querySelectorAll('.product__button').forEach((button, index) => {
      button.addEventListener('click', function () {
        const productContainer = button.closest('.product__content');
        const name = productContainer.querySelector('.product__title a').textContent.trim();
        const price = parseFloat(productContainer.querySelector('.product__price').textContent.replace(/[^0-9.]/g, ''));
        const id = button.dataset.id;
        const category = productContainer.dataset.category || 'smartphones';
        const stock = true;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'add_to_cart',
          ecommerce: {
            currency: 'USD',
            reference: 'pagina principal',
            items: [{
              item_id: id,
              item_name: name,
              price: price,
              item_category: category,
              stock: stock,
              quantity: 1,
              index: index + 1
            }]
          }
        });
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
});
