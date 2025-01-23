import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import { updateLocationCoords, updatePermissionStatus } from "../redux/actions";

const LocationUpdater = () => {
  const dispatch = useDispatch();

  const permissionStatus = useSelector((state) => state.location.permissionStatus);
  const coords = useSelector((state) => state.location.coords);
  
  const intervalRef = useRef(null);

  const fetchAndDispatchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      dispatch(updatePermissionStatus(status));
      console.log("Permission updated:", status);

      if (status !== "granted") {
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
      });

      if (location?.coords) {
        dispatch(updateLocationCoords({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        }));
        console.log("Location updated.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      
    }
  };

  useEffect(() => {
    // Clear the interval if it exists
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const intervalTime = permissionStatus === "denied" || (coords.latitude === 0 && coords.longitude === 0) ? 11000 : 120000;
    intervalRef.current = setInterval(fetchAndDispatchLocation, intervalTime);

    fetchAndDispatchLocation();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch, permissionStatus, coords.latitude, coords.longitude]);

  return null;
};

export default LocationUpdater;
