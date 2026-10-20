import '@testing-library/jest-dom/vitest'

// jsdom has no IntersectionObserver; Framer Motion's whileInView needs one to mount.
// A no-op stub is enough: tests assert rendered content, not reveal animations.
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: IntersectionObserverStub })
  Object.defineProperty(globalThis, 'IntersectionObserver', { writable: true, value: IntersectionObserverStub })
}

// jsdom has no matchMedia; GSAP's ScrollTrigger calls it when registered. Matching nothing keeps every
// motion-gated animation off, so tests see the finished, static page. Tests may still replace it.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent: () => false,
    }),
  })
}

// jsdom has no canvas; NeuralCore checks for a 2D context and draws nothing without one. Returning null here
// instead of jsdom's "not implemented" keeps test output quiet.
if (typeof HTMLCanvasElement !== 'undefined') {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', { configurable: true, writable: true, value: () => null })
}
