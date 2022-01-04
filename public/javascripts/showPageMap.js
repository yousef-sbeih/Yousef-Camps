mapboxgl.accessToken = mapToken;
console.log("this is camp ", campground);
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11", // stylesheet location

  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
  hash: true,
});
// const popup = new mapboxgl.Popup().setDOM("<h1>Hello World!</h1>");

// const marker = new mapboxgl.Marker()
//   .setLngLat([lng, lat])
//   .setPopup(popup)
//   .addTo(this.map);
// map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
  )
  .addTo(map);
