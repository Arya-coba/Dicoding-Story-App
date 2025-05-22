import CONFIG from "../config";

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  GUEST_STORY: `${CONFIG.BASE_URL}/stories/guest`,
};

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.token) {
    return null;
  }
  return user.token;
};

const handleUnauthorized = () => {
  localStorage.removeItem("user");
  window.location.hash = "#/login";
  throw new Error("Unauthorized. Redirecting to login...");
};

const StoriesAPI = {
  async register({ name, email, password }) {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    return await response.json();
  },

  async login({ email, password }) {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const responseJson = await response.json();

    if (!responseJson.error) {
      // Simpan user dan token di localStorage
      localStorage.setItem("user", JSON.stringify(responseJson.loginResult));
    }

    return responseJson;
  },

  async getStories(page = 1, size = 10, location = 0) {
    const token = getAuthToken();
    if (!token) handleUnauthorized();

    const response = await fetch(
      `${ENDPOINTS.STORIES}?page=${page}&size=${size}&location=${location}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) handleUnauthorized();

    return await response.json();
  },

  async getGuestStories(page = 1, size = 10, location = 0) {
    const response = await fetch(
      `${ENDPOINTS.STORIES}?page=${page}&size=${size}&location=${location}`
    );

    return await response.json();
  },

  async getStoryDetail(id) {
    const token = getAuthToken();
    if (!token) handleUnauthorized();

    const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) handleUnauthorized();

    return await response.json();
  },

  async addStory({ description, photo, lat, lon }) {
    const token = getAuthToken();
    if (!token) handleUnauthorized();

    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);

    if (lat !== undefined && lon !== undefined) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const response = await fetch(ENDPOINTS.STORIES, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 401) handleUnauthorized();

    return await response.json();
  },

  async addGuestStory({ description, photo, lat, lon }) {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);

    if (lat !== undefined && lon !== undefined) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const response = await fetch(ENDPOINTS.GUEST_STORY, {
      method: "POST",
      body: formData,
    });

    return await response.json();
  },

  checkAuth() {
    const user = JSON.parse(localStorage.getItem("user"));
    return !!(user && user.token);
  },

  logout() {
    localStorage.removeItem("user");
    window.location.hash = "#/login";
  },
};

export default StoriesAPI;
