import StoriesAPI from "../data/api";

const Auth = {
  init({ loginButton, logoutButton, registerButton }) {
    this._loginButton = loginButton;
    this._logoutButton = logoutButton;
    this._registerButton = registerButton;

    this._checkLoginStatus();
    this._attachEventListeners();
  },

  _checkLoginStatus() {
    const isLoggedIn = StoriesAPI.checkAuth(); // ini tidak async, cukup boolean

    if (isLoggedIn) {
      this._showLoggedInState();
    } else {
      this._showLoggedOutState();
    }
  },

  _showLoggedInState() {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || {};

      if (this._loginButton) this._loginButton.style.display = "none";
      if (this._registerButton) this._registerButton.style.display = "none";
      if (this._logoutButton) {
        this._logoutButton.style.display = "block";
        this._logoutButton.textContent = `Logout (${user.name || "User"})`;
      }
    } catch (error) {
      console.error("Error showing logged-in state:", error);
      this._showLoggedOutState();
    }
  },

  _showLoggedOutState() {
    if (this._loginButton) this._loginButton.style.display = "block";
    if (this._registerButton) this._registerButton.style.display = "block";
    if (this._logoutButton) {
      this._logoutButton.style.display = "none";
      this._logoutButton.textContent = "Logout"; // reset teks jika diperlukan
    }
  },

  _attachEventListeners() {
    if (this._logoutButton) {
      this._logoutButton.addEventListener("click", (event) => {
        event.preventDefault();
        this.logout();
      });
    }
  },

  logout() {
    try {
      StoriesAPI.logout();
      this._showLoggedOutState();
      window.location.hash = "#/";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },
};

export default Auth;
