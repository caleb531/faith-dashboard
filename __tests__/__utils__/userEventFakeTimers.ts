import userEvent from '@testing-library/user-event';

// Wrap the userEvent library to auto-advance fake timers; this only works when
// fake timers are currently enabled, otherwise you will receive a warning
// (source:
// <https://stackoverflow.com/questions/71901237/fake-timers-doesnt-work-with-latest-version-of-user-event>)
export default userEvent.setup({
  advanceTimers: () => jest.runOnlyPendingTimers()
});
