const CACHE_NAME = "task-manager-v3";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/css/materialize.min.css",
  "/js/materialize.min.js",
  "/js/ui.js",
  "/img/task.png",
];

self.addEventListener("install", (event) => {
  console.log("Service worker: Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service worker: caching files");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("service Worker: Deleting old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      try{
        const networkResponse = await fetch(event.request); 
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, networkResponse.clone());  
        return networkResponse;

      }catch(error){
        console.error("Fetch Failed, returning offline page:", error);
      }
    })()
  );
});
