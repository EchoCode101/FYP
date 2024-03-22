mapboxgl.accessToken = mapTokken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates) // listing geometry Coordinates
  .setPopup(
    new mapboxgl.Popup({
      offset: 25,
    }).setHTML(
      `<h4><b>${listing.title.toUpperCase()}</b></h4><p>Exact location will be provided after booking</p>`
    )
  )
  .addTo(map);
