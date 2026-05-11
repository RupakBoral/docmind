export interface Doc {
  id: string;
  name: string;
  title: string;
  pages: number;
  chunks: number;
  size: number;
  createdAt: string;
  color: string;
  accent: string;
  pinned: boolean;
  excerpt: string;
}

export interface RecentQuery {
  q: string;
  doc: string;
  when: string;
}

export interface Citation {
  docId: string;
  page: number;
  chunk: number;
  snippet: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
}

export interface KbdShortcut {
  keys: string[];
  label: string;
}

export const SAMPLE_DOCS: Doc[] = [
  {
    id: 'doc_redis',
    name: 'redis-internals.pdf',
    title: 'Redis Internals: A Deep Dive',
    pages: 184,
    chunks: 247,
    size: 4_180_000,
    createdAt: '2026-04-29T09:14:00Z',
    color: 'oklch(0.92 0.04 25)',
    accent: 'oklch(0.55 0.13 25)',
    pinned: true,
    excerpt: 'Memory model, replication, cluster topology, persistence semantics across RDB and AOF.',
  },
  {
    id: 'doc_system',
    name: 'system-design-handbook.pdf',
    title: 'System Design Handbook — 2026 Edition',
    pages: 312,
    chunks: 418,
    size: 6_720_000,
    createdAt: '2026-04-28T16:02:00Z',
    color: 'oklch(0.93 0.035 155)',
    accent: 'oklch(0.5 0.1 155)',
    pinned: true,
    excerpt: 'Patterns for scale: load balancing, sharding, eventual consistency, observability.',
  },
  {
    id: 'doc_postgres',
    name: 'postgres-tuning.pdf',
    title: 'PostgreSQL Performance Tuning',
    pages: 96,
    chunks: 134,
    size: 2_340_000,
    createdAt: '2026-04-22T11:48:00Z',
    color: 'oklch(0.92 0.04 240)',
    accent: 'oklch(0.5 0.13 240)',
    pinned: false,
    excerpt: 'Query planning, index strategy, vacuum and bloat, replication lag mitigation.',
  },
  {
    id: 'doc_ml',
    name: 'embeddings-survey.pdf',
    title: 'A Survey of Modern Embeddings',
    pages: 64,
    chunks: 89,
    size: 1_510_000,
    createdAt: '2026-04-19T08:30:00Z',
    color: 'oklch(0.93 0.035 55)',
    accent: 'oklch(0.55 0.12 55)',
    pinned: false,
    excerpt: 'From word2vec to instruction-tuned encoders. Evaluation, retrieval, and fine-tuning.',
  },
  {
    id: 'doc_kafka',
    name: 'kafka-operations.pdf',
    title: 'Operating Kafka at Scale',
    pages: 142,
    chunks: 196,
    size: 3_280_000,
    createdAt: '2026-04-14T13:20:00Z',
    color: 'oklch(0.93 0.038 295)',
    accent: 'oklch(0.5 0.12 295)',
    pinned: false,
    excerpt: 'Broker sizing, partition strategy, exactly-once semantics, MirrorMaker patterns.',
  },
  {
    id: 'doc_security',
    name: 'auth-and-sessions.pdf',
    title: 'Authentication & Session Design',
    pages: 78,
    chunks: 102,
    size: 1_840_000,
    createdAt: '2026-04-09T17:55:00Z',
    color: 'oklch(0.92 0.04 100)',
    accent: 'oklch(0.5 0.12 100)',
    pinned: false,
    excerpt: 'JWT vs sessions, cookie hardening, OAuth flows, replay protection.',
  },
];

export const RECENT_QUERIES: RecentQuery[] = [
  { q: 'How does TTL eviction work in Redis?', doc: 'doc_redis', when: '12 min ago' },
  { q: 'Compare RDB and AOF for crash recovery', doc: 'doc_redis', when: '1 hr ago' },
  { q: 'When to denormalize for read-heavy workloads', doc: 'doc_system', when: 'Yesterday' },
  { q: 'Vacuum tuning for high-churn tables', doc: 'doc_postgres', when: 'Yesterday' },
  { q: 'Embedding distance: cosine vs dot product', doc: 'doc_ml', when: '3 days ago' },
];

export const SAMPLE_THREADS: Record<string, Message[]> = {
  doc_redis: [
    {
      role: 'user',
      content: 'How does TTL work in Redis, and what are the eviction strategies when memory is full?',
    },
    {
      role: 'assistant',
      content: "Redis associates an optional expiration with each key, stored as an absolute Unix timestamp. Two mechanisms cooperate to remove expired keys: lazy expiration on access, and an active sampling loop that runs ~10 times per second. The active loop samples 20 keys from the expires dictionary, removes the expired ones, and repeats while >25% of the sample is still expired.\n\nWhen `maxmemory` is reached, eviction kicks in. The policy is set with `maxmemory-policy` and the common choices are `allkeys-lru`, `allkeys-lfu`, `volatile-lru` (only keys with TTL), `volatile-ttl` (shortest TTL first), and `noeviction` (return errors on writes). Both LRU and LFU are approximate — Redis samples `maxmemory-samples` keys and evicts the worst from that pool.",
      citations: [
        { docId: 'doc_redis', page: 42, chunk: 87, snippet: 'Each key may carry an absolute expiration timestamp. Expired keys are removed by two cooperating mechanisms: a passive check at access time and an active sampling loop scheduled at 10 Hz.' },
        { docId: 'doc_redis', page: 58, chunk: 119, snippet: 'When maxmemory is reached, the configured maxmemory-policy determines which keys are evicted. Approximate LRU samples maxmemory-samples keys per eviction round.' },
        { docId: 'doc_redis', page: 61, chunk: 124, snippet: 'volatile-ttl evicts keys with the shortest remaining TTL among those carrying an expiration; allkeys-* policies consider every key.' },
      ],
    },
  ],
  doc_system: [
    {
      role: 'user',
      content: 'What are the trade-offs between sharding by user_id vs hash sharding for a social timeline?',
    },
    {
      role: 'assistant',
      content: "User-id sharding keeps a person's data co-located, which is cheap for profile reads and write fan-out from a single user. The cost is hot shards: a celebrity user concentrates load on one node, and rebalancing requires moving large contiguous ranges.\n\nHash sharding spreads load uniformly and avoids hot ranges, but timeline assembly now requires a scatter-gather across all shards because a user's followees live everywhere. For social timelines specifically, most production systems use a hybrid: hash-shard the write path and pre-compute timelines into a per-user inbox keyed by user_id, accepting denormalization in exchange for predictable read latency.",
      citations: [
        { docId: 'doc_system', page: 118, chunk: 211, snippet: 'Range sharding co-locates related rows but exposes hot-spotting risks proportional to skew in the partition key.' },
        { docId: 'doc_system', page: 124, chunk: 226, snippet: 'Hash sharding distributes writes uniformly at the cost of multi-shard reads for any locality-sensitive query.' },
        { docId: 'doc_system', page: 142, chunk: 268, snippet: 'A common timeline architecture writes to a hash-sharded activity log and asynchronously fans out into per-user inbox shards keyed by recipient.' },
      ],
    },
  ],
  all: [
    {
      role: 'user',
      content: 'Across all my docs, which ones discuss approximate algorithms for memory-bound systems?',
    },
    {
      role: 'assistant',
      content: "Three of your documents touch this directly. *Redis Internals* covers approximate LRU/LFU eviction via reservoir sampling, trading exactness for O(1) memory per eviction round. *System Design Handbook* discusses count-min sketch and HyperLogLog as bounded-memory cardinality and frequency estimators. *A Survey of Modern Embeddings* describes product quantization and IVF indexing — approximate nearest-neighbor structures that fit billion-vector corpora into RAM.",
      citations: [
        { docId: 'doc_redis', page: 60, chunk: 122, snippet: 'Approximate LRU keeps memory overhead constant by sampling rather than maintaining a global access-order structure.' },
        { docId: 'doc_system', page: 201, chunk: 384, snippet: 'HyperLogLog estimates cardinality with ~1.6 KB of state and standard error around 0.81%.' },
        { docId: 'doc_ml', page: 38, chunk: 51, snippet: 'IVF + PQ partitions the vector space and quantizes residuals, reducing memory by 32× with modest recall loss.' },
      ],
    },
  ],
};

export const KBD_SHORTCUTS: KbdShortcut[] = [
  { keys: ['⌘', 'K'], label: 'Open command palette' },
  { keys: ['⌘', '/'], label: 'Toggle shortcuts' },
  { keys: ['⌘', 'U'], label: 'Upload PDF' },
  { keys: ['⌘', 'B'], label: 'Toggle sidebar' },
  { keys: ['G', 'D'], label: 'Go to dashboard' },
  { keys: ['G', 'C'], label: 'Go to chat' },
  { keys: ['Enter'], label: 'Send message' },
  { keys: ['⇧', 'Enter'], label: 'New line' },
  { keys: ['Esc'], label: 'Close overlay' },
];
