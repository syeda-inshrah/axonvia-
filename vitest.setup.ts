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
