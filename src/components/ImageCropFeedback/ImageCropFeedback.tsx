import React, { useEffect, useRef, useState } from 'react';

import styles from './ImageCropFeedback.module.scss';

type CropDimensions = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

type ImageCropFeedbackProps = CropDimensions & {
  imageUrl: string;
  //   onAreaSelect?: ({ top, left, right, bottom }: CropDimensions) => void;
};

const ImageCropFeedback: React.FC<ImageCropFeedbackProps> = ({
  imageUrl,
  top,
  left,
  right,
  bottom,
}) => {
  const [loadingStatus, setLoadingStatus] = useState<{ status: string }>({
    status: 'idle',
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');
      const image = new Image();
      setLoadingStatus({ status: 'loading' });
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        if (canvasCtx) {
          canvasCtx.drawImage(image, 0, 0);
          const cropWidth = right - left;
          const cropHeight = bottom - top;
          canvasCtx.strokeStyle = 'white';
          canvasCtx.strokeRect(left, top, cropWidth, cropHeight);
          setLoadingStatus({ status: 'resolved' });
        }
      };
      image.src = imageUrl;
    }
  }, [imageUrl, canvasRef.current, top]);

  return (
    <div className={styles.imageCropContainer}>
      <canvas ref={canvasRef}>{loadingStatus.status === 'loading' && 'LOADING IMAGE...'}</canvas>
    </div>
  );
};

export default ImageCropFeedback;
