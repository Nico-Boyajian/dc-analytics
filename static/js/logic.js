var map = L.map("map", {
  center: [38.9, -77.03],
  zoom: 11
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

var link = "static/data/Ward_from_2012.geojson";
function chooseColor(NAME) {
 switch (NAME) {
 case "Ward 1":
   return "yellow";
 case "Ward 2":
   return "red";
 case "Ward 3":
   return "orange";
 case "Ward 4":
   return "green";
 case "Ward 5":
   return "purple";
 case "Ward 6":
   return "blue";
 case "Ward 7":
   return "pink";
 default:
   return "black";
 }
}
d3.json(link, function(data) {
 L.geoJson(data, {
   style: function(Feature) {
     return {
       color: "white",
       fillColor: chooseColor(Feature.properties.NAME),
       fillOpacity: 0.5,
       weight: 1.5
     };
   }
 }).addTo(map);
});
