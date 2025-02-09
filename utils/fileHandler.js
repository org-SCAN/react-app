import * as FileSystem from "expo-file-system";
import JSZip from "jszip";
import { useEffect } from "react";

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

export async function deleteIcons() {
  await FileSystem.deleteAsync(FileSystem.documentDirectory + "icons").catch(
    (err) => {
      console.log(err);
    }
  );
}

export async function deleteZipIcons() {
  await FileSystem.deleteAsync(FileSystem.documentDirectory + "zip").catch(
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

export async function openZipAndExtractIcons(zipPath) {
  try {
    const zipContent = await FileSystem.readAsStringAsync(zipPath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const zip = new JSZip();
    const zipData = await zip.loadAsync(zipContent, { base64: true });

    const iconsFolder = FileSystem.documentDirectory + "icons/";
    await FileSystem.makeDirectoryAsync(iconsFolder, { intermediates: true });

    const expectedIcons = ["woman", "man", "unknown", "child", "adult", "old"];
    const extractedIcons = {};

    for (const fileName of Object.keys(zipData.files)) {
      const file = zipData.files[fileName];

      const match = fileName.match(/([^/]+)(?=\.\w+$)/);
      if (match && /\.(png|jpg|jpeg)$/i.test(fileName)) {
        const baseName = match[0]; 
        const extension = ".png"; 

        if (expectedIcons.includes(baseName)) {
          const fileData = await file.async("base64");
          const filePath = `${iconsFolder}${baseName}${extension}`;

          await FileSystem.writeAsStringAsync(filePath, fileData, {
            encoding: FileSystem.EncodingType.Base64,
          });

          extractedIcons[baseName] = filePath;
          console.log(`Extracted icon: ${baseName}`);
        } else {
          console.log(`Skipped non-matching icon: ${fileName}`);
        }
      }
    }

    // Log missing icons
    const missingIcons = expectedIcons.filter((icon) => !extractedIcons[icon]);
    if (missingIcons.length > 0) {
      console.warn("Missing icons:", missingIcons);
    } else {
      console.log("All expected icons were extracted successfully.");
    }

    console.log("Icons extraction completed:", iconsFolder);
    return [iconsFolder, extractedIcons, missingIcons];
  } catch (error) {
    console.error("Error extracting icons from ZIP file:", error);
    throw error;
  }
}

export async function openZipAndExtractTypes(zipPath) {
  try {
    const zipContent = await FileSystem.readAsStringAsync(zipPath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const zip = new JSZip();
    const zipData = await zip.loadAsync(zipContent, { base64: true });

    const labelsFileName = "types.json"; 
    let labels = [];

    if (zipData.files[labelsFileName]) {
      const fileData = await zipData.files[labelsFileName].async("text");
      labels = JSON.parse(fileData); 
    } else {
      console.warn(`No types file (${labelsFileName}) found in the ZIP.`);
      return [] ; 
    }

    const formattedTypes = labels.map(label => ({
      label: label,
      value: label.toLowerCase().replace(/\s+/g, "_").replace(/[^\w_]/g, "")
    }));

    console.log("Extracted types:", formattedTypes);
    return formattedTypes;

  } catch (error) {
    console.error("Error extracting types from ZIP file:", error);
    throw error;
  }
}

export async function downloadZipFile(zipUrl, zipType) { 
  const destinationDir = FileSystem.documentDirectory + "zip"; 
  const destinationPath = destinationDir + zipType; 

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

export async function deleteImageCase(caseData) {
  const images = caseData.images;
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    await deleteImageFromMemory(image);
  }
}