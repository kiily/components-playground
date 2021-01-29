import './App.scss';

import React, { useState } from 'react';

import ImageCropFeedback, {
  PartialCropDimensions,
} from './components/ImageCropFeedback/ImageCropFeedback';

const App: React.FC = () => {
  const [cropDimensions, setCropDimensions] = useState<PartialCropDimensions>({});
  const onAreaSelected = (cropDimensions: PartialCropDimensions) => {
    setCropDimensions(cropDimensions);
  };
  return (
    <div className="App">
      <header className="App-header">
        <ImageCropFeedback
          imageUrl={'https://placekitten.com/600/600'}
          defaultCrop={{
            top: 100,
            left: 200,
            right: 400,
            bottom: 400,
          }}
          onAreaSelect={onAreaSelected}
          cropDimensions={cropDimensions}
        />
      </header>
    </div>
  );
};

export default App;
