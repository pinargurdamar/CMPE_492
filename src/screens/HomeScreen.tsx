import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo2.jpg')}
        style={styles.logo}
      />

      <Text style={styles.title}>
        Intelligent Dermatologic{'\n'}Diseases Diagnosis App
      </Text>

      <Text style={styles.info}>
        This application is currently capable of diagnosing only the following four skin conditions:
      </Text>

      <Text style={styles.disease}>• Nevus </Text>
      <Text style={styles.disease}>• Melanoma </Text>
      <Text style={styles.disease}>• Basal Cell Carcinoma</Text>
      <Text style={styles.disease}>• Benign Keratosis-like Lesions</Text>

      <View style={{ marginBottom: 30 }} />

      <Button 
        title="Camera Screen" 
        onPress={() => navigation.navigate('Camera')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 150, height: 150, marginBottom: 20, resizeMode: 'contain' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  info: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 10 },
  disease: { fontSize: 14, color: '#222', marginTop: 2 }
});
