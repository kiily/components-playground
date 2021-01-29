import './App.scss';

import React from 'react';

import ImageCropFeedback from './components/ImageCropFeedback/ImageCropFeedback';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <ImageCropFeedback
          imageUrl={'https://placekitten.com/600/600'}
          top={100}
          left={200}
          right={400}
          bottom={400}
        />
      </header>
    </div>
  );
};

export default App;
