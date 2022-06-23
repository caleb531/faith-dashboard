import { useEffect, useLayoutEffect } from 'react';

// The useIsomorphicLayoutEffect() hook serves as a workaround to a warning
// React outputs when using useLayoutEffect() in an Server-Side Rendered (SSR)
// context: "useLayoutEffect does nothing on the server, because its effect
// cannot be encoded into the server renderer's output format. This will lead
// to a mismatch between the initial, non-hydrated UI and the intended UI. To
// avoid this, useLayoutEffect should only be used in components that render
// exclusively on the client. See https://reactjs.org/link/uselayouteffect-ssr
// for common fixes."
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
