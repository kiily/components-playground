import { render } from '@testing-library/react';
import React from 'react';

import App from './App';

test('renders image Crop feedback', () => {
  const { getByText } = render(<App />);
  const spanElement = getByText(/image Crop feedback/i);
  expect(spanElement).toBeInTheDocument();
});
