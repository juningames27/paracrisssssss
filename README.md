# Quiz fofo com banco de dados

Este projeto tem:

- `public/index.html`: estrutura do site
- `public/style.css`: visual fofo
- `public/app.js`: perguntas, lógica do quiz e envio da escolha final
- `server.js`: servidor Node.js com API
- `data/escolhas.sqlite`: banco SQLite criado automaticamente quando o servidor roda
- `schema.sql`: estrutura da tabela

## Como rodar

1. Instale o Node.js.
2. Abra o terminal na pasta do projeto.
3. Rode:

```bash
npm install
npm start
```

4. Abra no navegador:

```text
http://localhost:3000
```

## Como funciona o salvamento

No final do quiz, ela só pode escolher uma das 3 opções:

- Cartinha Secreta
- Vale-Presente
- Nosso Destino

Quando ela escolhe, o frontend envia para:

```text
POST /api/escolhas
```

O servidor salva no SQLite com:

- `id`: ID aleatório usando `crypto.randomUUID()`
- `escolha`: nome da escolha
- `indice`: posição da escolha
- `criado_em`: data/hora em ISO

## Ver escolhas salvas

Acesse:

```text
http://localhost:3000/api/escolhas
```

## Observação importante

Abrir o `index.html` direto no navegador não salva no banco, porque precisa do servidor Node rodando.
Use sempre `npm start` e acesse `http://localhost:3000`.
