import {
  cacheDirectory,
  deleteAsync,
  readDirectoryAsync,
} from "expo-file-system";

export async function displayCameraCache() {
  const cache = await readDirectoryAsync(cacheDirectory);
  if (cache && "Camera" in cache) {
    const cameraCache = await readDirectoryAsync(cacheDirectory + "Camera/");
    console.log("Camera cache exists. Cache: ", cameraCache);
  } else {
    console.log("Camera cache does not exist. Cache: ", cache);
  }
}

export async function deleteCameraCache() {
  const cache = await readDirectoryAsync(cacheDirectory);
  if (cache && cache.includes("Camera")) {
    console.log("Camera cache exists : " + JSON.stringify(cache));
    try {
      await deleteAsync(cacheDirectory + "Camera/");
    } catch (e) {
      console.error(e);
    }
    console.log("Camera cache deleted");
  } else {
    console.log("Camera cache does not exist");
  }
}
