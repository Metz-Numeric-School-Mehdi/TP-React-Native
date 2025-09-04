import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LocationService } from "@/services/locationService";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

interface MapSelectorProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (latitude: number, longitude: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
}

export default function MapSelector({
  visible,
  onClose,
  onLocationSelect,
  initialLatitude,
  initialLongitude,
}: MapSelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(
    initialLatitude && initialLongitude
      ? { latitude: initialLatitude, longitude: initialLongitude }
      : null
  );

  const [region, setRegion] = useState<Region>({
    latitude: initialLatitude || 49.1193089,
    longitude: initialLongitude || 6.1757156,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Handle map press to select location
   */
  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  /**
   * Get current user location
   */
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await LocationService.getCurrentLocation();
      if (location) {
        const newRegion = {
          ...region,
          latitude: location.latitude,
          longitude: location.longitude,
        };
        setRegion(newRegion);
        setSelectedLocation(location);
      } else {
        Alert.alert("Erreur", "Impossible de récupérer la position actuelle");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la position:", error);
      Alert.alert("Erreur", "Impossible de récupérer la position actuelle");
    } finally {
      setIsGettingLocation(false);
    }
  };

  /**
   * Search for address using geocoding
   */
  const searchForAddress = async () => {
    if (!searchAddress.trim()) {
      Alert.alert("Erreur", "Veuillez saisir une adresse");
      return;
    }

    setIsSearching(true);
    try {
      const geocodingResult = await Location.geocodeAsync(searchAddress);

      if (geocodingResult.length > 0) {
        const location = geocodingResult[0];
        const newRegion = {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        setSelectedLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });

        Alert.alert("Succès", `Adresse trouvée : ${searchAddress}`);
      } else {
        Alert.alert(
          "Erreur",
          "Adresse non trouvée. Veuillez vérifier votre saisie."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'adresse:", error);
      Alert.alert("Erreur", "Impossible de rechercher cette adresse");
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Confirm location selection
   */
  const confirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation.latitude, selectedLocation.longitude);
      onClose();
    } else {
      Alert.alert("Erreur", "Veuillez sélectionner une position sur la carte");
    }
  };

  /**
   * Cancel selection
   */
  const cancelSelection = () => {
    setSelectedLocation(
      initialLatitude && initialLongitude
        ? { latitude: initialLatitude, longitude: initialLongitude }
        : null
    );
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: "#e0e0e0" }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Sélectionner la position
          </Text>
          <TouchableOpacity
            style={[styles.locationButton]}
            onPress={getCurrentLocation}
            disabled={isGettingLocation}
          >
            <Text style={styles.locationButtonText}>
              {isGettingLocation ? "📍 Récupération..." : "📍 Ma position"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Address Section */}
        <View style={[styles.searchContainer]}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={[
                styles.searchInput,
                {
                  borderColor: "#e0e0e0",
                  color: colors.text,
                },
              ]}
              value={searchAddress}
              onChangeText={setSearchAddress}
              placeholder="Rechercher une adresse..."
              placeholderTextColor={colors.tabIconDefault}
              returnKeyType="search"
              onSubmitEditing={searchForAddress}
            />
            <TouchableOpacity
              style={[styles.searchButton]}
              onPress={searchForAddress}
              disabled={isSearching}
            >
              {isSearching ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.searchButtonText}>🔍</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                title="Position sélectionnée"
                description={`${selectedLocation.latitude.toFixed(
                  6
                )}, ${selectedLocation.longitude.toFixed(6)}`}
              />
            )}
          </MapView>
        </View>

        <View style={styles.infoContainer}>
          {selectedLocation ? (
            <>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Position sélectionnée :
              </Text>
              <Text
                style={[styles.coordinates, { color: colors.tabIconDefault }]}
              >
                📍 {selectedLocation.latitude.toFixed(6)},{" "}
                {selectedLocation.longitude.toFixed(6)}
              </Text>
            </>
          ) : (
            <Text style={[styles.infoText, { color: colors.tabIconDefault }]}>
              Appuyez sur la carte pour sélectionner une position
            </Text>
          )}
        </View>

        <View style={[styles.buttonContainer, { borderTopColor: "#e0e0e0" }]}>
          <TouchableOpacity
            style={[
              styles.cancelButton,
              { borderColor: colors.tabIconDefault },
            ]}
            onPress={cancelSelection}
          >
            <Text
              style={[
                styles.cancelButtonText,
                { color: colors.tabIconDefault },
              ]}
            >
              Annuler
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton]}
            onPress={confirmLocation}
            disabled={!selectedLocation}
          >
            <Text style={styles.confirmButtonText}>Confirmer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  locationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#007AFF",
  },
  locationButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    padding: 20,
    minHeight: 80,
    justifyContent: "center",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 14,
  },
  infoText: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
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
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  searchContainer: {
    padding: 15,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    fontSize: 18,
    backgroundColor: "#007AFF",
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 6,
  },
});
