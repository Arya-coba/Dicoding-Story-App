import StoriesAPI from "../../data/api";

class LoginPresenter {
  #view;
  #api;

  constructor({ view }) {
    this.#view = view;
    this.#api = StoriesAPI;
  }

  async login({ email, password }) {
    try {
      // Validasi sederhana (opsional)
      if (!email || !password) {
        this.#view.onLoginError("Email dan password harus diisi.");
        return;
      }

      const response = await this.#api.login({ email, password });

      if (response.error) {
        this.#view.onLoginError(response.message || "Login gagal.");
        return;
      }

      this.#view.onLoginSuccess();
      // Redirect ke halaman home atau halaman sebelumnya (opsional)
      window.location.hash = "#/";
    } catch (error) {
      this.#view.onLoginError(error.message || "Terjadi kesalahan. Silakan coba lagi.");
    }
  }
}

export default LoginPresenter;
