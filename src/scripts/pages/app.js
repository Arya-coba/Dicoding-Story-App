import routes from "../routes/routes.js";
import { getActiveRoute } from "../routes/url-parser.js";
import Auth from "../utils/auth.js";
import CameraUtils from "../utils/camera.js";
import { subscribeUser, unsubscribeUser } from "../utils/push-notification.js";

class App {
  #content;
  #drawerButton;
  #navigationDrawer;
  #navList;

  constructor({ navigationDrawer, drawerButton, content }) {
    window.addEventListener("hashchange", () => this.renderPage());
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#navList = document.getElementById("nav-list");

    this.#initializeDrawer();
    this.#initializeAuth();
    this.#setupNotificationButtons(); 
    this.#registerServiceWorker(); 
  }

  #registerServiceWorker() { 
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.error('SW failed:', err));
    }
  }

  #setupNotificationButtons() {
    const subscribeButton = document.getElementById('subscribe-notification');
    const unsubscribeButton = document.getElementById('unsubscribe-notification');

    if (subscribeButton) {
      subscribeButton.addEventListener('click', async () => {
        try {
          await subscribeUser();
          alert("Berhasil berlangganan notifikasi!");
        } catch (e) {
          alert("Gagal mengaktifkan notifikasi. Silakan coba lagi atau cek konsol.");
          console.error("Error subscribing:", e);
        }
      });
    }

    if (unsubscribeButton) {
      unsubscribeButton.addEventListener('click', async () => {
        try {
          await unsubscribeUser();
          alert("Berhasil berhenti berlangganan notifikasi.");
        } catch (e) {
          alert("Gagal berhenti langganan. Silakan coba lagi atau cek konsol.");
          console.error("Error unsubscribing:", e);
        }
      });
    }
  }

  #initializeDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }
      this.#handleLinkClick(event);
    });
  }

  #handleLinkClick(event) {
    this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
      if (link.contains(event.target)) {
        this.#navigationDrawer.classList.remove("open");
      }
    });
  }

  #initializeAuth() {
    this.#navList.innerHTML = `
      <li><a href="#/">Beranda</a></li>
      <li><a href="#/add">Tambah Cerita</a></li>
      <li><a href="#/about">Tentang</a></li>
    `;

    const authNav = this.#createAuthNav();
    const authLi = document.createElement("li");
    authLi.appendChild(authNav);
    this.#navList.appendChild(authLi);

    Auth.init({
      loginButton: authNav.querySelector("#login-button"),
      logoutButton: authNav.querySelector("#logout-button"),
      registerButton: authNav.querySelector("#register-button"),
    });

  }

  #createAuthNav() {
    const authNav = document.createElement("div");
    authNav.className = "auth-nav";

    const loginButton = this.#createAuthButton("login", "Login", "#/login");
    const registerButton = this.#createAuthButton("register", "Register", "#/register");
    const logoutButton = this.#createAuthButton("logout", "Logout", "#", true);

    authNav.appendChild(loginButton);
    authNav.appendChild(registerButton);
    authNav.appendChild(logoutButton);

    return authNav;
  }

  #createAuthButton(id, text, href, isLogout = false) {
    const button = document.createElement("a");
    button.href = href;
    button.textContent = text;
    button.id = `${id}-button`;
    button.className = "auth-button";
    if (isLogout) {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        Auth.logout();
        window.location.hash = "#/login";
      });
    }
    return button;
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (!page) {
      this.#content.innerHTML = `
        <div class="container">
          <h1>Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      `;
      return;
    }

    if (document.startViewTransition) {
      const transition = document.startViewTransition(async () => {
        CameraUtils.clean?.();
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });
      await transition.finished;
    } else {
      CameraUtils.clean?.();
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }
  }
}

export default App;