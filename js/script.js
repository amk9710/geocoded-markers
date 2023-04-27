$(document).ready(function() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW1rOTcxMCIsImEiOiJjbGc1cWRtNTIwNWl0M2VuNW9yZTJxYmJ2In0.BR49nDMsJOC3F0VxtVqT9Q';
    const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-79.4512, 43.6568],
        zoom: 13
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
    map.addControl(geocoder, 'top-left');

    // When the geocoder returns a result, add a marker to the map
    geocoder.on('result', function(ev) {
        // Get the coordinates of the search result
        const lngLat = ev.result.center;

        // Create a marker at the search result coordinates
        const marker = new mapboxgl.Marker()
            .setLngLat(lngLat)
            .addTo(map);

        // Remove the geocoder from the map
        map.removeControl(geocoder);

        // Prompt the user for a new address
        const newAddress = prompt('Enter a new address:');

        // If the user entered a new address, add a geocoder for it
        if (newAddress) {
            const newGeocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                marker: false,
                placeholder: 'Search for an address',
                countries: 'us'
            });
            map.addControl(newGeocoder, 'top-left');
            newGeocoder.query(newAddress);
        }
    });
});
