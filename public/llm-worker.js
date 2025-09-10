// Importamos la librería de WebLLM dentro del worker
self.importScripts("https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm/dist/web-llm.js");

let engine;

// Escuchamos los mensajes que llegan desde el componente de React
self.onmessage = async (event) => {
  const { type, payload } = event.data;

  // --- Comando para cargar el modelo ---
  if (type === 'load') {
    if (engine) {
      self.postMessage({ type: 'load-complete' });
      return;
    }

    try {
      engine = await self.MLCEngine.CreateMLCEngine("TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC", {
        initProgressCallback: (progress) => {
          // Enviamos el progreso de vuelta al componente
          self.postMessage({ type: 'load-progress', payload: progress });
        },
      });
      // Avisamos que el motor está listo
      self.postMessage({ type: 'load-complete' });
    } catch (error) {
      self.postMessage({ type: 'load-error', payload: error.message });
    }
  }

  // --- Comando para generar una respuesta del chat ---
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

      // Enviamos cada trozo de la respuesta (stream) de vuelta
      for await (const chunk of chunks) {
        self.postMessage({ type: 'chat-chunk', payload: chunk.choices[0]?.delta?.content || "" });
      }
      // Avisamos que la respuesta terminó
      self.postMessage({ type: 'chat-complete' });

    } catch (error) {
      self.postMessage({ type: 'chat-error', payload: error.message });
    }
  }
};