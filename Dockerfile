FROM node:16.20.2

WORKDIR /usr/src/flowmorphreact

# Copiando package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalando dependências
RUN npm install

# Copiando todos os arquivos do projeto para o diretório de trabalho
COPY . .

# Executando o comando 'npm run build'
RUN npm run build

# Expondo a porta 8080 (se necessário)
EXPOSE 8080

# Definindo o comando padrão para iniciar o servidor
CMD ["node", "server.js"]