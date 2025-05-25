import "../styles/styles.css";
import "leaflet/dist/leaflet.css";
import App from "./pages/app";
import { subscribeUser, unsubscribeUser } from './utils/push-notification.js';

document.addEventListener('DOMContentLoaded', () => {
  const subscribeBtn = document.getElementById('subscribe-notification');
  const unsubscribeBtn = document.getElementById('unsubscribe-notification');

  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', async () => {
      await subscribeUser();
      alert('Notifikasi berhasil diaktifkan!');
    });
  }

  if (unsubscribeBtn) {
    unsubscribeBtn.addEventListener('click', async () => {
      await unsubscribeUser();
      alert('Notifikasi berhasil dinonaktifkan!');
    });
  }
});

async function initializeApp() {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  await app.renderPage();
  setupHashChangeHandler(app);
  setupSkipToContent();
}

function setupHashChangeHandler(app) {
  window.addEventListener("hashchange", async () => {
    const focusMainContent = () => {
      const mainContent = document.querySelector("#main-content");
      if (mainContent) {
        mainContent.setAttribute("tabindex", "-1");
        mainContent.focus();
      }
    };

    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        await app.renderPage();
        focusMainContent();
      });
    } else {
      await app.renderPage();
      focusMainContent();
    }
  });
}

function setupSkipToContent() {
  const skipLink = document.querySelector(".skip-to-content");
  const mainContent = document.querySelector("#main-content");

  if (!skipLink || !mainContent) return;

  skipLink.addEventListener("click", (event) => {
    event.preventDefault();
    mainContent.setAttribute("tabindex", "-1");
    mainContent.focus();
    mainContent.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  skipLink.addEventListener("blur", () => {
    skipLink.setAttribute("tabindex", "-1");
  });

  if (window.location.hash === "#main-content") {
    mainContent.setAttribute("tabindex", "-1");
    mainContent.focus();
    mainContent.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

document.addEventListener("DOMContentLoaded", initializeApp);
