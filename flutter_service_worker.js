'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {".git/COMMIT_EDITMSG": "ab03dfa3ac9d14ccfd2d9ebe97591b52",
".git/config": "eae61bea2d4319eed13258bf2ce29e18",
".git/description": "a0a7c3fff21f2aea3cfa1d0316dd816c",
".git/FETCH_HEAD": "b73d5c95fa1229beb94fbdfde007d688",
".git/HEAD": "cf7dd3ce51958c5f13fece957cc417fb",
".git/hooks/applypatch-msg.sample": "ce562e08d8098926a3862fc6e7905199",
".git/hooks/commit-msg.sample": "579a3c1e12a1e74a98169175fb913012",
".git/hooks/fsmonitor-watchman.sample": "a0b2633a2c8e97501610bd3f73da66fc",
".git/hooks/post-update.sample": "2b7ea5cee3c49ff53d41e00785eb974c",
".git/hooks/pre-applypatch.sample": "054f9ffb8bfe04a599751cc757226dda",
".git/hooks/pre-commit.sample": "305eadbbcd6f6d2567e033ad12aabbc4",
".git/hooks/pre-merge-commit.sample": "39cb268e2a85d436b9eb6f47614c3cbc",
".git/hooks/pre-push.sample": "2c642152299a94e05ea26eae11993b13",
".git/hooks/pre-rebase.sample": "56e45f2bcbc8226d2b4200f7c46371bf",
".git/hooks/pre-receive.sample": "2ad18ec82c20af7b5926ed9cea6aeedd",
".git/hooks/prepare-commit-msg.sample": "2b5c047bdb474555e1787db32b2d2fc5",
".git/hooks/push-to-checkout.sample": "c7ab00c7784efeadad3ae9b228d4b4db",
".git/hooks/update.sample": "647ae13c682f7827c22f5fc08a03674e",
".git/index": "4db2408dd5f7f549cc5d7a2f7ffb8572",
".git/info/exclude": "036208b4a1ab4a235d75c181e685e5a3",
".git/logs/HEAD": "b8c75c04dd10eacf6903826e6ca8bc17",
".git/logs/refs/heads/main": "392a24ead8b73330a52a0d4ffb7a413a",
".git/logs/refs/remotes/origin/main": "3389cfa0eb3b8ccda2064916d79d7ada",
".git/objects/03/c531a7a4eadfbb97e5434401927ee31890cf33": "fe6b24f60048b7f218835d95c2c650ae",
".git/objects/06/5a156ad876ae75d08bca0aabc8c1e01f285abb": "1338ac20d12542d14345378e2fe2be26",
".git/objects/07/0df94ed2b537591afdb0fc2cf07ce67a37ec2a": "fcea7b7982f1956c1290441db038d60f",
".git/objects/0b/85bcdb86bf9e9f9fda81b13cec9c9349d47d77": "77cbf4b6cc88e2471afd14a98ef2e0ed",
".git/objects/0e/e8a9efda2bb4624d74154eb4d1806a4939cd1a": "803abe1333fc172780159476d6c96796",
".git/objects/10/9504d30b55f29c034d4101c6161b9e5b50d8c8": "ed4037eb379fb0bb1d230e7688f1e94f",
".git/objects/15/5cf66f0e30cc639d78b8d8379d06b80904aef0": "3a9f43f46140ae1665d31cd0668a744e",
".git/objects/1d/384f3748038966a5c7316223edf120dd5894dd": "a8d542276aa823dfefb8d26439e1077a",
".git/objects/1e/bf993c04c08e17a0122730f8d7ce6e139c8bad": "eeb4f0d71f24758335fe1753273ad6c2",
".git/objects/1f/686edd1465272558af328ca43cb7189a0059e6": "5e83820f6d3e5392693d45bc239b2b61",
".git/objects/20/d87d117c31184ea7e3abbeb48bbc95a9f4424f": "c1dda5ef7e85559f8651cb33da3bce85",
".git/objects/22/0e19b7758d234d8e06f6fa5c333d33dbfeb786": "0fe23feb603488d9adcc2ac673b2cc3e",
".git/objects/27/4a3dcf06635ab2c5b9a20e3df2e535d599fbbe": "419814a82e5a3d7fcf0fbc3b234105a2",
".git/objects/29/3e0a4ce34ef8a1899442b86b307756905c5ede": "b508cb8a27e9f139f0556ab598c75ed5",
".git/objects/29/ad5a747ef24dbc49189f1fa2e2d0db3bdde000": "5417ff06781dd7abae6b15f355e9431b",
".git/objects/2c/12f865bbfb46e9cdc0f3ca0a74b4a7a31be91d": "3c215b98eb630fe5ce24af5f2d0185d7",
".git/objects/2d/0471ef9f12c9641643e7de6ebf25c440812b41": "d92fd35a211d5e9c566342a07818e99e",
".git/objects/33/dd74e29a8c6cb2a0952b102c4fdd191635bbd2": "b6e7bf897026d7e5b02e61dc112f6a38",
".git/objects/35/91af41948adc8001f3586d76b91181311953fc": "c91d33b29071dcff3b2b3385383761cb",
".git/objects/37/7580cbf691d03aea79c63a3a251b1b48ac01f1": "c196d282a50e3c372b4445c6b8868297",
".git/objects/3b/b0860a0981211a1ab11fced3e6dad7e9bc1834": "3f00fdcdb1bb283f5ce8fd548f00af7b",
".git/objects/40/32bba2fa8788f2833d022763cb9115acd39bb3": "dbf632765de7946293ec1ce3bbf26aeb",
".git/objects/40/bb8c6cdb0b2a152060ec7d316599c9191caccb": "decadd27bbcf723b32b986e2e56aa533",
".git/objects/42/6aba986ba5ebbdd924815b993ece336d64d287": "9122b3538f963bf2ed5771343de07587",
".git/objects/45/27bc0ecdbd49f6f2a23e89606fb53c4a12f433": "fd2e6a89f14661a91437def6191e9faa",
".git/objects/45/abc76bb93c0f1378bd99a25b010e90e8f1148b": "34c585ca2b2932d8de92c039874cac6a",
".git/objects/47/01e5b2a9b240409aa1e7c049ba0019dfc07df1": "14fb37fbc20a0a2de727fd93b5f52923",
".git/objects/51/34e6402246228fb7f58ce8fe76727a61d99a62": "6b5e5b48febe40daec7062aecdc3b39f",
".git/objects/57/684b081b5c98e8b56566a76a163d0846d6690e": "5728af6f4d4aadb3976e0be84dc47919",
".git/objects/57/b8c6f6abe7ec33c6f639f9df6bd66bdefc001e": "944a6e1c715d3af1aaa45842fa67ee4c",
".git/objects/59/44ff45cf63fee543db0ef499319a73483fe5c8": "5c95b676289f67f1061b3ea9b498d703",
".git/objects/5f/5725d407380b8e9612df280a0aa6171b91242a": "dddd882cd16c5ba28db8db5dd3d32942",
".git/objects/61/04caa894919d81db84b95b4c0732e012ac821a": "46756775666ec584c7b32c347f4f68ad",
".git/objects/62/a01d6826913d9efa140d2e9f4bc0f13918e607": "44ba2af6a4f05cb190463143170ae010",
".git/objects/6a/157e885e346d1a827a128390a92cdec11ecbce": "de43c6d9e3564fdcbc5112c50f23a93e",
".git/objects/6a/64dc77c78e7a6808aa68180b4fdee52f0d5a35": "bdddeed19125153bac55a86253b70e18",
".git/objects/6a/8735f2d55017ad3d7486f93e52fc95f3d382ac": "0cd911461617190ecaecd019583daf21",
".git/objects/6f/b13b336e8ca1efdcea7af51d63229488a3b03b": "a9c87f5473e9b17e1867fb342ba5f31b",
".git/objects/70/010cc4761157d9d7cc2d082cf342e63fe1190a": "baf21d1dacab382149ee93266543ff40",
".git/objects/71/dcf970ff0c85196b4e6b21ad86299c1663b688": "333df5fdb5b7bb21aa0aba893e8b5add",
".git/objects/76/43787e0c3a2ca65ab2c005efe097cc20034a64": "2d93ec62593bebe80ec153a0fc32d0da",
".git/objects/77/9fec76b4653296b238205da1c35ac61e6ee6ca": "12b7e4937084aaf3b645a5687cf7dd85",
".git/objects/7c/039a418657cab70d2be3515bb61eec52c6dc4b": "49333d108f0c30fef552159401fcc81b",
".git/objects/83/d5b35e7f8834785241c1295292c1715827a00d": "9ca4f0b3db991b8b321b3383845d0b59",
".git/objects/88/cfd48dff1169879ba46840804b412fe02fefd6": "e42aaae6a4cbfbc9f6326f1fa9e3380c",
".git/objects/8a/aa46ac1ae21512746f852a42ba87e4165dfdd1": "1d8820d345e38b30de033aa4b5a23e7b",
".git/objects/8e/7f4b338840099949781ab85496d7a67fae46f1": "7f2803c236e9e7d95ef6ed16a3a2bd13",
".git/objects/90/1fcfce11aae83915f4a5b67b6eb5c020f6da55": "c54e5626112da8de83dcde9c2e4e7b37",
".git/objects/93/3eac963996f3e51a3046b331b412186ae3157e": "177c3d2966c57cc19370caf7b8352a7f",
".git/objects/94/12f87b4843b96d43fb147dd0cb48429d19372e": "390d90e4a172ffa316a8275bc91ea983",
".git/objects/ad/001b8646a800cd6e0b4dd03e558789e7fff1d4": "8447aa0a545f910455196a27e526d454",
".git/objects/ae/1dc825c9a0fb5cb2c29ae8a73959b82e2faf1b": "57a8ee7c25325e3a119ade43e9833d76",
".git/objects/ae/37803d1933c3979fd1b939ff61cc667b0b70dc": "f5c08c98e82ebd9034dbd78b64a292fa",
".git/objects/ae/4f671561ff5733045a43728e965f6dd4a7cdaa": "c6451350d0b3a64c708a697ef0dc4fde",
".git/objects/ae/5615efd66eeb36ce23a18106b3ae01bd321a1b": "2e08a26cfa03ec19c04b986a8142c1e9",
".git/objects/b2/2fdb2d1fa6a3bced274617d58f6ab432bb0d8b": "1b405e4dfab487f51d41422d52600614",
".git/objects/b4/9729de695670aea813a41aa561ff90a3b4b538": "02c9a13ea3d9e7e92fb457f76f80a03a",
".git/objects/b7/49bfef07473333cf1dd31e9eed89862a5d52aa": "36b4020dca303986cad10924774fb5dc",
".git/objects/b9/2a0d854da9a8f73216c4a0ef07a0f0a44e4373": "f62d1eb7f51165e2a6d2ef1921f976f3",
".git/objects/bb/ac29f5ef7a40bf14c0901bc1457724156bc0de": "1393f20f0610cabefe2d4f45865b0f54",
".git/objects/c0/15b8f9f81d7621e9bd66bbdd28f8d4c1472caa": "a88615906906b81e24dfa10302810233",
".git/objects/c4/631b6cf83be59fd5ba5dc9abca0c58b942b16e": "4e0ef9709a8f2136a1f766c6ecd267bb",
".git/objects/c5/644a935edbca485311f134618486d2cc887eb0": "dc9a9e199302d1e05574b17932c1325e",
".git/objects/c7/7663172ca915a99a594ca17d06f527db05657d": "6335b074b18eb4ebe51f3a2c609a6ecc",
".git/objects/d3/efa7fd80d9d345a1ad0aaa2e690c38f65f4d4e": "610858a6464fa97567f7cce3b11d9508",
".git/objects/d6/6a813bef9aa7c4a2e3d90ecc9559eed3766a74": "e2b2d8c88bb1fead99afa86f92d94493",
".git/objects/d6/9c56691fbdb0b7efa65097c7cc1edac12a6d3e": "868ce37a3a78b0606713733248a2f579",
".git/objects/e4/3ed88e7e6756736bebd5dc261b4613090d5808": "9eff722c85dc46e780aed68dcf7a3693",
".git/objects/e6/d868bc68c614019227513b28905823248e8384": "f058cc3a0849cdf12b6ca5e7a3e925bb",
".git/objects/ea/78b35b82a776a3405ed270fced4647308c6d99": "d2c58b213f12925e466e6041d69f1262",
".git/objects/eb/9b4d76e525556d5d89141648c724331630325d": "37c0954235cbe27c4d93e74fe9a578ef",
".git/objects/ef/204c1b65c2bed16ab38e4bc68872ad15f7809b": "5dad72a2a9d3c0c9af45045227668d82",
".git/objects/f2/2fe6d9a8d58ed7aefc862209567752e394c2f0": "686ac747b143b9221919b788552654b2",
".git/objects/f3/fea00b16ef5a6d0d029c167f62d8b463dcb3ec": "a2c5bf4cf500806e680b49a89cd244b4",
".git/objects/f4/21c585df9f1bba93f1bf2ded0630d9bfd0a8bf": "d5665e0bcc590e95b559a2721cd46674",
".git/objects/f7/d598a82461515c6ad9c6e46608acd5ed2f0d76": "935bd28c2468209d199f1588887734e3",
".git/objects/fc/10e849f17dd8b96dfbc974caca978fd22bee7a": "2f1b2a7d00b6789a9223702ad627d928",
".git/objects/ff/f9418bc4f93e158bc543dca29b0d96c50f817f": "b156cad116e617425ca0289392a00c8c",
".git/ORIG_HEAD": "b054da4ec45675ba18f41410e6190f9b",
".git/refs/heads/main": "b054da4ec45675ba18f41410e6190f9b",
".git/refs/remotes/origin/main": "b054da4ec45675ba18f41410e6190f9b",
"assets/AssetManifest.bin": "b74d0183770749a635b657e438be2139",
"assets/AssetManifest.json": "9b0e99055b351f0243c0c8e619d00d10",
"assets/FontManifest.json": "fe2b2b5aa1822c2d63f495098b690e3a",
"assets/fonts/Kanit-Italic.ttf": "681198abb02b3001bcd92b9437894450",
"assets/fonts/Kanit-Regular.ttf": "ba95370355da928d1c09da6a0a49a1d6",
"assets/fonts/MaterialIcons-Regular.otf": "62ec8220af1fb03e1c20cfa38781e17e",
"assets/NOTICES": "3e1405cfd2eb84feb16301fa428c572e",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/packages/fluttertoast/assets/toastify.js": "56e2c9cedd97f10e7e5f1cebd85d53e3",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "8bc452d41ca4db07361eddfeadab0600",
"/": "8bc452d41ca4db07361eddfeadab0600",
"main.dart.js": "188cb48c1054ece238f8f25e5c406003",
"manifest.json": "f6c0bd6dd978ad6c81ba5605d2bbdb28",
"version.json": "40a7fe2d5ce0ad09526e93cf1a673dc8"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
