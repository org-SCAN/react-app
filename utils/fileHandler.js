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

export async function deleteImageCase(caseData) {
  const images = caseData.images;
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    await deleteImageFromMemory(image);
  }
}


export async function openZipAndExtractIcons(zipPath) {
  try {
    const zipContent = await FileSystem.readAsStringAsync(zipPath, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const zip = new JSZip();
    const zipData = await zip.loadAsync(zipContent, { base64: true });
    const iconsFolder = FileSystem.documentDirectory + "icons/";
    await FileSystem.makeDirectoryAsync(iconsFolder, { intermediates: true });
    // Extract EACH ICON file
    for (const fileName of Object.keys(zipData.files)) {
      const file = zipData.files[fileName];
      // to do - trouver un standart pour les icons 
      if (fileName.match(/\.(png|jpg|jpeg|svg)$/i)) {
        const fileData = await file.async("base64"); 
        const filePath = iconsFolder + fileName;
        // Save the icon
        await FileSystem.writeAsStringAsync(filePath, fileData, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log(`Extracted icon: ${filePath}`);
      } else {
        console.log(`Skipped non-icon file: ${fileName}`);
      }
    }
    console.log("Icons extraction completed:", iconsFolder);
    return iconsFolder;
  } catch (error) {
    console.error("Error extracting icons from ZIP file:", error);
    throw error;
  }
}

export async function downloadZipFile(zipUrl) { 
  const destinationDir = FileSystem.documentDirectory + "zip"; 
  const destinationPath = destinationDir + "/icons.zip"; 
  try {
    await FileSystem.makeDirectoryAsync(destinationDir, { intermediates: true });
    console.log("Directory created or already exists:", destinationDir);
    console.log("Starting download...");
    const downloadResult = await FileSystem.downloadAsync(zipUrl, destinationPath);
    console.log("File downloaded to:", downloadResult.uri);
    
  } catch (error) {
    console.error("Failed to download ZIP file:", error);
  }
}