export interface Doc {
    id: string;
    name: string;
    title: string;
    pages: number;
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