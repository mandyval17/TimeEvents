import '@tensorflow/tfjs-backend-cpu';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { DailyEvent } from '@prisma/client';

// Initialize TensorFlow model (singleton)
let sentenceEncoder: use.UniversalSentenceEncoder;
export async function loadModel() {
  if (!sentenceEncoder) {
    sentenceEncoder = await use.load();
    console.log('Universal Sentence Encoder loaded');
  }
  return sentenceEncoder;
}

loadModel().catch(err => console.error('Model loading failed:', err));

export class EventMatcher {
  static async computeSimilarity(text1: string, text2: string): Promise<number> {
    // console.log(text1, text2);
    const model = await loadModel();
    const embeddings = await model.embed([text1, text2]);
    const [vec1, vec2] = await embeddings.array() as number[][];
    return this.cosineSimilarity(vec1, vec2);
  }

  static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;

    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      magA += vecA[i] * vecA[i];
      magB += vecB[i] * vecB[i];
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }

  static async isSimilarEvent(newEvent: DailyEvent, existingEvents: DailyEvent[]): Promise<boolean> {
    const SIMILARITY_THRESHOLD = 0.80;

    for (const existing of existingEvents) {

      const similarity = await this.computeSimilarity(
        newEvent.title + ' ' + newEvent.description,
        existing.title + ' ' + existing.description,
      );

      if (similarity > SIMILARITY_THRESHOLD) return true;
    }
    return false;
  }
}