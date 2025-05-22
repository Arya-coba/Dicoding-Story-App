import { openDB } from 'idb';

const dbPromise = openDB('story-db', 1, {
  upgrade(db) {
    db.createObjectStore('stories', { keyPath: 'id' });
  },
});

export const saveStory = async (story) => (await dbPromise).put('stories', story);
export const getAllStories = async () => (await dbPromise).getAll('stories');
export const deleteStory = async (id) => (await dbPromise).delete('stories', id);
