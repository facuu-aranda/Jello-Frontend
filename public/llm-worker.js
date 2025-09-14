import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

let engine;

self.onmessage = async (event) => {
  const { type, payload } = event.data;

  // --- Comando para cargar el modelo (sin cambios) ---
  if (type === 'load') {
    if (engine) {
      self.postMessage({ type: 'load-complete' });
      return;
    }
    try {
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

  // --- Comando de Chat (Ahora recibe un historial) ---
  if (type === 'chat') {
    if (!engine) {
      self.postMessage({ type: 'chat-error', payload: "Engine not initialized." });
      return;
    }
    try {
      const chunks = await engine.chat.completions.create({
        // 👇 CAMBIO CLAVE: Usa el historial completo en lugar de un solo prompt
        messages: payload.history, 
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

  // --- NUEVO COMANDO: Resetear la conversación ---
  if (type === 'reset') {
    if (engine) {
      await engine.reset();
      self.postMessage({ type: 'reset-complete' });
    }
  }
};