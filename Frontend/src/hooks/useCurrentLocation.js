// --- FILE: src/hooks/useCurrentLocation.js ---
import { useState, useCallback, useEffect } from "react";

const DHAKA_CENTER = [23.8103, 90.4125];

export default function useCurrentLocation({ enableAuto = true, fallback = DHAKA_CENTER } = {}) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    if (!navigator.geolocation) {
      setError(new Error("Geolocation not supported"));
      setLocation(fallback);
      setLoading(false);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude]);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLocation(fallback);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60 * 1000,
        timeout: 10 * 1000,
      }
    );
  }, [fallback]);

  useEffect(() => {
    if (enableAuto) refresh();
  }, [enableAuto, refresh]);

  return { location, loading, error, refresh };
}
