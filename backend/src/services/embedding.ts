import { Ollama } from 'ollama';

const client = new Ollama({
  host: 'http://ollama:11434'
});

export class EmbedChunk {

  private embeddingSingleChunk = async (chunk: string): Promise<number[]> => {
    try {
      const response = await client.embed({
        model: 'nomic-embed-text',
        input: chunk,
      });

      return response.embeddings[0];

    } catch (error) {
      throw new Error(`Error while embedding single chunk. ${error}`);
    }
  };

  public embeddingChunks = async (chunks: string[]): Promise<number[][]> => {
    try {
      return await Promise.all(
        chunks.map(chunk => this.embeddingSingleChunk(chunk))
      );
    } catch (error) {
      throw new Error(`Error while embedding chunks. ${error}`);
    }
  };
}