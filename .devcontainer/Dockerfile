# ベースイメージは Node.js 18（Debian Bullseye）
FROM node:18-bullseye

RUN apt-get update && \
    apt-get install vim -y && \
    apt-get clean -y

# # Python と pip、Expo CLI をインストール
# RUN apt-get update && \
#     apt-get install -y python3 python3-pip && \
#     npm install -g expo-cli@6.3.1

# # 作業ディレクトリを /workspace に設定
# WORKDIR /workspace

# # 依存関係を先読み
# COPY package*.json ./
# RUN npm ci

# # Expo が使うポートを開放
# EXPOSE 19000 19001 19002

# # コンテナ起動時に expo start をトンネルモードで実行
# CMD ["expo", "start", "--tunnel"]
