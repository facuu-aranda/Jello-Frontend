// Jello-Frontend/types/globals.d.ts

/**
 * Extiende la interfaz global Window para incluir la API de IA nativa de Chrome,
 * evitando así errores de TypeScript al acceder a `window.ai`.
 */
declare global {
  interface Window {
    ai?: {
      canCreateTextSession: (
        model: string
      ) => Promise<'readily' | 'after-download' | 'no'>;
      createTextSession: () => Promise<AITextSession>;
    };
  }

  /**
   * Define el tipo para la sesión de texto de la IA.
   */
  interface AITextSession {
    promptStreaming: (prompt: string) => AsyncIterable<string>;
    destroy: () => void;
  }
}

// Exportar un objeto vacío asegura que este archivo sea tratado como un módulo.
export {};