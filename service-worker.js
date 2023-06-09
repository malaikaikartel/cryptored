var REQUIRED_CACHE = "unless-update-cache-v14-required";
var USEFUL_CACHE = "unless-update-cache-v14-useful";
var STATIC_CACHE = "unless-update-cache-v14-static";
var CHILD_CHUNK_REGEX = /child\-chunk\.(main\~[a-z0-9]+|[0-9]+)\.min.js/i;

// On install, cache some resource.
self.addEventListener("install", function(evt) {

    if(!navigator.onLine) {

        return true;
    }

    var not_urgent = Promise.allSettled([
        caches.open(USEFUL_CACHE).then(function (cache) {
            return cache.addAll([
                "/src/images/404-dark-2.svg",
                "/src/images/analytics.svg",
                "/src/images/account.svg",
                "/src/images/account-add.svg",
                "/src/images/hacker.svg",
                "/src/images/wallet-green.svg",
                "/src/images/world_blue.jpg",
                "/src/images/404-dark.svg",
                "/src/images/segment.svg",
                "/src/images/security.svg",
                "/src/images/share.svg",
                "/src/images/transfer.svg",
                "/src/images/wallet.svg",
                "/src/images/data.svg",
                "/src/images/logo-transparent.png",
                "/src/images/personal-finance.svg",
                "/src/images/statistics.svg",
                "/src/images/card.svg",
                "/src/images/favicon.ico",
                "/src/images/pig-coins.svg",
                "/src/images/pixelart_card.png",
                "/src/images/swap.svg",
                "/src/images/invest.svg",
                "/src/images/investment-data.svg",
                "/src/images/open.svg",
                "/src/images/trade.svg",
            ]);
        }),
        caches.open(REQUIRED_CACHE).then(function (cache) {
            return cache.addAll([
                "/child-chunk.0.min.js",
                "/child-chunk.1.min.js",
                "/child-chunk.2.min.js",
            ]);
        }),
        caches.open(STATIC_CACHE).then(function (cache) {
            return cache.addAll([
                "/src/sounds/sfx/md/alert_error-01.mp3",
                "/src/sounds/sfx/md/navigation_transition-left.mp3",
                "/src/sounds/sfx/md/alert_high-intensity.mp3",
                "/src/sounds/sfx/md/FullHorizonThrow.mp3",
                "/src/sounds/sfx/md/navigation_transition-right.mp3",
                "/src/sounds/sfx/md/PrometheusVertical2.mp3",
                "/src/sounds/sfx/md/hero_decorative-celebration-01.mp3",
                "/src/sounds/sfx/md/state-change_confirm-down.mp3",
                "/src/sounds/sfx/md/hero_decorative-celebration-02.mp3",
                "/src/sounds/sfx/md/state-change_confirm-up.mp3",
                "/src/sounds/sfx/md/hero_decorative-celebration-03.mp3",
                "/src/sounds/sfx/md/ETesla.mp3",
                "/src/sounds/sfx/md/ui_camera-shutter.mp3",
                "/src/sounds/sfx/md/navigation_backward-selection-minimal.mp3",
                "/src/sounds/sfx/md/ui_loading.mp3",
                "/src/sounds/sfx/md/navigation_backward-selection.mp3",
                "/src/sounds/sfx/md/ui_lock.mp3",
                "/src/sounds/sfx/md/navigation_forward-selection.mp3",
                "/src/sounds/sfx/md/ui_tap-variant-01.mp3",
                "/src/sounds/sfx/md/navigation_selection-complete-celebration.mp3",
                "/src/sounds/sfx/md/ui_unlock.mp3",
            ]);
        })
    ]);

    return evt.waitUntil(Promise.allSettled([
        caches.open(REQUIRED_CACHE).then(function (cache) {
            return cache.addAll([
                "/",
                "/manifest.json",
                "/src/fonts/NotoSans-Regular.woff2",
                "/src/fonts/SpecialElite-Regular.woff2",
                "/src/fonts/NotoSansMono-Regular.woff2",
                "/src/fonts/ShareTechMono-Regular.woff2",
                "/src/fonts/Saira-Regular.woff2",
                "/father-chunk.norris.min.js", // This is chunk norris, master of all chunk
                "/child-chunk.main~2df6c9b7.min.js",
                "/child-chunk.main~3a8581e8.min.js",
                "/child-chunk.main~3f764be9.min.js",
                "/child-chunk.main~7d359b94.min.js",
                "/child-chunk.main~9c5b28f6.min.js",
                "/child-chunk.main~9fa9b2b4.min.js",
                "/child-chunk.main~46e0dd6e.min.js",
                "/child-chunk.main~62ab6885.min.js",
                "/child-chunk.main~70aabc29.min.js",
                "/child-chunk.main~203e0718.min.js",
                "/child-chunk.main~253ae210.min.js",
                "/child-chunk.main~1861cc0b.min.js",
                "/child-chunk.main~7274e1de.min.js",
                "/child-chunk.main~748942c6.min.js",
                "/child-chunk.main~af9f4ef7.min.js",
                "/child-chunk.main~b5906859.min.js",
                "/child-chunk.main~bd3a21fe.min.js",
                "/child-chunk.main~c2a50b6c.min.js",
                "/child-chunk.main~cefe50a8.min.js",
                "/child-chunk.main~dff13f8a.min.js",
                "/child-chunk.main~ec8c427e.min.js",
                "/child-chunk.main~f9ca8911.min.js",
                "/child-chunk.main~fd731fb0.min.js",
            ]);
        }),
        caches.open(USEFUL_CACHE).then(function (cache) {
            return cache.addAll([
                "/src/images/manifest/icon-white.png",
                "/src/images/favicon.ico",
                "/src/images/fun.svg",
                "/src/images/rocket_boy.svg",
                "/src/images/background.svg",
                "/src/images/logo-transparent.png",
                "/src/images/heroes.svg",
                "/src/images/404.svg",
            ]);
        })
    ]));
});

self.addEventListener("fetch", function(event) {

    const url = event.request.url;

    if(event.request.mode === "navigate") {

        event.respondWith(
            caches.open(REQUIRED_CACHE).then(function (cache) {

                return cache.match("/");
            })
        );

    }else if((url.includes(".png") || url.includes(".jpg") || url.includes(".jpeg") || url.includes(".gif") || url.includes(".ico")) && event.request.mode === "same-origin") {

        // Serve cached image if doesn't fail
        event.respondWith(
            caches.open(USEFUL_CACHE).then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    return (
                        response ||
                        fetch(event.request).then(function (response) { // Fetch, clone, and serve
                            cache.put(event.request, response.clone()).then(() => {return response});
                        })
                    );
                });
            }),
        );

    }else if(url.includes(".png") || url.includes(".jpg") || url.includes(".jpeg") || url.includes(".gif") || url.includes(".ico")) {

        // Serve cached image if doesn't fail
        event.respondWith(
            caches.open(STATIC_CACHE).then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    return (
                        response ||
                        fetch(event.request).then(function (response) { // Fetch, clone, and serve
                            cache.put(event.request, response.clone()).then(() => {return response});
                        })
                    );
                });
            }),
        );


    }else if((url.includes(".wav") || url.includes(".mp3")) && event.request.mode === "same-origin") {

        // Serve cached sound if doesn't fail
        event.respondWith(
            caches.open(STATIC_CACHE).then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    return (
                        response ||
                        fetch(event.request).then(function (response) { // Fetch, clone, and serve
                            cache.put(event.request, response.clone()).then(() => {return response});
                        })
                    );
                });
            }),
        );

    }else if(url.includes("father-chunk.norris.min.js") && event.request.mode === "same-origin") {

        event.respondWith(
            caches.open(REQUIRED_CACHE).then(function (cache) {
                return cache.match("/father-chunk.norris.min.js").then(function (response) {
                    return (
                        response ||
                        fetch(event.request).then(function (response) { // Fetch, clone, and serve
                            cache.put("/father-chunk.norris.min.js", response.clone()).then(() => {return response});
                        })
                    );
                });
            })
        );

    }else if((url.match(CHILD_CHUNK_REGEX) || []).length >= 2 && event.request.mode === "same-origin") {

        const middle_name = url.match(CHILD_CHUNK_REGEX)[1];
        event.respondWith(
            caches.open(REQUIRED_CACHE).then(function (cache) {
                return cache.match(`/child-chunk.${middle_name}.min.js`).then(function (response) {
                    return (
                        response ||
                        fetch(event.request).then(function (response) { // Fetch, clone, and serve
                            cache.put(`/child-chunk.${middle_name}.min.js`, response.clone()).then(() => {return response});
                        })
                    );
                });
            })
        );

    }else {
        Promise.race([
            caches.open(REQUIRED_CACHE).then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    if(response) { return response}
                });
            }),
            caches.open(USEFUL_CACHE).then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    if(response) { return response }
                });
            }),
            caches.open(STATIC_CACHE).then(function (cache) {
                return cache.match(event.request).then(function (response) {

                    return (
                        response ||
                        fetch(event.request).then(function (response) { // Fetch and serve

                            if(response) { return response }
                        })
                    );

                })
            })
        ]).then(function(response){return response})
    }
});

self.addEventListener("activate", function(event) {

    return event.waitUntil(Promise.allSettled([
            caches.keys().then(keys => Promise.allSettled(
                keys.map(key => {
                    if (key !== REQUIRED_CACHE && key !== STATIC_CACHE && key !== USEFUL_CACHE) {
                        return caches.delete(key);
                    }
                })
            ))
        ])
    );
});