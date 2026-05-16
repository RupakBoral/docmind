
export const CONFIG = {
    SERVER: {
        PORT: Number(process.env.PORT) || 8000,
    },
    LLM: {
        API_KEY: process.env.GROQ_API_KEY || '',
        MODEL: process.env.LLM_MODEL || 'llama-3.3-70b-versatile',
    },
    JWT: {
        SECRET: process.env.JWT_SECRET || 'fallback_secret',
        EXPIRY: '24h'
    },
    OLLAMA: {
        HOST: 'http://ollama:11434',
    },
    CHUNKING: {
        CHUNK_SIZE: Number(process.env.CHUNK_SIZE) || 300,
        OVERLAP: Number(process.env.OVERLAP) || 100,
    }
}
