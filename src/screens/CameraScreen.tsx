import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert, PermissionsAndroid, Platform, ActivityIndicator } from 'react-native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // AppNavigator dosyanıza göre doğru yolu yazın

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;

export default function CameraScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [photo, setPhoto] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
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
    console.log('Galeriden seçim yapıldı');
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Hata', response.errorMessage || 'Galeri hatası');
      } else if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0]);
      }
    });
  };

  const sendPhotoToBackend = async () => {
    if (!photo?.uri) {
      Alert.alert('Hata', 'Önce bir fotoğraf seçin.');
      return;
    }
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append('file', {
      uri: photo.uri,
      name: photo.fileName || 'photo.jpg',
      type: photo.type || 'image/jpeg',
    });
  
    try {
      const response = await fetch('http://192.168.1.89:5000/predict', { // 🔥 IP doğru olacak
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (!response.ok) {
        console.log('Backend HATASI:', response.status);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text();
      console.log('Backendten gelen raw cevap:', text);

      const data = JSON.parse(text);
      console.log('Backendten çözümlenen veri:', data);

      navigation.navigate('Result', {
        photoUri: photo.uri,
        prediction: data.prediction,
      });

    } catch (error) {
      console.error('Gönderme Hatası:', error);
      Alert.alert('Hata', 'Sunucuya fotoğraf gönderilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Kamerayı Aç" onPress={openCamera} />
      <Button title="Galeriden Seç" onPress={openGallery} />
      {photo && (
        <>
          <Image
            source={{ uri: photo.uri }}
            style={styles.image}
            resizeMode="contain"
          />
          <Button title="Fotoğrafı Gönder" onPress={sendPhotoToBackend} />
        </>
      )}
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  image: { width: 300, height: 300, marginTop: 20 },
  loading: { marginTop: 20 },
});
