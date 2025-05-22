export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <a href="#main-info" class="skip-to-content">Skip to content</a>

        <h1 id="main-info" tabindex="0">About Dicoding Stories</h1>

        <article class="about-content">
          <p>
            Dicoding Stories is a place for community members to share their experiences and memorable moments related to Dicoding.
          </p>

          <section>
            <h2>Features</h2>
            <ul>
              <li>Discover inspiring stories from fellow Dicoding learners</li>
              <li>Upload and share your own story with a photo</li>
              <li>Attach your location to provide context</li>
              <li>Navigate through stories using an interactive map</li>
            </ul>
          </section>

          <section>
            <h2>How to Use</h2>
            <ol>
              <li>Create an account or continue as a guest</li>
              <li>Explore available stories on the homepage</li>
              <li>Click a story to view more details</li>
              <li>Tap the "+" icon to add your story</li>
              <li>Capture or select a photo</li>
              <li>Optionally, choose a location on the map</li>
              <li>Write a description and hit submit</li>
            </ol>
          </section>

          <p>
            We hope Dicoding Stories inspires and connects you with other learners through real-life experiences.
          </p>
        </article>
      </section>
    `;
  }
}
