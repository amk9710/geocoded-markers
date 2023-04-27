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

        // Create a new popup
        var popup = new mapboxgl.Popup()
            .setHTML('<h3>' + ev.result.place_name + '</h3><p>Coordinates: ' + lngLat[1] + ', ' + lngLat[0] + '</p>');

        // Bind the popup to the marker
        marker.setPopup(popup);

        // Push the marker to the array
        markers.push(marker);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'markers', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'markers', () => {
        map.getCanvas().style.cursor = '';
    });

    $('#marker-button').click(function () {
        // Create a bounding box that contains all markers
        const bounds = new mapboxgl.LngLatBounds();

        // Add each marker's coordinates to the bounding box
        markers.forEach(function (marker) {
            bounds.extend(marker.getLngLat());
        });

        // Zoom the map to the bounding box
        map.fitBounds(bounds, { padding: 50 });
    });

    if (markers.length == 2) {
        // Get the origin and destination coordinates
        var origin = markers[0].getLngLat().toArray();
        var destination = markers[1].getLngLat().toArray();
    
        // Construct the request URL
        var url = directionsEndpoint + origin[0] + ',' + origin[1] + ';' + destination[0] + ',' + destination[1] + '?steps=true&access_token=' + mapboxgl.accessToken;
    
        // Send the request to the Mapbox Directions API
        $.ajax({
          method: 'GET',
          url: url,
        }).done(function(data) {
          // Get the driving distance from the response
          var distance = data.routes[0].distance;
    
          // Display the driving distance on the page
          $('#driving-distance').text(distance);
        }).fail(function() {
          console.log('Error getting directions');
        });
      }
    });
