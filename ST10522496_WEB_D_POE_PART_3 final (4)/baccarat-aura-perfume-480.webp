/* ==========================================================================
   Aura Luxe — map.js
   Interactive Leaflet map (OpenStreetMap tiles):
   studio marker, planned collection points, same-day delivery zone,
   layer toggles, and a location-based "how far am I?" feature.
   ========================================================================== */
(function () {
  'use strict';
  var mapEl = document.getElementById('map');
  if (!mapEl) return;
  var status = document.getElementById('mapStatus');
  var locateBtn = document.getElementById('locateBtn');

  var STUDIO = { lat: -29.8310, lng: 31.0220, name: 'Aura Luxe Studio', address: '45 Florida Road, Morningside, Durban' };
  var PICKUPS = [
    { lat: -29.7260, lng: 31.0660, name: 'Umhlanga collection point', note: 'Planned partner pickup location' },
    { lat: -29.8350, lng: 30.9320, name: 'Westville collection point', note: 'Planned partner pickup location' },
    { lat: -29.8587, lng: 31.0218, name: 'Durban Central collection point', note: 'Planned partner pickup location' }
  ];

  var largerLink = document.getElementById('largerMapLink');
  if (largerLink) largerLink.href = 'https://www.openstreetmap.org/?mlat=' + STUDIO.lat + '&mlon=' + STUDIO.lng + '#map=15/' + STUDIO.lat + '/' + STUDIO.lng;

  var dirLink = document.getElementById('directionsLink');
  if (dirLink) dirLink.href = 'https://www.google.com/maps/dir/?api=1&destination=' + STUDIO.lat + ',' + STUDIO.lng;

  /* Opened straight from a folder (file:///...): OpenStreetMap refuses tile requests that carry no
     website address, so show OpenStreetMap's own embedded map - the same map used in Part 2.
     On a real website (GitHub Pages / Live Server) the interactive Leaflet map below is used. */
  if (location.protocol === 'file:') {
    var frame = document.createElement('iframe');
    frame.src = 'https://www.openstreetmap.org/export/embed.html?bbox=30.3%2C-30.2%2C31.6%2C-29.45&layer=mapnik&marker=' + STUDIO.lat + '%2C' + STUDIO.lng;
    frame.title = 'Map showing the Aura Luxe studio in Durban';
    frame.loading = 'lazy';
    mapEl.replaceChildren(frame);
    if (locateBtn) locateBtn.hidden = true;
    if (status) status.textContent = 'Interactive layers and the distance finder appear on the published website.';
    return;
  }

  if (typeof L === 'undefined') {
    // Leaflet blocked or offline: keep the page useful
    mapEl.replaceChildren();
    var p = document.createElement('p');
    p.className = 'map-fallback';
    p.append('The interactive map could not load. ');
    var a = document.createElement('a');
    a.className = 'text-link';
    a.href = 'https://www.openstreetmap.org/?mlat=' + STUDIO.lat + '&mlon=' + STUDIO.lng + '#map=15/' + STUDIO.lat + '/' + STUDIO.lng;
    a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.textContent = 'Open our location on OpenStreetMap';
    p.append(a, '.');
    mapEl.append(p);
    if (locateBtn) locateBtn.disabled = true;
    return;
  }

  function pin(cls) {
    return L.divIcon({ className: '', html: '<div class="aura-pin ' + cls + '"></div>', iconSize: [26, 26], iconAnchor: [13, 24], popupAnchor: [0, -22] });
  }
  function popup(title, text) {
    var box = document.createElement('div');
    var h = document.createElement('strong'); h.textContent = title;
    var p = document.createElement('p'); p.textContent = text; p.style.margin = '0.25rem 0 0';
    box.append(h, p);
    return box;
  }

  // wide view of the Durban region (same look as the Part 2 map), zoom buttons top-right
  var map = L.map(mapEl, { scrollWheelZoom: false, zoomControl: false }).setView([STUDIO.lat, STUDIO.lng], 10);
  L.control.zoom({ position: 'topright' }).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '<a href="https://www.openstreetmap.org/fixthemap" target="_blank" rel="noopener noreferrer">Report a problem</a> | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors <span class="osm-heart">&hearts;</span> <a href="https://supporters.openstreetmap.foundation/donate/" target="_blank" rel="noopener noreferrer">Make a Donation</a>. <a href="https://osmfoundation.org/wiki/Terms_of_Use" target="_blank" rel="noopener noreferrer">Website and API terms</a>'
  }).addTo(map);
  map.attributionControl.setPrefix(false);

  var studioLayer = L.layerGroup([
    L.marker([STUDIO.lat, STUDIO.lng], { icon: pin(''), title: STUDIO.name, alt: STUDIO.name })
      .bindPopup(popup(STUDIO.name, STUDIO.address))
  ]).addTo(map);

  var pickupLayer = L.layerGroup(PICKUPS.map(function (s) {
    return L.marker([s.lat, s.lng], { icon: pin('pickup'), title: s.name, alt: s.name }).bindPopup(popup(s.name, s.note));
  })).addTo(map);

  var zoneLayer = L.layerGroup([
    L.circle([STUDIO.lat, STUDIO.lng], { radius: 15000, color: '#B8894B', weight: 2, fillColor: '#145A8A', fillOpacity: 0.08 })
      .bindPopup(popup('Durban same-day delivery zone', 'Orders inside this area are delivered same-day or next-day.'))
  ]).addTo(map);

  L.control.layers(null, {
    'Aura Luxe studio': studioLayer,
    'Collection points': pickupLayer,
    'Same-day delivery zone': zoneLayer
  }, { position: 'topleft', collapsed: true }).addTo(map);

  // let people zoom with the wheel only after they click the map (stops accidental page-scroll hijack)
  map.on('click', function () { map.scrollWheelZoom.enable(); });
  map.on('mouseout', function () { map.scrollWheelZoom.disable(); });

  /* ---------- location-based feature ---------- */
  var youLayer = null;
  if (locateBtn) {
    locateBtn.addEventListener('click', function () {
      if (!('geolocation' in navigator)) { status.textContent = 'Your browser does not support location lookup.'; return; }
      status.textContent = 'Finding your location\u2026';
      locateBtn.disabled = true;
      navigator.geolocation.getCurrentPosition(function (pos) {
        locateBtn.disabled = false;
        var me = [pos.coords.latitude, pos.coords.longitude];
        if (youLayer) map.removeLayer(youLayer);
        var km = map.distance(me, [STUDIO.lat, STUDIO.lng]) / 1000;
        youLayer = L.layerGroup([
          L.marker(me, { icon: pin('you'), title: 'Your location', alt: 'Your location' }).bindPopup(popup('You are here', km.toFixed(1) + ' km from our studio')),
          L.polyline([me, [STUDIO.lat, STUDIO.lng]], { color: '#145A8A', dashArray: '6 8', weight: 3 })
        ]).addTo(map);
        map.fitBounds([me, [STUDIO.lat, STUDIO.lng]], { padding: [40, 40] });
        status.textContent = 'You are about ' + km.toFixed(1) + ' km from our studio' +
          (km <= 15 ? ' \u2014 inside our Durban same-day delivery zone.' : '. Delivery to you takes 1\u20135 days (see our FAQ).');
      }, function () {
        locateBtn.disabled = false;
        status.textContent = 'We could not get your location. Please allow location access or use the directions link.';
      }, { timeout: 10000 });
    });
  }
})();
