import StoriesAPI from "../../data/api";

class AddStoryPresenter {
  #view;
  #api;

  constructor({ view }) {
    this.#view = view;
    this.#api = StoriesAPI;
  }

async submitStory({ description, photo, lat, lon }) {
  try {
    if (!this.#api.checkAuth()) {
      alert("You must be logged in to submit a story.");
      window.location.hash = "#/login";
      return;
    }

    const response = await this.#api.addStory({ description, photo, lat, lon });

    if (response.error) {
      this.#view.onSubmitError(response.message || "Failed to submit story");
    } else {
      this.#view.onSubmitSuccess();
    }
  } catch (err) {
    if (err.message.includes("Unauthorized")) {
      alert("Session expired. Please login again.");
      window.location.hash = "#/login";
      return;
    }
    this.#view.onSubmitError(err.message || "Something went wrong. Try again.");
  }
}
}

export default AddStoryPresenter;
