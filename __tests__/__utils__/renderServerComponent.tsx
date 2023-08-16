import { act, render } from '@testing-library/react';

function isAsyncFunction(value: any) {
  return Object.prototype.toString.call(value) === '[object AsyncFunction]';
}

async function convertReactTreeToSync(node: JSX.Element) {
  if (!isAsyncFunction(node.type)) {
    return node;
  }
  const nodeReturnValue: JSX.Element = await node.type({ ...node.props });
  return convertReactTreeToSync(nodeReturnValue);
}

// Follow <https://github.com/testing-library/react-testing-library/issues/1209>
// for the latest updates on React Testing Library support for React Server
// Components (RSC)
export async function renderServerComponent(node: JSX.Element) {
  await act(async () => {
    render(await convertReactTreeToSync(node));
  });
}
