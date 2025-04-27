import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert, PermissionsAndroid, Platform } from 'react-native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';

export default function CameraScreen() {
  const [photo, setPhoto] = useState<Asset | null>(null);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS ise otomatik kabul (şimdilik)
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Kamera izni reddedildi');
      return;
    }

    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Hata', response.errorMessage || 'Kamera hatası');
      } else if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0]);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Hata', response.errorMessage || 'Galeri hatası');
      } else if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0]);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Kamerayı Aç" onPress={openCamera} />
      <Button title="Galeriden Seç" onPress={openGallery} />
      {photo && (
        <Image
          source={{ uri: photo.uri }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  image: { width: 300, height: 300, marginTop: 20 }
});
