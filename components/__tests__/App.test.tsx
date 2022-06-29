import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Home from '../../pages/index';

it('should render', function () {
  const { getByText } = render(<Home />);
  expect(getByText('Faith Dashboard')).toBeInTheDocument();
});
