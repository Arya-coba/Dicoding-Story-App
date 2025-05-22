import CameraUtils from "../../utils/camera";
import MapUtils from "../../utils/map";
import AddStoryPresenter from "./add-story-presenter";

export default class AddStoryPage {
  constructor() {
    this.presenter = new AddStoryPresenter({ view: this });
  }

  async render() {
    return `
      <section class="container">
        <a href="#story-form" class="skip-to-content">Skip to content</a>

        <h1 id="story-form" tabindex="0">Add a Story</h1>

        <form id="story-form-element" class="add-story-form">
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" required></textarea>
          </div>

          <div class="form-group">
            <label>Photo</label>
            <div class="camera-container">
              <video id="camera" autoplay></video>
              <canvas id="canvas" class="photo-canvas"></canvas>
              <div class="camera-controls">
                <button type="button" id="start-camera">Start</button>
                <button type="button" id="take-photo" style="display: none;">Capture</button>
                <button type="button" id="reset-camera" style="display: none;">Reset</button>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Location</label>
            <p>Click on the map to choose location</p>
            <div id="map" class="location-map"></div>
            <div>
              <span>Selected: </span><span id="location-info">None</span>
              <button type="button" id="clear-location">Reset</button>
            </div>
          </div>

          <button type="submit" id="submit-story">Submit Story</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const cameraElements = {
      videoElement: document.getElementById("camera"),
      canvas: document.getElementById("canvas"),
      startButton: document.getElementById("start-camera"),
      captureButton: document.getElementById("take-photo"),
      resetButton: document.getElementById("reset-camera"),
    };

    CameraUtils.init(cameraElements);

    const mapContainer = document.getElementById("map");
    const locationInfo = document.getElementById("location-info");
    const resetLocation = document.getElementById("clear-location");

    this.lat = undefined;
    this.lon = undefined;
    this.marker = undefined;

    this.map = MapUtils.initMap({
      container: mapContainer,
      center: [0, 0],
      zoom: 1,
      onClickCallback: (lng, lt) => {
        this.lat = lt;
        this.lon = lng;

        locationInfo.textContent = `Lat: ${lt.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
        if (this.marker) this.marker.remove();
        this.marker = MapUtils.addMarker({ map: this.map, lat: lt, lng, popupText: "Selected location" });
      },
    });

    resetLocation.addEventListener("click", () => {
      if (this.marker) this.marker.remove();
      this.lat = this.lon = undefined;
      locationInfo.textContent = "None";
    });

    document.getElementById("story-form-element").addEventListener("submit", this.handleSubmit.bind(this));
  }

  async handleSubmit(e) {
    e.preventDefault();

    const description = document.getElementById("description").value.trim();
    const photo = CameraUtils.getPhotoData();
    this.submitButton = document.getElementById("submit-story");

    if (!description) return alert("Please write a description.");
    if (!photo) return alert("Please capture a photo.");

    this.toggleSubmitButton(true);

const payload = { description, photo };

if (this.lat !== undefined && this.lon !== undefined) {
  payload.lat = this.lat;
  payload.lon = this.lon;
}

this.presenter.submitStory(payload);

  }

  toggleSubmitButton(disabled) {
    this.submitButton.disabled = disabled;
    this.submitButton.textContent = disabled ? "Submitting..." : "Submit Story";
  }

  onSubmitSuccess() {
    alert("Story submitted successfully!");
    CameraUtils.clean();
    window.location.hash = "#/";
    this._focusMainContent();
    this.toggleSubmitButton(false);
  }

  onSubmitError(message) {
    alert(message);
    this.toggleSubmitButton(false);
  }

  _focusMainContent() {
    setTimeout(() => {
      const main = document.getElementById("story-form");
      if (main) {
        main.setAttribute("tabindex", "-1");
        main.focus();
      }
    }, 200);
  }
}
