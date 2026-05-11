const BASE = '/api/v1';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData;
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(init?.headers || {}),
    },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Request failed');
  return json.data as T;
}

export interface User {
  id: string;
  email: string;
  account_id: string;
  first_name: string;
  last_name: string;
}

export interface ApiDoc {
  id: string;
  name: string;
  size: number | null;
  pages: number | null;
  account_id: string | null;
  createdAt: string;
  _count: { chunks: number };
}

export interface ApiCitation {
  document_id: string;
  page: number | null;
  content: string;
  similarity: number;
}

export interface QueryResult {
  answer: string;
  citations: ApiCitation[];
}

export const login = (email: string, password: string) =>
  request<{ user: User; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const logout = () =>
  request<null>('/auth/logout', { method: 'POST' });

export const register = (data: { first_name: string; last_name: string; email: string; password: string }) =>
  request<{ user: User; account: { id: string } }>('/user', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const listDocuments = (account_id: string) =>
  request<ApiDoc[]>(`/account/${account_id}/documents`);

export const ingestDocument = (account_id: string, file: File) => {
  const form = new FormData();
  form.append('file', file);
  form.append('name', file.name);
  return request<{ document_id: string }>(`/account/${account_id}/ingest`, {
    method: 'POST',
    body: form,
  });
};

export const deleteDocument = (account_id: string, doc_id: string) =>
  request<null>(`/account/${account_id}/documents/${doc_id}`, { method: 'DELETE' });

export const queryDocuments = (account_id: string, prompt: string, doc_id?: string | null) =>
  request<QueryResult>(`/account/${account_id}/query`, {
    method: 'POST',
    body: JSON.stringify({ prompt, doc_id: doc_id || null }),
  });
