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
POSTGRES_USER=username
POSTGRES_PASSWORD=password
DATABASE_URL=postgresql://username:password@postgres:5432/your_db

# Groq
GROQ_API_KEY=your_groq_api_key

# OLLAMA HOST
OLLAMA_HOST=http://host.docker.internal:11434

# JWT
JWT_SECRET=jwt_secret

# chunk size & overlap size for chunking
CHUNK_SIZE=300
OVERLAP=100
```

---

### Prerequisites
- Docker + Docker Compose
- Ollama (https://docs.ollama.com/linux)
- Groq API

### Start the project

```bash
# clone the repo
git clone https://github.com/RupakBoral/Docmind.git

# copy env
cp .env.example .env
# add your API KEYs and other details

# build the frontend
cd docmind/frontend
npm run build

# start all services (frontend, nginx, backend, db, ollama)
docker-compose up -d --build

# Apply Prisma schema to Database (first time only)
docker exec -it docmind-app npx prisma db push

# Pull the embedding model (274 MB model, first time only)
docker exec -it docmind-ollama ollama pull nomic-embed-text
```


### Check all containers status
```
docker ps
```


### Check container logs
```
docker logs <container_name>
```


### Stop services
```
docker compose down
```

---

## Docker Services

```
app       → Node.js Express API
postgres  → PostgreSQL with pgvector extension
ollama    → Local embedding model (nomic-embed-text)
nginx     → Nginx as a reverse proxy, load balancer
```

---

## Key Concepts Covered

| Concept | Where |
|---------|-------|
| PDF text extraction | pdf.ts |
| Text chunking with overlap | chunking.ts |
| Local embeddings (nomic-embed-text) | embedding.ts |
| pgvector cosine similarity search | retrieval.ts |
| Query rewriting and prompting with context | llm.ts |

---

## License

MIT
