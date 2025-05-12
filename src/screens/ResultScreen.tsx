import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

export default function ResultScreen() {
  const route = useRoute<ResultScreenRouteProp>();
  const {
    photoUri,
    prediction,
    confidence,
    name,
    symptoms,
    precautions,
    note,
  } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tahmin Sonucu</Text>
      <Image
        source={{ uri: photoUri }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.infoText}>
        Dermatologic Diseases Diagnosis App hata yapabilir.{'\n'} Lütfen doktorunuza danışın.
      </Text>

      <View style={styles.section}>
        <Text style={styles.resultText}>{name || prediction}</Text>
        {confidence !== undefined && (
          <Text style={styles.confidenceText}>Güven Skoru: %{confidence}</Text>
        )}
      </View>

      {symptoms && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Belirtiler:</Text>
          {symptoms.map((item: string, index: number) => (
            <Text key={index} style={styles.bulletText}>• {item}</Text>
          ))}
        </View>
      )}

      {precautions && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Önlemler:</Text>
          {precautions.map((item: string, index: number) => (
            <Text key={index} style={styles.bulletText}>• {item}</Text>
          ))}
        </View>
      )}

      {note && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Not:</Text>
          <Text style={styles.noteText}>{note}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  image: { width: 300, height: 300, marginBottom: 15 },
  infoText: { textAlign: 'center', fontSize: 13, marginBottom: 10, color: '#666' },
  resultText: { fontSize: 20, color: 'green', marginBottom: 5 },
  confidenceText: { fontSize: 16, color: 'gray', marginBottom: 15 },
  section: { width: '100%', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  bulletText: { fontSize: 15, marginLeft: 10, marginBottom: 3 },
  noteText: { fontSize: 14, fontStyle: 'italic', color: '#333' },
});
