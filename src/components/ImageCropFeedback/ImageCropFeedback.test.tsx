import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import ImageCropFeedback from './ImageCropFeedback';

describe('Image crop feedback', () => {
  const onAreaSelect = jest.fn();
  const imageUrl = 'https://placekitten.com/600/600';
  const defaultCrop = {
    top: 100,
    left: 200,
    right: 400,
    bottom: 400,
  };

  test('renders image Crop feedback', () => {
    const { getByRole } = render(
      <ImageCropFeedback
        imageUrl={imageUrl}
        defaultCrop={defaultCrop}
        onAreaSelect={onAreaSelect}
      />
    );
    const canvas = getByRole('img');
    expect(canvas).toBeInTheDocument();
    userEvent.click(canvas);
    expect(onAreaSelect).toHaveBeenCalled();
    userEvent.click(canvas);
    expect(onAreaSelect).toHaveBeenCalled();
  });
});
