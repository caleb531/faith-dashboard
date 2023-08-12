import { act, render } from '@testing-library/react';

const fallbackText = 'Loading test...';

export async function renderServerComponent(Element: JSX.Element) {
  await act(async () => {
    render(await Element.type({ ...Element.props }));
  });
}
