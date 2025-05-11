// FileList.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
// import Storage from '@aws-amplify/storage';
import { list } from 'aws-amplify/storage';

type S3Object = {
  key: string;
  url: string;
};

export default function FileList() {
  const [files, setFiles] = useState<S3Object[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const result = await list({
          path: 'public/uploads/',
        })
        console.log(result);  // { key: string, eTag: string, ... } の配列が返る
      } catch (err) {
        console.error(err);
      }
    };
    
    // const fetchFiles = async () => {
    //   try {
    //     // 1. "public/uploads/" 以下のオブジェクト一覧を取得
    //     const listResult = await Storage.list('public/uploads/', {
    //       level: 'public',
    //     });

    //     // 2. 各オブジェクトの署名付きURLを取得
    //     const filePromises = listResult.map(async (obj) => {
    //       const url = await Storage.get(obj.key, {
    //         level: 'public',
    //         expires: 300, // URL 有効期限：5分
    //       });
    //       return { key: obj.key, url } as S3Object;
    //     });

    //     const fileList = await Promise.all(filePromises);
    //     setFiles(fileList);
    //   } catch (err) {
    //     console.error('Error listing files:', err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    fetchFiles();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>読み込み中…</Text>
      </View>
    );
  }

  if (files.length === 0) {
    return (
      <View style={styles.center}>
        <Text>アップロードされたファイルはありません。</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={files}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            // PDFも画像も、そのままブラウザ／ビューアで開く
            Linking.openURL(item.url as string);
          }}
        >
          <Text style={styles.text}>{item.key.split('/').pop()}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  text: { fontSize: 16 },
});

