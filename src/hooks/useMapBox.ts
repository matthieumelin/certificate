interface Coords {
  latitude: number | null;
  longitude: number | null;
}

const MAPBOX_KEY = import.meta.env.VITE_MAPBOX_KEY;

export const useMapBox = () => {
  const getCoordsFromAddress = async (
    address: string
  ): Promise<Coords | null> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${MAPBOX_KEY}&limit=1`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        return { latitude, longitude };
      }

      return null;
    } catch (error) {
      console.error("Erreur de géocodage:", error);
      return null;
    }
  };

  return { getCoordsFromAddress }; 
};

// export const getCoords = (): Coords | null => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((position) => {
//       const { latitude, longitude } = position.coords;
//       return { latitude, longitude };
//     });
//   }
//   return null;
// };
