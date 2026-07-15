# 🚢 Conciliador Naval de Materiais via IA

O **Conciliador Naval** é uma plataforma inteligente e profissional desenvolvida em React, TypeScript, Express e Node.js para automatizar a conciliação e reconciliação detalhada de listas técnicas de materiais navais e desenhos técnicos (P&IDs ou fluxogramas). 

A plataforma utiliza o motor de inteligência artificial multimodal **Google Gemini (modelo `gemini-2.5-flash`)** para extrair automaticamente a Lista de Materiais (BOM) contida em desenhos técnicos (PDFs ou imagens), cruzá-la com o banco de dados do **Jobbook** (planilha Excel carregada em tempo real) e diagnosticar discrepâncias, faltas, sobras ou envios pendentes com alta precisão técnica.

---

## 🛠️ Tecnologias Utilizadas

### Frontend (SPA)
- **React (v19)** com hooks funcionais e tipagem forte em TypeScript.
- **Tailwind CSS** para uma interface de usuário marítima, densa, elegante e altamente responsiva.
- **Motion (framer-motion)** para transições suaves, layouts dinâmicos e feedbacks de micro-interações.
- **Lucide React** para um pacote de ícones moderno e consistente.

### Backend (API REST)
- **Node.js** com **Express.js** estruturado sob os princípios do Clean Architecture e SOLID.
- **Google Gen AI SDK (`@google/genai`)** para integração de ponta com o Gemini.
- **Multer** para manipulação segura e rápida de uploads diretamente em buffers de memória (otimizado para ambientes serverless).
- **XLSX (SheetJS)** para parsing determinístico e ultra-veloz de planilhas Excel estruturadas ou parciais.
- **Esbuild** para bundlização rápida e modularização limpa em ambiente de produção.

---

## 📁 Estrutura Completa do Projeto

```
/
├── .env.example                # Configurações de variáveis de ambiente de exemplo
├── index.html                  # Ponto de entrada do documento HTML5
├── metadata.json               # Configurações do applet e permissões de frame
├── package.json                # Gerenciamento de scripts e dependências npm
├── server.ts                   # Entrypoint do servidor de produção (Express + Vite)
├── tsconfig.json               # Configurações globais do TypeScript compiler
├── vite.config.ts              # Configurações do Vite bundler
│
├── src/
│   ├── App.tsx                 # Componente principal do Frontend
│   ├── index.css               # Folha de estilo global com importação Tailwind
│   ├── main.tsx                # Inicializador do React DOM no documento
│   ├── types.ts                # Definição e padronização global de tipos/interfaces
│   │
│   ├── components/             # Componentes modulares reutilizáveis
│   │   ├── Dashboard.tsx       # Painel de resultados da conciliação & KPIs
│   │   ├── LoadingState.tsx    # Feedback animado de processamento com IA em tempo real
│   │   ├── ReconciliationTable.tsx # Tabela avançada com busca, ordenação e filtros
│   │   └── UploadArea.tsx      # Área de arrastar e soltar (drag & drop) para os arquivos
│   │
│   └── backend/                # Estrutura modular da API REST (Backend)
│       ├── app.ts              # Inicializador e configurações do Express
│       ├── config/
│       │   └── gemini.ts       # Inicialização preguiçosa (lazy) do SDK do Gemini
│       ├── controllers/
│       │   └── reconciliationController.ts # Gerenciador de requisições de conciliação
│       ├── middlewares/
│       │   └── uploadMiddleware.ts   # Configuração e filtros de segurança do Multer
│       ├── routes/
│       │   └── reconciliationRoutes.ts # Definição das rotas REST de conciliação
│       ├── services/
│       │   ├── analysisService.ts     # Integração, timeout e validação do Gemini AI
│       │   └── excelService.ts        # Parsing, mapeamento e sanitização de planilhas Excel
│       └── utils/
│           └── errorHandler.ts        # Tratamento de exceções globais padronizado
```

---

## ⚡ Rotas da API REST

A API expõe os seguintes endpoints mapeados e prontos para consumo:

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| **GET** | `/api/health` | Verifica a saúde e conectividade do servidor Express. |
| **POST** | `/api/upload` | Recebe uma planilha Excel (`jobbook`), realiza o parsing e retorna os dados em formato JSON higienizado. |
| **POST** | `/api/analyze` | Recebe o desenho (`drawing`: PDF/Imagem) e a planilha (`jobbook`: Excel), executa a conciliação no Gemini e retorna o relatório estruturado completo. |
| **GET** | `/api/report` | Retorna o relatório estruturado da última conciliação realizada em memória. |

---

## ⚙️ Variáveis de Ambiente (`.env`)

Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example`:

```env
# Variável obrigatória para acessar o motor de IA da Google.
# Obtenha uma chave gratuita no Google AI Studio (https://aistudio.google.com/)
GEMINI_API_KEY="SUA_CHAVE_PRIVADA_AQUI"

# URL onde este app está rodando (opcional para ambiente local)
APP_URL="http://localhost:3000"

# Define o ambiente da aplicação (development ou production)
NODE_ENV="development"
```

---

## 🚀 Instalação e Execução Local

Siga as instruções abaixo para clonar, configurar e rodar o projeto em sua máquina local:

### 1. Pré-requisitos
- Node.js (v18 ou superior recomendado)
- NPM, Yarn, PNPM ou Bun

### 2. Instalar dependências do projeto
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie seu arquivo `.env` com a sua chave da API Gemini:
```bash
cp .env.example .env
```
*Edite o arquivo `.env` adicionando a sua `GEMINI_API_KEY`.*

### 4. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
*Acesse `http://localhost:3000` no seu navegador.*

### 5. Compilar e Executar em Produção
```bash
# Executa o build estático do Frontend e do Servidor Backend
npm run build

# Inicializa o servidor de produção servindo os assets otimizados
npm run start
```

---

## ☁️ Instruções de Deploy

### Deploy no Render (Full-Stack Express + Vite)
Para hospedar a aplicação completa no **Render**, configure um **Web Service** com as seguintes definições:
1. **Runtime:** `Node`
2. **Build Command:** `npm install && npm run build`
3. **Start Command:** `npm run start`
4. **Environment Variables:**
   - Adicione a chave `GEMINI_API_KEY` com o seu token secreto do Google.
   - Adicione `NODE_ENV` com o valor `production`.

### Deploy no Vercel (Alternativa Serverless)
Para hospedar o frontend estático no **Vercel** e o backend em serverless functions:
1. Conecte o repositório no painel do Vercel.
2. Certifique-se de configurar as variáveis de ambiente em **Settings > Environment Variables** antes do deploy.
3. Adicione um arquivo `vercel.json` na raiz se desejar reescrever as rotas de API para funções serverless específicas:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

---

## 🛠️ Tratamento de Erros, Timeout e Validação no Motor de IA

A classe `AnalysisService` foi projetada para garantir robustez de nível enterprise:
- **Timeout Proativo:** Para evitar requisições presas e latência excessiva, um timeout customizado de **55 segundos** cancela e rejeita proativamente a requisição com feedback amigável para o usuário caso o processamento do Gemini exceda o tempo de segurança.
- **Sanitização de Schema:** Todas as propriedades retornadas do JSON da IA são validadas individualmente, convertendo tipos e injetando valores padrão (*fallbacks*) caso o Gemini retorne nulos ou strings inválidas, eliminando chances de quebras na renderização da interface do usuário.
- **Higienização de Caracteres:** Recomendações longas demais são truncadas com segurança técnica para evitar estouros de pilha ou buffer.
