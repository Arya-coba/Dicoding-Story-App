import { getAllStories } from '../../utils/db.js';

const OfflinePage = {
  async render() {
    return `
      <h2>Offline Stories</h2>
      <div id="offline-stories"></div>
    `;
  },

  async afterRender() {
    const container = document.getElementById('offline-stories');
    const stories = await getAllStories();

    if (stories.length === 0) {
      container.innerHTML = '<p>Tidak ada story tersimpan.</p>';
      return;
    }

    stories.forEach((story) => {
      container.innerHTML += `
        <div class="story-card">
          <h3>${story.name}</h3>
          <p>${story.description}</p>
        </div>
      `;
    });
  },
};

export default OfflinePage;
