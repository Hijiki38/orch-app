// App.tsx

import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { Amplify } from 'aws-amplify';
//import amplifyconfig from './src/amplifyconfiguration.json';
import amplifyconfig from './src/aws-exports';
import { uploadData } from 'aws-amplify/storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

global.Buffer = Buffer; // very important

// Amplify の初期化（最初に実行）
Amplify.configure(amplifyconfig);
export default function App() {
  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: [ImagePicker.MediaType.Images],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = uri.split('/').pop()!;
      const fileBuffer = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      try {
        const res = await uploadData({
          path: `public/uploads/${fileName}`,
          data: Buffer.from(fileBuffer, 'base64'),
          options: {
            contentType: 'image/jpeg',
            onProgress: (progress) => {
              console.log('Uploading:', progress);
            },
          },
        }).result;

        console.log('Upload succeeded:', res);
        alert('Upload successful!');
      } catch (err) {
        console.error('Upload failed:', err);
        alert('Upload failed!');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="画像を選んでアップロード" onPress={uploadImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Hello Amplify with Expo!</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   text: {
//     fontSize: 20,
//   },
// });
