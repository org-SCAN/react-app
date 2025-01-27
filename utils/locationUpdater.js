import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import { updateLocationCoords, updatePermissionStatus } from "../redux/actions";

const LocationUpdater = () => {
  const dispatch = useDispatch();

  const permissionStatus = useSelector((state) => state.location.permissionStatus);

  useEffect(() => {
    let locationSubscription = null;

    const startWatchingLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        dispatch(updatePermissionStatus(status));
        console.log("Permission updated:", status);

        if (status !== "granted") {
          console.warn("Location permission denied.");
          return;
        }

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            //distanceInterval: 20,
            timeInterval: 100,
          },
          (location) => {
            if (location?.coords) {
              dispatch(
                updateLocationCoords({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                })
              );
              console.log("Location updated:", location);
            }
          }
        );
      } catch (error) {
        console.error("Error watching location:", error);
      }
    };

    startWatchingLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
        console.log("Location watcher stopped.");
      }
    };
  }, [dispatch]);

  return null;
};

export default LocationUpdater;
