import * as FileSystem from "expo-file-system";
import JSZip from "jszip";

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

export async function deleteAll() {
  await FileSystem.deleteAsync(FileSystem.documentDirectory + "images").catch(
    (err) => {
      console.log(err);
    }
  );
  await FileSystem.deleteAsync(FileSystem.documentDirectory + "zips").catch(
    (err) => {
      console.log(err);
    }
  );
}

export async function createZip(caseData) {
  const zip = new JSZip();
  const images = caseData.images;
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const uri = FileSystem.documentDirectory + "images/" + image + ".jpg";
    const imageUri = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    zip.file(image + ".jpg", imageUri, { base64: true });
  }
  delete caseData.images;
  const caseJson = JSON.stringify(caseData);
  zip.file(caseData.id + ".json", caseJson);
  const zipContent = await zip.generateAsync({ type: "base64" });
  await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "zips", {
    intermediates: true,
  });
  await FileSystem.writeAsStringAsync(
    FileSystem.documentDirectory + "zips/" + caseData.id + ".zip",
    zipContent,
    {
      encoding: FileSystem.EncodingType.Base64,
    }
  );
  return FileSystem.documentDirectory + "zips/" + caseData.id + ".zip";
}

export async function deleteZip(caseId) {
  await FileSystem.deleteAsync(
    FileSystem.documentDirectory + "zips/" + caseId + ".zip"
  );
}
