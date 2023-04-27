$(document).ready(function () {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW1rOTcxMCIsImEiOiJjbGc1cWRtNTIwNWl0M2VuNW9yZTJxYmJ2In0.BR49nDMsJOC3F0VxtVqT9Q';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-73.97, 40.76],
        zoom: 9
    });

    // Create a geocoder object to use in the search bar
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        placeholder: 'Search for an address',
        countries: 'us'
    });

    // Add the geocoder to the map
    
    $('#sidebar').append(geocoder.onAdd(map));


    const markers = [];


    // When the geocoder returns a result, add a marker to the map
    geocoder.on('result', function (ev) {
        // Get the coordinates of the search result
        const lngLat = ev.result.center;

        // Create a marker at the search result coordinates
        const marker = new mapboxgl.Marker()
            .setLngLat(lngLat)
            .addTo(map);
        // Push the marker to the array
        markers.push(marker);
    });

    
    $('#marker-button').click(function() {
        // Create a bounding box that contains all markers
        const bounds = new mapboxgl.LngLatBounds();

        // Add each marker's coordinates to the bounding box
        markers.forEach(function(marker) {
            bounds.extend(marker.getLngLat());
        });

        // Zoom the map to the bounding box
        map.fitBounds(bounds, { padding: 50 });
    });
});