# Roll The Dice — Aplicação React + Node.js

Este projeto simula a rolagem de dados reais (D4, D6, D8, D10, D12, D20) com uma interface desenvolvida em React + TypeScript + TailwindCSS e um servidor Node.js responsável por gerar os resultados aleatórios e retornar ao front-end.

## Estrutura do Projeto

``` text
roll-dice
│
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── server.js        ← Servidor Node.js
├── package.json
└── README.md
```

## Pré-requisitos

Antes de rodar o projeto, verifique se você tem instalado:

* Node.js versão 18 ou superior
* npm

Para confirmar, rode:

``` console
node -v
npm -v
```

## Como rodar o projeto

### 1 - Clonar o repositório

``` console
git clone https://github.com/seuusuario/roll-dice.git
cd roll-dice
```

### 2 - Instalar dependências do Front-end

Dentro da pasta do projeto (onde está o package.json gerado pelo Vite):

``` console
npm install
```

### 3 - Instalar dependências do Back-end

Ainda na raiz do projeto, instale o Express e o CORS:

``` console
npm install express cors
```

### 4 - Rodar o servidor (Back-end)

Use o arquivo server.js com este conteúdo:

``` js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const DICE = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
};

app.get("/api/roll", (req, res) => {
  const dice = String(req.query.dice || "d6").toLowerCase();
  const sides = DICE[dice];
  if (!sides) return res.status(400).json({ error: "Tipo de dado inválido" });
  const result = Math.floor(Math.random() * sides) + 1;
  res.json({ dice, sides, result, timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Servidor rodando em http://localhost:${port}`));
```

Para iniciar o servidor:

``` console
node server.js
```

Ao acessar http://localhost:3000/api/roll?die=d6, deve retornar:

``` json
{
  "die": "d6",
  "sides": 6,
  "result": 4,
  "timestamp": "2025-11-07T22:10:00.000Z"
}
```

### 5 - Configurar o Front-end

Crie um arquivo .env na raiz do projeto com:

``` env
VITE_API_BASE=http://localhost:3000
```

### 6 - Rodar o Front-end

No terminal:

``` console
npm run dev
```

## Como funciona

* O front-end (React + Tailwind) oferece uma interface limpa e responsiva.
* O usuário escolhe o tipo de dado (D4, D6, D8, D10, D12, D20) e clica em “Rolar dado”.
* O front faz uma requisição GET para o back-end em /api/roll?die=dX.
* O back-end gera um número aleatório e devolve em formato JSON.
* O resultado aparece na tela, e o histórico das últimas 20 rolagens é exibido.
