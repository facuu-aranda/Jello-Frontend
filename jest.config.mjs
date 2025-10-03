// Archivo: Jello-Frontend/jest.config.mjs

import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  
  // --- AÑADE ESTE BLOQUE ---
  // Esto le dice a Jest cómo resolver los alias de importación '@/*'
  // mapeándolos a la carpeta raíz del proyecto.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // --- FIN DEL BLOQUE AÑADIDO ---
}

export default createJestConfig(config)