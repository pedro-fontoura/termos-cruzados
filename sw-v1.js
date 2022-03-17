
const CACHE_NAME =  "termos-v1";

const APP_SHELL_FILES = [
	"./",
	"./index.html",
	"./termos.css",
	"./termos.js",
	"./author.txt",
	"./dictionary/wordlist-FILTERED-5-final.txt",
	"./fonts/termos.woff2",
	"./icons/cached_black_24dp.svg",
	"./icons/heart_broken_black_24dp.svg",
	"./icons/chevron_left_black_24dp.svg",
	"./icons/info_black_24dp.svg",
	"./icons/delete_outline_black_24dp.svg",
	"./icons/leaderboard_black_24dp.svg",
	"./icons/done_black_24dp.svg",
	"./icons/play_circle_black_24dp.svg",
	"./icons/error_outline_black_24dp.svg",
	"./icons/question_mark_black_24dp.svg",
	"./icons/fact_check_black_24dp.svg",
	"./icons/settings_black_24dp.svg",
	"./icons/favorite_black_24dp.svg",
	"./images/favicon.ico",
	"./images/icon-512.png",
	"./libs/lz-string.min.js",
	"./sounds/ElectArcShrtCirc.mp3",
	"./sounds/Quick-Fart.mp3",
	"./sounds/fx-102.mp3",
	"./sounds/prmlim-long.mp3",
	"./sounds/tim-kahn.mp3"
];

self.addEventListener(
	"install",
	( evt ) => {
		console.log( "[Service Worker] Install" );
		evt.waitUntil(
			(
				async () => {
					const cache = await caches.open( CACHE_NAME );
					console.log( "[Service Worker] Caching app shell" );
					await cache.addAll( APP_SHELL_FILES );
				}
			)()
		);
	}
);

self.addEventListener(
	"activate",
	( evt ) => {
		console.log( "[Service Worker] Activate" );
	}
);

self.addEventListener(
	"fetch",
	( evt ) => {
		evt.respondWith(
			(
				async () => {
					console.log( "[Service Worker] Fetching resource: " + ${evt.request.url );
					const RESPONSE_CACHE = await caches.match( evt.request );
					if ( RESPONSE_CACHE ) {
						return RESPONSE_CACHE;
					}
					
					console.warn(
						"[Service Worker] Fetching LIVE resource: " + evt.request.url
					);
					
					const RESPONSE_NET = await fetch( evt.request );
					const CACHE = await caches.open( CACHE_NAME );
					console.log(
						"[Service Worker] Caching NEW resource: " + evt.request.url
					);
					CACHE.put( evt.request, RESPONSE_NET.clone() );
					return RESPONSE_NET;
				}
			)()
		);
	}
);
