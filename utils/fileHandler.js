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

export async function saveCaseToMemory(data, caseId) {
  await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "cases", {
    intermediates: true,
  });
  await FileSystem.writeAsStringAsync(
    FileSystem.documentDirectory + "cases/" + caseId + ".json",
    JSON.stringify(data),
    {
      encoding: FileSystem.EncodingType.UTF8,
    }
  );
  return FileSystem.documentDirectory + "cases/" + caseId + ".json";
}

export async function deleteCaseFromMemory(caseId) {
  await FileSystem.deleteAsync(
    FileSystem.documentDirectory + "cases/" + caseId + ".json"
  );
}

export async function deleteAll() {
  await FileSystem.deleteAsync(FileSystem.documentDirectory + "images");
  await FileSystem.deleteAsync(FileSystem.documentDirectory + "cases");
}
