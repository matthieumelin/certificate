const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

interface Coords {
  lat: number;
  lng: number;
}

export const useGoogleGeocoding = () => {
  const getCoordsFromAddress = async (
    address: string,
  ): Promise<Coords | null> => {
    if (!address) {
      console.error("❌ Adresse vide");
      return null;
    }

    if (!GOOGLE_MAPS_KEY) {
      console.error("❌ Clé API Google Maps manquante (VITE_GOOGLE_MAPS_KEY)");
      return null;
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      } else {
        console.error("❌ Géocodage échoué:", {
          status: data.status,
          error_message: data.error_message,
          address: address,
        });

        if (data.status === "REQUEST_DENIED") {
          console.error("🔑 API refusée. Vérifiez:");
          console.error(
            "   1. Que l'API Geocoding est activée dans Google Cloud Console",
          );
          console.error("   2. Que votre clé API a les bonnes permissions");
          console.error("   3. Que les restrictions de domaine sont correctes");
        } else if (data.status === "ZERO_RESULTS") {
          console.error("📍 Aucun résultat trouvé pour cette adresse");
        } else if (data.status === "OVER_QUERY_LIMIT") {
          console.error("⚠️ Limite de requêtes dépassée");
        }

        return null;
      }
    } catch (error) {
      console.error("❌ Erreur de géocodage:", error);
      return null;
    }
  };

  const getCurrentPosition = (): Promise<Coords | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.error("❌ Géolocalisation non supportée");
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(coords);
        },
        (error) => {
          console.error("❌ Erreur géolocalisation:", error.message);
          resolve(null);
        },
      );
    });
  };

  return { getCoordsFromAddress, getCurrentPosition };
};
