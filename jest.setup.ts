import '@testing-library/jest-dom';

/** jsdom lacks the browser APIs that MUI and framer-motion probe on mount. */
function installMatchMedia(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
}

class ObserverStub {
  /** Every observer created, so tests can fire their callbacks. */
  static instances: ObserverStub[] = [];
  constructor(readonly callback: (entries: unknown[]) => void = () => {}) {
    ObserverStub.instances.push(this);
  }
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
}

// Server tests (`@jest-environment node`) have no window.
if (typeof window !== 'undefined') {
  installMatchMedia();
  Object.assign(globalThis, {
    IntersectionObserver: ObserverStub,
    ResizeObserver: ObserverStub,
  });
  window.scrollTo = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
  // jsdom has no PointerEvent, so `pointerType` would never reach React handlers.
  if (!('PointerEvent' in window)) {
    class PointerEventPolyfill extends MouseEvent {
      readonly pointerType: string;
      constructor(type: string, init: PointerEventInit = {}) {
        super(type, init);
        this.pointerType = init.pointerType ?? '';
      }
    }
    Object.assign(window, { PointerEvent: PointerEventPolyfill });
  }
  URL.createObjectURL = jest.fn(() => 'blob:preview');
}

export { installMatchMedia, ObserverStub };
