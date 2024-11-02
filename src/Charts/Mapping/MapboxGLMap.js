import React, { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiamZlcm5hbmRlejg3IiwiYSI6ImNseXU4MzBxdDAwNXYya29uYm44eHM4Y3cifQ.1DMghCCCvQjx_0dOaL5nJg';

export default function MapMapbox(props) {

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [lng, setLng] = useState(-73.8748);
  const [lat, setLat] = useState(40.8536);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    // add geojson source to map
    map.current.on('load', () => {
      map.current.addSource('nyc', {
        type: 'geojson',
        data: props.data
      });

      map.current.addLayer({
        id: 'nyc-solid-line',
        source: 'nyc',
        type: 'line',
        layout: {},
        paint: {
          'line-color': 'gray',
        }
      });
    });

    // add nodes to map

  }, [lng, lat, zoom, props]);

  return ( 
    <div>
      <div className='sidebar'>
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );    
}