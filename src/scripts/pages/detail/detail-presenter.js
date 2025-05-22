import StoriesAPI from "../../data/api";

class DetailPresenter {
  constructor(view) {
    this.view = view;
  }

  async loadDetail(storyId) {
    try {
      if (!StoriesAPI.checkAuth()) {
        alert("You must be logged in to view story details.");
        window.location.hash = "#/login";
        return;
      }

      const response = await StoriesAPI.getStoryDetail(storyId);

      console.log("API Response:", response); 
      
      if (response.error || !response.story) {
        this.view.onStoryDetailError(response.message || "Failed to load story details.");
        return;
      }

      this.view.onStoryDetailSuccess(response.story);
    } catch (error) {
      console.error("Error fetching story detail:", error);

      if (error.message.includes("Unauthorized")) {
        alert("Session expired. Please login again.");
        window.location.hash = "#/login";
        return;
      }

      this.view.onStoryDetailError(error.message || "Gagal mengambil detail cerita.");
    }
  }
}

export default DetailPresenter;
