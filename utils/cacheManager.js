import {
  cacheDirectory,
  deleteAsync,
  readDirectoryAsync,
} from "expo-file-system";

export async function displayCameraCache() {
  const cache = await readDirectoryAsync(cacheDirectory);
  if (cache && "Camera" in cache) {
    console.log("Camera cache exists");
    const cameraCache = await readDirectoryAsync(cacheDirectory + "Camera/");
    console.log(cameraCache);
  } else {
    console.log("Camera cache does not exist");
  }
}

export async function deleteCameraCache() {
  const cache = await readDirectoryAsync(cacheDirectory);
  if (cache && "Camera" in cache) {
    console.log("Camera cache exists");
    console.log(cache);
    try {
      await deleteAsync(cacheDirectory + "Camera/");
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log("Camera cache does not exist");
  }
}
