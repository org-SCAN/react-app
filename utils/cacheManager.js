import {
  cacheDirectory,
  deleteAsync,
  readDirectoryAsync,
} from "expo-file-system";

export async function displayCameraCache() {
  const cache = await readDirectoryAsync(cacheDirectory + "Camera/");
  if (cache) {
    if ("Camera" in cache) {
      console.log("Camera cache exists");
      console.log(cache);
    } else {
      console.log("Camera cache does not exist");
    }
  } else {
    console.log("Cache does not exist");
  }
}

export async function deleteCameraCache() {
  await deleteAsync(cacheDirectory + "Camera/");
  const cache = await readDirectoryAsync(cacheDirectory);
  if (cache) {
    if ("Camera" in cache) {
      throw new Error("Camera cache not deleted");
    } else {
      console.log("Camera cache deleted");
    }
  } else {
    console.log("Cache does not exist");
  }
}
