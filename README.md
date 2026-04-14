# docmind 🧠📖

> A Query Transformation style RAG (Retrieval Augmented Generation) system — upload PDFs and ask questions about them using local embeddings(nomic-embed-text) and Groq for Free.

---

## What is docmind?

docmind lets you upload PDF documents and ask natural language questions about them. Instead of relying on an LLM's training data, it searches your own documents and answers based only on what's in them.

```
Upload → Any PDF (docs, manuals, reports)
Ask    → "How does TTL work in Redis?"
Answer → Based on the actual PDF content only
```

---

## How RAG Works

```
INGEST (one time per document):
PDF → extract text → split into chunks → embed via nomic-embed-text → store in pgvector

QUERY (every question):
Question → rewrite for better retrieval → embed → similarity search → top 5 chunks → Groq → answer
```

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Runtime | Node.js 18 |
| Language | TypeScript |
| Framework | Express |
| LLM | Groq |
| Embeddings | nomic-embed-text via Ollama (local) |
| Vector DB | pgvector (PostgreSQL extension) |
| ORM | Prisma |
| File parsing | pdf-parse |
| File upload | Multer |
| Containerization | Docker + Docker Compose |
| Logging | Morgan |

---

## Project Structure

```
docmind/
├── src/
│   ├── index.ts                      # Entry point
│   ├── config/
│   │   ├── constants.ts              # All env variable names
│   │   └── db.ts                     # Prisma client
│   ├── routes/
│   │   ├── router.ts                 # Root router
│   │   └── core/
│   │       ├── ingest.ts             # POST /ingest
│   │       └── query.ts              # POST /query
│   ├── services/
│   │   ├── pdf.ts                    # PDF text extraction
│   │   ├── chunking.ts               # Split text into chunks
│   │   ├── embedding.ts              # nomic-embed-text via Ollama
│   │   ├── retrieval.ts              # pgvector similarity search
│   │   └── llm.ts                    # Groq query rewriting + answer generation
│   └── middlewares/
│       └── upload.ts                 # Multer file upload
├── prisma/
│   └── schema.prisma                 # DB schema with pgvector
├── docker-compose.yml
├── .env.example
├── tsconfig.json
└── package.json
```

---

## API

### Ingest a PDF

```http
POST /api/v1/ingest
Content-Type: multipart/form-data

file: <PDF file>
```

``
Note: The PDF name/ key should be 'file' only.
``

**Response:**
```json
{
  "success": true,
  "document_id": "uuid",
  "message": "Document ingested successfully"
}
```

---

### Query

```http
POST /api/v1/query
Content-Type: application/json

{
  "question": "How does TTL work in Redis?",
  "document_id": "uuid"
}
```

`document_id` is optional — omit to search across all documents.

**Response:**
```json
{
  "success": true,
  "message": "Generated the response",
  "data": "answer",
  "sources": [
    {
      "content": "relevant chunk...",
      "similarity": 0.92,
      "page": 4
    }
  ]
}
```

---

## Environment Variables

```env
# Server
PORT=8080

# PostgreSQL
DATABASE_URL=postgresql://username:password@postgres:5432/your_db

# Google Groq
GROQ_API_KEY=your_groq_api_key
```

---

## Running Locally

### Prerequisites
- Docker + Docker Compose
- Ollama (https://docs.ollama.com/linux)
- Groq API

### Start

```bash
# clone the repo
git clone https://github.com/RupakBoral/docmind.git
cd docmind

# copy env
cp .env.example .env
# add your GROQ_API_KEY to .env

# start psql services
docker-compose up -d --build

# run the server
npm run dev
```

### Pull the embedding model (274 MB model, first time only)

```bash
ollama pull nomic-embed-text
```

### Stop

```bash
# psql
docker-compose down

# ollama
sudo systemctl stop ollama 
# Linux
```

---

## Docker Services

```
app       → Node.js Express API
postgres  → PostgreSQL with pgvector extension
ollama    → Local embedding model (nomic-embed-text)
```

---

## Key Concepts Covered

| Concept | Where |
|---------|-------|
| PDF text extraction | pdf.ts |
| Text chunking with overlap | chunking.ts |
| Local embeddings (nomic-embed-text) | embedding.ts |
| pgvector cosine similarity search | retrieval.ts |
| Query rewriting for better retrieval | llm.ts |
| Prompt engineering with context | llm.ts |
| Prisma with raw SQL for vector ops | retrieval.ts |

---

## License

MIT