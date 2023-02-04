import * as FileSystem from "expo-file-system";

export async function saveImageToMemory(data, imageId) {
  await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "images", {
    intermediates: true,
  });
  await FileSystem.writeAsStringAsync(
    FileSystem.documentDirectory + "images/" + imageId + ".jpg",
    data,
    {
      encoding: FileSystem.EncodingType.Base64,
    }
  );
  return FileSystem.documentDirectory + "images/" + imageId + ".jpg";
}

export async function deleteImageFromMemory(imageId) {
  await FileSystem.deleteAsync(
    FileSystem.documentDirectory + "images/" + imageId + ".jpg"
  );
}
