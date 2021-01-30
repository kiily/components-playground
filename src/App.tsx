import './App.scss';

import React, { useState } from 'react';

import ImageCropFeedback, {
  PartialCropDimensions,
} from './components/ImageCropFeedback/ImageCropFeedback';

const imageUrl = 'https://placekitten.com/600/600';
const defaultCrop = {
  top: 100,
  left: 200,
  right: 400,
  bottom: 400,
};

const App: React.FC = () => {
  const [cropDimensions, setCropDimensions] = useState<PartialCropDimensions>({});
  const [resultSrc, setResultSrc] = useState<string>();
  const onAreaSelected = (cropDimensions: PartialCropDimensions, cropData?: string) => {
    setCropDimensions(cropDimensions);
    setResultSrc(cropData);
  };

  return (
    <div className="App">
      <ImageCropFeedback
        imageUrl={imageUrl}
        defaultCrop={defaultCrop}
        onAreaSelect={onAreaSelected}
        cropDimensions={cropDimensions}
      />

      {resultSrc && (
        <div className="App-crop-result-container">
          <span>Result:</span>
          <img src={resultSrc} />
        </div>
      )}
    </div>
  );
};

export default App;
