import nyc_3200_features from "./nyc_3200_features.geojson";

export const nyc_geo_data = () => {
  return nyc_3200_features;
}

export const color_breaks = () => {
  
  const alpha = 0.65;
  
  const colorBreaks = [
    { rgba: [255, 255, 255, 0], break: 0 },
    { rgba: [161, 217, 155, alpha], break: 25 },
    { rgba: [116, 196, 118, alpha], break: 90 },
    { rgba: [65, 171, 93, alpha], break: 150 },
    { rgba: [35, 139, 69, alpha], break: 300 },
    { rgba: [0, 90, 50, alpha], break: 850 }
  ];

  return colorBreaks;

}