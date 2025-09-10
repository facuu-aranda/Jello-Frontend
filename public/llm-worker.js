// Paso 1: Usamos 'import' en lugar de 'importScripts'.
// La librería de Web LLM debe exportar el constructor 'CreateMLCEngine'.
// Asumimos que la librería está configurada para funcionar como un módulo ES.
import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

let engine;

self.onmessage = async (event) => {
  const { type, payload } = event.data;

  if (type === 'load') {
    if (engine) {
      self.postMessage({ type: 'load-complete' });
      return;
    }
    try {
      // Paso 2: Usamos directamente la función importada.
      engine = await CreateMLCEngine("TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC", {
        initProgressCallback: (progress) => {
          self.postMessage({ type: 'load-progress', payload: progress });
        },
      });
      self.postMessage({ type: 'load-complete' });
    } catch (error) {
      self.postMessage({ type: 'load-error', payload: error.message });
    }
  }

  if (type === 'chat') {
    if (!engine) {
      self.postMessage({ type: 'chat-error', payload: "Engine not initialized." });
      return;
    }
    try {
      const chunks = await engine.chat.completions.create({
        messages: [{ role: "user", content: payload.prompt }],
        stream: true,
      });
      for await (const chunk of chunks) {
        self.postMessage({ type: 'chat-chunk', payload: chunk.choices[0]?.delta?.content || "" });
      }
      self.postMessage({ type: 'chat-complete' });
    } catch (error) {
      self.postMessage({ type: 'chat-error', payload: error.message });
    }
  }
};