import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Intelligent Dermatologic {'\n'} Diseases Diagnosis App</Text>
      <View style={{ marginBottom: 30 }} /> {/* Boşluk ekleniyor */}
      <Button title="Sonuç ekranına git" onPress={() => navigation.navigate('Result')} />
      <View style={{ marginBottom: 10 }} /> {/* Boşluk ekleniyor */}
      <Button title="Kamera Ekranına Git" onPress={() => navigation.navigate('Camera')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: { fontSize: 20, marginBottom: 10  }
});
