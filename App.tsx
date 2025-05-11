// App.tsx

import React from 'react';
import { Text, Button, View, StyleSheet } from 'react-native';
import { Amplify } from 'aws-amplify';
//import amplifyconfig from './src/amplifyconfiguration.json';
import amplifyconfig from './src/aws-exports';
import { uploadData } from 'aws-amplify/storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import FileList from './FileList';

global.Buffer = Buffer; // very important

// Amplify の初期化（最初に実行）
Amplify.configure(amplifyconfig);
export default function App() {
  const uploadImage = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true, // true にすると、選択したファイルがキャッシュに保存される
      multiple: false, // 複数選択を許可する場合は true にする
    });

    if (!res.canceled) {
      const { uri, name } = res.assets[0];
      // Base64文字列として読み込み
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const buffer = Buffer.from(base64, 'base64');

      try {
        // uploadData でアップロード
        const { result } = await uploadData({
          path: `public/uploads/${name}`,
          data: buffer,
          options: {
            contentType: 'application/pdf',
            onProgress: (progress) => {
              console.log('Uploading PDF:', progress);
            },
          },
        });
        console.log('Upload succeeded:', result);
        alert('PDFアップロード成功！');
      } catch (err) {
        console.error('Upload failed:', err);
        alert('PDFアップロード失敗…');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Amplify + Expo + React Native</Text>
      <Button title="画像を選んでアップロード" onPress={uploadImage} />
      {/* S3 にアップロード済みファイルの一覧表示 */}
      <View style={styles.listContainer}>
        <FileList />
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 40,
//     backgroundColor: '#fff',
//   },
//   listContainer: {
//     flex: 1,
//     marginTop: 20,
//   },
// });


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 100,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
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
