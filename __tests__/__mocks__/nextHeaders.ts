export function cookies() {
  return {};
}

export function headers() {
  return {
    get: jest.fn(),
    set: jest.fn()
  };
}

export default {
  cookies,
  headers
};
