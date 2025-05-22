import Auth from "../../utils/auth";
import LoginPresenter from "./login-presenter";

export default class LoginPage {
  constructor() {
    this.presenter = new LoginPresenter({
      view: this,
    });
  }

  async render() {
    return `
     <a href="#content" class="skip-to-content">Skip to content</a>
     <section class="container">
       <h1 id="content" tabindex="0">Login</h1>
        
       <form id="login-form" class="auth-form">
         <div class="form-group">
           <label for="email">Email</label>
           <input type="email" id="email" name="email" required>
         </div>
         
         <div class="form-group">
           <label for="password">Password</label>
           <input type="password" id="password" name="password" required>
         </div>
         
         <div class="form-actions">
           <button type="submit" id="login-button" class="submit-button">Login</button>
         </div>
         
         <p class="auth-link">Don't have an account? <a href="#/register">Register here</a></p>
       </form>
     </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector("#login-form");
    form.addEventListener("submit", this.handleLogin.bind(this));
  }

  handleLogin(event) {
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    this.toggleLoginButton(true);
    this.presenter.login({ email, password }); // ⬅️ gunakan presenter
  }

  onLoginSuccess() {
    alert("Login successful!");
    Auth._checkLoginStatus();
    window.location.hash = "#/";
    this.toggleLoginButton(false);
  }

  onLoginError(message) {
    alert(message || "An error occurred during login.");
    this.toggleLoginButton(false);
  }

  toggleLoginButton(disabled) {
    const loginButton = document.querySelector("#login-button");
    loginButton.disabled = disabled;
    loginButton.textContent = disabled ? "Logging in..." : "Login";
  }
}
