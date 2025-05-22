import RegisterPresenter from "./register-presenter";

export default class RegisterPage {
  async render() {
    return `
      <a href="#main-content" class="skip-to-content">Skip to content</a>
      <section class="container">
        <h1 id="main-content" tabindex="0">Register</h1>
        
        <form id="register-form" class="auth-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required minlength="8">
            <small class="form-helper">Password must be at least 8 characters</small>
          </div>
          
          <div class="form-actions">
            <button type="submit" id="register-button" class="submit-button">Register</button>
          </div>
          
          <p class="auth-link">Already have an account? <a href="#/login">Login here</a></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById("register-form");
    this.presenter = new RegisterPresenter(this); 
    form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  async handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    this.toggleRegisterButtonState(true);
    this.presenter.register({ name, email, password }); 
  }

  onSuccessRegister(message) {
    alert(message);
    window.location.hash = "#/login";
    this.toggleRegisterButtonState(false);
  }

  onFailedRegister(errorMessage) {
    alert(`Registration failed: ${errorMessage}`);
    this.toggleRegisterButtonState(false);
  }

  toggleRegisterButtonState(isDisabled) {
    const registerButton = document.getElementById("register-button");
    registerButton.disabled = isDisabled;
    registerButton.textContent = isDisabled ? "Registering..." : "Register";
  }
}
