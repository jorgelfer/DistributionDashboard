import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { geoTransform, geoPath} from "d3-geo";
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiamZlcm5hbmRlejg3IiwiYSI6ImNseXU4MzBxdDAwNXYya29uYm44eHM4Y3cifQ.1DMghCCCvQjx_0dOaL5nJg';

export default function MapMapbox(props) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

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
  
  
    // // Clean up on unmount
    // return () => map.current.remove();
  }, []);

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