import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createZip } from './fileHandler';
import * as MediaLibrary from 'expo-media-library';


// IMPORTANT: Sur iOS, documentDirectory fonctionne pour iTunes File Sharing
// Sur Android, documentDirectory n'est PAS accessible via USB !
// Il faut utiliser le partage de fichiers à la place
const EXPORT_DIR = `${FileSystem.documentDirectory}TempExport/`;
const EXPORT_TIMESTAMP_KEY = '@temp_export_timestamp';
const EXPORT_DURATION = 30 * 60 * 1000; // 30 minutes
const EXTERNAL_EXPORT_URIS_KEY = '@temp_export_external_uris';


const { StorageAccessFramework } = FileSystem;

export const createTemporaryExport = async (cases, images, onProgress = null) => {
  try {
    console.log('🚀 Starting export...');
    console.log('Platform:', Platform.OS);
    console.log('Export directory:', EXPORT_DIR);
    console.log('documentDirectory:', FileSystem.documentDirectory);

    // Créer le dossier d'export
    const dirInfo = await FileSystem.getInfoAsync(EXPORT_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(EXPORT_DIR, { intermediates: true });
    }

    await cleanupExpiredExports();

    const timestamp = Date.now();
    const copiedFiles = [];
    
    // Créer les ZIPs et les copier IMMÉDIATEMENT
    for (let i = 0; i < cases.length; i++) {
      const caseData = cases[i];
      
      if (onProgress) {
        onProgress(i + 1, cases.length);
      }

      const caseImages = images.filter(img => 
        caseData.images && caseData.images.includes(img.id)
      );
      
      const data = {
        ...caseData,
        coordinates: caseImages.map(img => ({
          id: img.id,
          latitude: img.lat,
          longitude: img.lng,
        })),
      };

      // Créer le ZIP
      const zipPath = await createZip(data);
      console.log(`ZIP created for case ${i + 1}:`, zipPath);
      
      if (zipPath) {
        // Vérifier que le ZIP source existe
        const sourceInfo = await FileSystem.getInfoAsync(zipPath);
        console.log('Source ZIP exists:', sourceInfo.exists, 'Size:', sourceInfo.size);
        
        if (sourceInfo.exists && sourceInfo.size > 0) {
          // Copier avec un nom unique
          const fileName = `case_${caseData.tag || caseData.id}_${timestamp}.zip`;
          const destPath = `${EXPORT_DIR}${fileName}`;
          
          await FileSystem.copyAsync({
            from: zipPath,
            to: destPath,
          });
          
          // Vérifier que la copie a réussi
          const destInfo = await FileSystem.getInfoAsync(destPath);
          console.log('Destination exists:', destInfo.exists, 'Size:', destInfo.size);
          
          if (destInfo.exists) {
            copiedFiles.push(destPath);
          }
          
          // Supprimer le ZIP temporaire
          try {
            await FileSystem.deleteAsync(zipPath, { idempotent: true });
          } catch (err) {
            console.warn('Failed to delete temp zip:', err);
          }
        } else {
          console.warn('Source ZIP is empty or does not exist');
        }
      }
    }

    console.log(`✅ Export completed! ${copiedFiles.length} files created`);
    
    // Vérification finale
    const finalFiles = await listExportedFiles();
    const externalExportUris = [];

    console.log('Final files list:', finalFiles);


    await AsyncStorage.setItem(EXPORT_TIMESTAMP_KEY, timestamp.toString());

        if (Platform.OS === 'android' && copiedFiles.length > 0) {
      try {
        const perm = await StorageAccessFramework.requestDirectoryPermissionsAsync();
        
        if (perm.granted) {
          const baseUri = perm.directoryUri;
          console.log('Dossier sélectionné pour export USB :', baseUri);

          for (const filePath of copiedFiles) {
            const fileName = filePath.split('/').pop() || `export_${Date.now()}.zip`;

            console.log('Copie vers stockage externe :', fileName);

            const fileData = await FileSystem.readAsStringAsync(filePath, {
              encoding: FileSystem.EncodingType.Base64,
            });

            const newFileUri = await StorageAccessFramework.createFileAsync(
              baseUri,
              fileName,
              'application/zip'
            );

            await FileSystem.writeAsStringAsync(newFileUri, fileData, {
              encoding: FileSystem.EncodingType.Base64,
            });

            console.log('✅ Fichier exporté vers stockage partagé :', newFileUri);

            // 📝 On garde l'URI pour pouvoir le supprimer plus tard
            externalExportUris.push(newFileUri);
          }
        } else {
          console.log('Permission dossier refusée, export USB ignoré.');
        }
      } catch (err) {
        console.warn('Erreur export vers stockage externe (USB) :', err);
      }
    }

    // 🔹 Sauvegarder la liste des fichiers externes pour un nettoyage futur
    if (externalExportUris.length > 0) {
      await AsyncStorage.setItem(
        EXTERNAL_EXPORT_URIS_KEY,
        JSON.stringify(externalExportUris)
      );
    }

    // 🔼🔼🔼 FIN DU BLOC ANDROID / USB

    await AsyncStorage.setItem(EXPORT_TIMESTAMP_KEY, timestamp.toString());

    return {
      path: EXPORT_DIR,
      count: copiedFiles.length,
      expiresAt: timestamp + EXPORT_DURATION,
      timestamp,
      zipPaths: copiedFiles,
    };

    return {
      path: EXPORT_DIR,
      count: copiedFiles.length,
      expiresAt: timestamp + EXPORT_DURATION,
      timestamp,
      zipPaths: copiedFiles,
    };
  } catch (error) {
    console.error('Error creating temporary export:', error);
    throw error;
  }
};

export const listExportedFiles = async () => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(EXPORT_DIR);
    console.log('List files - dir exists:', dirInfo.exists);
    
    if (!dirInfo.exists) {
      return [];
    }
    
    const files = await FileSystem.readDirectoryAsync(EXPORT_DIR);
    console.log('Files found:', files);
    
    const fullPaths = files
      .filter(file => file.endsWith('.zip'))
      .map(file => `${EXPORT_DIR}${file}`);
    
    console.log('Full paths:', fullPaths);
    return fullPaths;
  } catch (error) {
    console.error('Error listing exported files:', error);
    return [];
  }
};

// Reste du code identique...
export const cleanupExpiredExports = async () => {
  try {
    const timestampStr = await AsyncStorage.getItem(EXPORT_TIMESTAMP_KEY);
    
    if (timestampStr) {
      const timestamp = parseInt(timestampStr, 10);
      const now = Date.now();
      
      if (now - timestamp > EXPORT_DURATION) {
        await deleteAllExports();
      }
    }
  } catch (error) {
    console.error('Error cleaning up exports:', error);
  }
};

export const deleteAllExports = async () => {
  try {
    // 1) Supprimer le dossier interne
    const dirInfo = await FileSystem.getInfoAsync(EXPORT_DIR);
    
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(EXPORT_DIR, { idempotent: true });
    }

    // 2) Supprimer les fichiers exportés sur stockage externe (USB)
    const externalUrisStr = await AsyncStorage.getItem(EXTERNAL_EXPORT_URIS_KEY);

    if (externalUrisStr) {
      try {
        const externalUris = JSON.parse(externalUrisStr);

        if (Array.isArray(externalUris)) {
          for (const uri of externalUris) {
            try {
              console.log('🗑 Suppression fichier externe :', uri);
              await StorageAccessFramework.deleteAsync(uri);
            } catch (err) {
              console.warn('Erreur lors de la suppression du fichier externe :', uri, err);
            }
          }
        }
      } catch (err) {
        console.warn('Erreur parsing EXTERNAL_EXPORT_URIS_KEY:', err);
      }

      // Nettoyer la clé une fois terminé
      await AsyncStorage.removeItem(EXTERNAL_EXPORT_URIS_KEY);
    }

    // 3) Nettoyer le timestamp
    await AsyncStorage.removeItem(EXPORT_TIMESTAMP_KEY);
  } catch (error) {
    console.error('Error deleting exports:', error);
    throw error;
  }
};


export const getExportStatus = async () => {
  try {
    const timestampStr = await AsyncStorage.getItem(EXPORT_TIMESTAMP_KEY);
    
    if (!timestampStr) {
      return { active: false, expiresAt: null, remainingTime: 0, files: [] };
    }

    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    const expiresAt = timestamp + EXPORT_DURATION;
    const remainingTime = Math.max(0, expiresAt - now);

    if (remainingTime === 0) {
      await cleanupExpiredExports();
      return { active: false, expiresAt: null, remainingTime: 0, files: [] };
    }

    const files = await listExportedFiles();

    return {
      active: files.length > 0,
      expiresAt,
      remainingTime,
      path: EXPORT_DIR,
      files,
    };
  } catch (error) {
    console.error('Error getting export status:', error);
    return { active: false, expiresAt: null, remainingTime: 0, files: [] };
  }
};

export const getRemainingTimeFormatted = (remainingTime) => {
  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};