module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,woff2,json}'
  ],
  swDest: 'dist/sw.js',
  runtimeCaching: [{
    urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\/stories/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'stories-api',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 86400
      }
    }
  }]
};
