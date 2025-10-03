
import '@testing-library/jest-dom'
class ResizeObserver {
  observe() {
    // no hacer nada
  }
  unobserve() {
    // no hacer nada
  }
  disconnect() {
    // no hacer nada
  }
}

window.ResizeObserver = ResizeObserver;