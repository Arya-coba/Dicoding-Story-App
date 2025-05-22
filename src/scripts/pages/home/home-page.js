import HomePresenter from "./home-presenter";
import { showFormattedDate } from "../../utils/index";
import MapUtils from "../../utils/map";
 
export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter({ view: this });
  }
 
  async render() {
    return `
      <section class="container">
        <a href="#main-content" class="skip-to-content">Skip to content</a>
        <h1 id="main-content" tabindex="0">Dicoding Story</h1>
        <div id="stories-wrapper" class="stories-container">
          <div class="loading">Loading stories...</div>
        </div>
      </section>
    `;
  }
 
  async afterRender() {
    this.storiesWrapper = document.querySelector("#stories-wrapper");
    this.presenter.loadStories();
  }
 
  showStories(stories = []) {
    if (stories.length === 0) {
      return this._renderMessage("No stories available", "empty-message");
    }
 
    this._renderStoryList(stories);
  }
 
  showError(message) {
    this._renderMessage(message, "error-message");
  }
 
  _renderMessage(text, className) {
    this.storiesWrapper.innerHTML = `<div class="${className}">${text}</div>`;
  }
 
  _renderStoryList(stories) {
    const storyCards = stories.map((story) => this._createStoryCard(story)).join("");
    this.storiesWrapper.innerHTML = storyCards;
    this._initializeMaps(stories);
  }
 
  _createStoryCard(story) {
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.name)}&background=random`;
    const mapHTML = story.lat && story.lon
      ? `<div id="map-${story.id}" class="story-map" aria-label="Map for ${story.name}'s story"></div>`
      : "";
 
    return `
      <article class="story-item">
        <div class="story-header">
          <img class="profile-pic" src="${avatarUrl}" alt="Profile picture of ${story.name}">
          <div class="story-meta">
            <h2><a href="#/detail/${story.id}" class="story-title">${story.name}</a></h2>
            <p class="story-date">${showFormattedDate(story.createdAt)}</p>
          </div>
        </div>
        <img src="${story.photoUrl}" alt="Story image from ${story.name}" class="story-image">
        <p class="story-description">${story.description}</p>
        ${mapHTML}
        <a href="#/detail/${story.id}" class="read-more">Read more</a>
      </article>
    `;
  }
 
_initializeMaps(stories) {
  stories.forEach((story) => {
    if (
      story && 
      typeof story.lat === "number" && 
      typeof story.lon === "number"
    ) {
      const mapElement = document.getElementById(`map-${story.id}`);
      if (!mapElement) return;
 
      const map = MapUtils.initMap({
        container: mapElement,
        center: [story.lat, story.lon],
        zoom: 10,
      });
 
      MapUtils.addMarker({
        map,
        lng: story.lon,
        lat: story.lat,
        popupText: `<strong>${story.name}</strong><p>${story.description.slice(0, 100)}...</p>`,
      });
    }
  });
}
}