const cache = "my-site-cache-view1";
const dataCache = "data-cache-view1";

var cachedURLs = [
    "/",
    "/db.js",
    "/index.js",
    "/manifest.JSON",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
]

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(cache).then(function(cache){
            console.log("openedCache");
            return cache.addAll(cachedURLs);
        })
    )
})

self.addEventListener("fetch", function(event) {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(dataCache).then(function() {
                return fetch(event.request)
                .then(response => {
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone())
                    }
                    return response();
                })
                .catch(error => {
                    return cache.match(event.request)
                })
            })
            .catch(error => {
                console.log(error);
            })
        )
        return;
    }
    event.respondWith(
        fetch(event.request)
        .catch(function() {
            return caches.match(event.request).then(function(response) {
                if (response) {
                    return response;
                }
                else if (event.request.headers.get("Accept").includes("text/html")) {
                    return caches.match("/")
                }
            })
        })
    )
})