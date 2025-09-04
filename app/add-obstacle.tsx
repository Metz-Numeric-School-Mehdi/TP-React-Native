import LocationPicker from "@/components/LocationPicker";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StorageService } from "@/services/storageService";
import { Obstacle } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddObstacleScreen() {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  /**
   * Handle image selection
   */
  const selectImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission requise",
          "Permission d'accès à la galerie photos requise."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image:", error);
      Alert.alert("Erreur", "Impossible de sélectionner l'image");
    }
  };

  /**
   * Handle camera capture
   */
  const takePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission requise",
          "Permission d'accès à la caméra requise."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la prise de photo:", error);
      Alert.alert("Erreur", "Impossible de prendre la photo");
    }
  };

  /**
   * Show image selection options
   */
  const showImageOptions = () => {
    Alert.alert("Ajouter une photo", "Choisissez une option", [
      { text: "Annuler", style: "cancel" },
      { text: "Prendre une photo", onPress: takePhoto },
      { text: "Choisir depuis la galerie", onPress: selectImage },
    ]);
  };

  /**
   * Handle location change from LocationPicker
   */
  const handleLocationChange = (lat: number | undefined, lng: number | undefined) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  /**
   * Validate and save obstacle
   */
  const saveObstacle = async () => {
    if (!titre.trim()) {
      Alert.alert("Erreur", "Le titre est obligatoire");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Erreur", "La description est obligatoire");
      return;
    }

    setIsLoading(true);

    try {
      const obstacle: Obstacle = {
        id: Date.now().toString(),
        titre: titre.trim(),
        description: description.trim(),
        photo: photo || undefined,
        latitude: latitude,
        longitude: longitude,
        dateCreation: new Date().toISOString(),
      };

      await StorageService.addObstacle(obstacle);
      Alert.alert("Succès", "Obstacle ajouté avec succès", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      Alert.alert("Erreur", "Impossible de sauvegarder l'obstacle");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cancel and go back
   */
  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Titre *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: "#e0e0e0",
                  color: colors.text,
                },
              ]}
              value={titre}
              onChangeText={setTitre}
              placeholder="Ex: Feu tricolore à démonter"
              placeholderTextColor={colors.tabIconDefault}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Description *
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.background,
                  borderColor: "#e0e0e0",
                  color: colors.text,
                },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Décrivez l'obstacle en détail..."
              placeholderTextColor={colors.tabIconDefault}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Photo</Text>
            {photo ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => setPhoto(null)}
                >
                  <Text style={styles.removePhotoText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.photoButton, { borderColor: colors.tint }]}
                onPress={showImageOptions}
              >
                <Text style={[styles.photoButtonText, { color: colors.tint }]}>
                  📷 Ajouter une photo
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Position géographique
            </Text>
            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              onLocationChange={handleLocationChange}
            />
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.buttonContainer,
          { backgroundColor: colors.background, borderTopColor: "#e0e0e0" },
        ]}
      >
        <TouchableOpacity
          style={[styles.cancelButton]}
          onPress={handleCancel}
          disabled={isLoading}
        >
          <Text style={[styles.cancelButtonText]}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton]}
          onPress={saveObstacle}
          disabled={isLoading || !titre.trim() || !description.trim()}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? "Sauvegarde..." : "Sauvegarder"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "white",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    color: "white",
  },
  photoContainer: {
    position: "relative",
  },
  photo: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
  },
  removePhotoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  photoButton: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "white",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  photoButtonText: {
    fontSize: 16,
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8E8E93",
    backgroundColor: "white",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#007AFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
