import React, { useEffect, useRef, useState } from 'react';

import { useDrawCanvasImage } from '../../lib/custom-hooks';
import styles from './ImageCropFeedback.module.scss';

export type CropDimensions = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export type PartialCropDimensions = Partial<CropDimensions>;

type ImageCropFeedbackProps = {
  defaultCrop: CropDimensions;
  cropDimensions?: PartialCropDimensions;
  imageUrl: string;
  onAreaSelect: ({ top, left, right, bottom }: PartialCropDimensions) => void;
};

const hasAllDimensions = (crop: PartialCropDimensions) =>
  crop.bottom && crop.left && crop.top && crop.right;
const ImageCropFeedback: React.FC<ImageCropFeedbackProps> = ({
  imageUrl,
  defaultCrop,
  cropDimensions,
  onAreaSelect,
}) => {
  const [clickCounter, setClickCounter] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { image, loadingStatus } = useDrawCanvasImage(canvasRef, { defaultCrop, imageUrl });

  useEffect(() => {
    if (canvasRef.current && image && cropDimensions && hasAllDimensions(cropDimensions)) {
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');
      if (canvasCtx) {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.strokeStyle = 'white';
        const { right, left, top, bottom } = cropDimensions as CropDimensions;
        const cropWidth = right - left;
        const cropHeight = bottom - top;
        canvasCtx.drawImage(image, 0, 0);
        canvasCtx.strokeRect(left, top, cropWidth, cropHeight);
      }
    }
  }, [cropDimensions, image, canvasRef.current]);

  const onCanvasClicked = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;
    if (clickCounter === 0) {
      // First click
      onAreaSelect({ top: offsetY, left: offsetX });
      setClickCounter((prevCounter) => prevCounter + 1);
    } else if (clickCounter === 1 && cropDimensions) {
      onAreaSelect({
        top: cropDimensions.top,
        left: cropDimensions.left,
        bottom: offsetY,
        right: offsetX,
      });
      setClickCounter(0);
    }
  };
  return (
    <div className={styles.imageCropContainer}>
      <canvas ref={canvasRef} onClick={onCanvasClicked}>
        {loadingStatus === 'loading' && 'LOADING IMAGE...'}
      </canvas>
    </div>
  );
};

export default ImageCropFeedback;
