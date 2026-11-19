"use strict";

/* ==========================================================
   ITMD 361 - Project 3
   Mustafa Aziz
   Loaded from the head of every page with the defer attribute.
   No inline event handlers: everything is attached here.
   ========================================================== */

var MAPS_KEY = "AIzaSyBM1F-BpX660SBK3-Vw9O9f7AEvTAIH8rI";
var MY_EMAIL = "aziz.mustafa@hawk.illinoistech.edu";

var CHICAGO = { lat: 41.8827, lng: -87.6233 };
var START_ZOOM = 12;

/* Favorite stops from the hobby page, listed north to south */
var STOPS = [
  {
    name: "North Avenue Beach",
    position: { lat: 41.9170, lng: -87.6265 },
    note: "A wide beach with a great view of the skyline."
  },
  {
    name: "Navy Pier",
    position: { lat: 41.8917, lng: -87.6039 },
    note: "A busy pier with a Ferris wheel and lake views."
  },
  {
    name: "Millennium Park",
    position: { lat: 41.8826, lng: -87.6226 },
    note: "Home of Cloud Gate, also called the Bean."
  },
  {
    name: "Museum Campus",
    position: { lat: 41.8663, lng: -87.6168 },
    note: "A lakeside park with three major museums."
  },
  {
    name: "Promontory Point",
    position: { lat: 41.7940, lng: -87.5800 },
    note: "A quiet park with a skyline view from the south."
  }
];

var SCHOOL = {
  name: "Illinois Institute of Technology",
  position: { lat: 41.8348, lng: -87.6270 },
  note: "My school and home base."
};

var map = null;
var infoWindow = null;
var userMarkers = [];

/* Highlight the nav link for the page that is open */
function highlightCurrentPage() {
  var links = document.querySelectorAll("nav a");
  var current = window.location.pathname.split("/").pop();

  if (current === "") {
    current = "index.html";
  }

  links.forEach(function (link) {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* Questions button: shows the required two-line alert */
function setupQuestionsButton() {
  var button = document.getElementById("questions-btn");

  if (!button) {
    return;
  }

  button.addEventListener("click", function () {
    alert("If you have questions, contact me at:\n" + MY_EMAIL);
  });
}

function showMapStatus(message) {
  var status = document.getElementById("map-status");

  if (status) {
    status.textContent = message;
  }
}

/* Feature 1: a marker with an info window for each stop */
function addStopMarkers() {
  infoWindow = new google.maps.InfoWindow();

  STOPS.concat([SCHOOL]).forEach(function (stop) {
    var marker = new google.maps.Marker({
      position: stop.position,
      map: map,
      title: stop.name
    });

    if (stop === SCHOOL) {
      marker.setIcon("https://maps.google.com/mapfiles/ms/icons/blue-dot.png");
    }

    marker.addListener("click", function () {
      var box = document.createElement("div");
      var heading = document.createElement("strong");
      var text = document.createElement("p");

      heading.textContent = stop.name;
      text.textContent = stop.note;
      box.appendChild(heading);
      box.appendChild(text);

      infoWindow.setContent(box);
      infoWindow.open(map, marker);
    });
  });
}

/* Feature 2: a line that connects the stops into a ride route */
function addRouteLine() {
  var path = STOPS.map(function (stop) {
    return stop.position;
  });

  new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: "#a6192e",
    strokeOpacity: 0.9,
    strokeWeight: 4,
    map: map
  });
}

/* Feature 3: click the map to drop a numbered marker of your own */
function setupClickToAddMarker() {
  map.addListener("click", function (event) {
    var marker = new google.maps.Marker({
      position: event.latLng,
      map: map,
      label: String(userMarkers.length + 1),
      title: "My marker " + (userMarkers.length + 1)
    });

    userMarkers.push(marker);
  });
}

function setupMapButtons() {
  var resetButton = document.getElementById("reset-btn");
  var clearButton = document.getElementById("clear-btn");

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      map.setCenter(CHICAGO);
      map.setZoom(START_ZOOM);
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      userMarkers.forEach(function (marker) {
        marker.setMap(null);
      });
      userMarkers = [];
    });
  }
}

/* Google calls initMap once the Maps API has loaded */
function initMap() {
  var mapElement = document.getElementById("map");

  if (!mapElement) {
    return;
  }

  map = new google.maps.Map(mapElement, {
    center: CHICAGO,
    zoom: START_ZOOM,
    mapTypeControl: true
  });

  addStopMarkers();
  addRouteLine();
  setupClickToAddMarker();
  setupMapButtons();
  showMapStatus("Map loaded. Click a marker or the map.");
}

/* Load the Maps API from here so initMap always exists first */
function loadMapApi() {
  var script;

  if (!document.getElementById("map")) {
    return;
  }

  window.initMap = initMap;
  window.gm_authFailure = function () {
    showMapStatus("The map could not load because Google rejected the API key.");
  };

  script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=" + MAPS_KEY +
    "&callback=initMap";
  script.async = true;
  script.onerror = function () {
    showMapStatus("The map could not load. Check your internet connection.");
  };
  document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", function () {
  highlightCurrentPage();
  setupQuestionsButton();
  loadMapApi();
});
