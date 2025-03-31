// App.tsx

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';

// Amplify の初期化（最初に実行）
Amplify.configure(amplifyconfig);

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello Amplify with Expo!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
  },
});
