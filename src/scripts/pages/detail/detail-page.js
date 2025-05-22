import { showFormattedDate } from "../../utils/index";
import { parseActivePathname } from "../../routes/url-parser";
import MapUtils from "../../utils/map";

export default class DetailPage {
  async render() {
    return `
      <section class="container">
        <div class="skip-link">
          <a href="#content" class="skip-to-content">Skip to content</a>
        </div>
        <div id="story-detail" class="story-detail">
          <div class="loading">Loading story...</div>
        </div>
        <div class="story-actions">
          <a href="#/" class="back-button">Back to Stories</a>
        </div>
      </section>
    `;
  }

  async afterRender() {
  const { id: storyId } = parseActivePathname();
  console.log("Parsed storyId:", storyId); 

  if (!storyId) {
    this.onStoryDetailError("No story ID provided.");
    return;
  }

  this.presenter.loadDetail(storyId);
}

  onStoryDetailSuccess(story) {
    console.log("Story detail received:", story);

    if (!story || typeof story !== "object") {
    this.onStoryDetailError("Invalid story data.");
    return;
  }
    const container = document.querySelector("#story-detail");

    container.innerHTML = `
      <article>
        <h1 id="content" tabindex="0" class="story-title">${story.name}'s Story</h1>
        <p class="story-date">${showFormattedDate(story.createdAt)}</p>
        <img src="${story.photoUrl}" alt="Story image by ${story.name}" class="story-image detail-image" />
        <p class="story-description detail-description">${story.description}</p>
        ${this._createMapContainer(story)}
      </article>
    `;

if (story?.lat != null && story?.lon != null) {

      const mapEl = document.getElementById("detail-map");
      const map = MapUtils.initMap({
        container: mapEl,
        center: [story.lon, story.lat],
        zoom: 12,
      });

      MapUtils.addMarker({
        map,
        lng: story.lon,
        lat: story.lat,
        popupText: `<strong>${story.name}</strong><p>${story.description.slice(0, 100)}...</p>`,
      });
    }
  }

  onStoryDetailError(message) {
    const container = document.querySelector("#story-detail");
    container.innerHTML = `<div class="error-message">${message}</div>`;
  }

 _createMapContainer({ lat, lon, name }) {
  if (!lat || !lon) return ""; 

  return `<div id="detail-map" class="story-map detail-map" aria-label="Location map for ${name}'s story"></div>`;
}


}
