import StoriesAPI from "../../data/api";
import { saveStory } from "../../utils/db";

class HomePresenter {
  #view;
  #api;

  constructor({ view }) {
    this.#view = view;
    this.#api = StoriesAPI;
  }

  loadStories = async () => {
    try {
      // Cek autentikasi
      if (!this.#api.checkAuth()) {
        alert("You must be logged in to view stories.");
        window.location.hash = "#/login";
        return;
      }

      const { listStory } = await this.#api.getStories(1, 10, 1);
      this.#view.showStories(listStory);

      // ✅ Simpan semua story ke IndexedDB
      listStory.forEach((story) => {
        saveStory(story);
      });

    } catch (err) {
      if (err.message.includes("Unauthorized")) {
        alert("Session expired. Please login again.");
        window.location.hash = "#/login";
        return;
      }
      this.#view.showError(err.message || "Failed to load stories");
    }
  };
}

export default HomePresenter;
