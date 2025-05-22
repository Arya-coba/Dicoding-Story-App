import StoriesAPI from "../../data/api";

class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  async register({ name, email, password }) {
    try {
      if (!name || !email || !password) {
        this.view.onFailedRegister("Name, email, and password are required.");
        return;
      }

      const response = await StoriesAPI.register({ name, email, password });

      if (response.error) {
        this.view.onFailedRegister(response.message || "Registration failed.");
      } else {
        this.view.onSuccessRegister("Registration successful! Please login with your new account.");
        window.location.hash = "#/login";
      }
    } catch (error) {
      this.view.onFailedRegister(error.message || "Failed to register. Please try again later.");
    }
  }
}

export default RegisterPresenter;
