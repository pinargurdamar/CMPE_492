import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Intelligent Dermatologic{'\n'}Diseases Diagnosis App
      </Text>

      <Text style={styles.info}>
        Bu uygulama şu anda yalnızca aşağıdaki dört cilt hastalığını teşhis edebilmektedir:
      </Text>

      <Text style={styles.disease}>• Nevus (Ben)</Text>
      <Text style={styles.disease}>• Melanoma (Cilt Kanseri)</Text>
      <Text style={styles.disease}>• Basal Cell Carcinoma</Text>
      <Text style={styles.disease}>• Benign Keratosis-like Lesions</Text>

      <View style={{ marginBottom: 30 }} />

      <Button 
        title="Kamera Ekranına Git" 
        onPress={() => navigation.navigate('Camera')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  info: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 10 },
  disease: { fontSize: 14, color: '#222', marginTop: 2 }
});
