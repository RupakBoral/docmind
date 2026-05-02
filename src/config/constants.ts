
export const CONFIG = {
    SERVER: {
        PORT: Number(process.env.PORT) || 8000,
    },
    LLM: {
        API_KEY: process.env.GROQ_API || ''
    },
    JWT: {
        SECRET: process.env.JWT_SECRET || 'fallback_secret',
        EXPIRY: '24h'
    }
}
