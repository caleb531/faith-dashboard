import { act, render } from '@testing-library/react';

// Follow <https://github.com/testing-library/react-testing-library/issues/1209>
// for the latest updates on React Testing Library support for React Server
// Components (RSC)
export async function renderServerComponent(node: JSX.Element) {
  await act(async () => {
    render(await node.type({ ...node.props }));
  });
}
