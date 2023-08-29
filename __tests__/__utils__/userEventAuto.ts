import userEvent from '@testing-library/user-event';

// Source:
// <https://stackoverflow.com/questions/71901237/fake-timers-doesnt-work-with-latest-version-of-user-event>
export default userEvent.setup({
  advanceTimers: () => jest.runOnlyPendingTimers()
});
