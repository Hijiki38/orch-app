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
import { list, getUrl } from 'aws-amplify/storage';

type S3Object = {
  key: string;
  url: URL;
};

export default function FileList() {
  const [files, setFiles] = useState<S3Object[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const { items } = await list({
          path: 'public/uploads/',
          options: { listAll: true },
        });

        const withUrls = await Promise.all(
          items.map(async ({ path }) => {
            const { url } = await getUrl({ path });
            return { key: path, url };
          })
        );
        console.log('withUrls:', withUrls);
        setFiles(withUrls);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
      // try {
    }


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
  }else{
    console.log('files:', files);
  }

  return (
    <FlatList
      data={files}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => 
            // PDFも画像も、そのままブラウザ／ビューアで開く
            Linking.openURL(item.url.toString())
          }
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

