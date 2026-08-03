const cookiesObject = {};

export function cookies() {
  return cookiesObject;
}

const headersObject = {
  get: vi.fn(),
  set: vi.fn()
};

export function headers() {
  return headersObject;
}
