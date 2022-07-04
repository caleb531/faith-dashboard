const AudioMock = jest.fn().mockImplementation(() => {
  return {
    play: jest.fn(),
    pause: jest.fn(),
    addEventListener: jest
      .fn()
      .mockImplementation((eventType: string, eventCallback: () => void) => {
        if (eventType === 'loadeddata' || eventType === 'loadedmetadata') {
          eventCallback();
        }
      }),
    removeEventListener: jest.fn().mockImplementation(() => {
      /* noop */
    })
  };
});

export default AudioMock;
