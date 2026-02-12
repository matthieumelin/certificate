const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

interface Coords {
  lat: number;
  lng: number;
}

export const useGoogleGeocoding = () => {
  const getCoordsFromAddress = async (
    address: string,
  ): Promise<Coords | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_KEY}`,
      );

      const data = await response.json();

      if (data.status === "OK" && data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }

      return null;
    } catch (error) {
      console.error("Erreur de géocodage:", error);
      return null;
    }
  };

  const getCurrentPosition = (): Promise<Coords | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => resolve(null),
      );
    });
  };

  return { getCoordsFromAddress, getCurrentPosition };
};
