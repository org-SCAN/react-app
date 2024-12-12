import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomAlert = ({ title, message, onConfirm, onCancel, visible, buttonText = "OK" }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onConfirm} // Gérer la fermeture si l'utilisateur appuie sur le fond
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>{title}</Text>
          <Text style={styles.alertMessage}>{message}</Text>
          
          {/* Si on a une fonction onCancel, on affiche les deux boutons */}
          <View style={styles.buttonContainer}>
            {onCancel && (
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Pour s'assurer que la fenêtre modale est au-dessus des autres composants
  },
  alertBox: {
    width: 280,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Pour Android, pour l'ombrage de la boîte
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', // Centrer le titre
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center', // Centrer le message
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row', // Disposition horizontale des boutons
    justifyContent: 'space-between', // Espacement entre les boutons
    width: '100%', // Faire en sorte que les boutons prennent toute la largeur disponible
  },
  button: {
    backgroundColor: 'rgba(184, 29, 42, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1, // Les boutons vont prendre une largeur égale
    marginHorizontal: 5, // Ajouter un petit espacement entre les boutons
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Couleur pour le bouton "Annuler"
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Centrer le texte dans le bouton
  },
});

export default CustomAlert;