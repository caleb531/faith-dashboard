const cookiesObject = {};

export function cookies() {
  return cookiesObject;
}

const headersObject = {
  get: jest.fn(),
  set: jest.fn()
};

export function headers() {
  return headersObject;
}
