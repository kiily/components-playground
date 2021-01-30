import React, { useEffect, useRef, useState } from 'react';

import { useDrawCanvasImage } from '../../lib/custom-hooks';
import { hasAllDimensions } from '../../lib/utils';
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
  onAreaSelect: ({ top, left, right, bottom }: PartialCropDimensions, cropData?: string) => void;
};

const ImageCropFeedback: React.FC<ImageCropFeedbackProps> = ({
  imageUrl,
  defaultCrop,
  cropDimensions,
  onAreaSelect,
}) => {
  const [clickCounter, setClickCounter] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCropCanvasRef = useRef<HTMLCanvasElement>(null);

  const { image, loadingStatus } = useDrawCanvasImage(canvasRef, { crop: defaultCrop, imageUrl });

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
      const selectedArea = {
        top: cropDimensions.top,
        left: cropDimensions.left,
        bottom: offsetY,
        right: offsetX,
      } as CropDimensions;
      setClickCounter(0);
      const tempCanvas = tempCropCanvasRef.current;
      // At this point here we can draw the crop
      if (tempCanvas && canvasRef.current) {
        const canvasCtx = tempCanvas.getContext('2d');
        canvasCtx?.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

        const height = selectedArea.bottom - selectedArea.top;
        const width = selectedArea.right - selectedArea.left;

        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
        canvasCtx?.drawImage(
          image,
          // Make up for the negative values
          width >= 0 ? selectedArea.left : selectedArea.right,
          height >= 0 ? selectedArea.top : selectedArea.bottom,
          Math.abs(width),
          Math.abs(height),
          0,
          0,
          Math.abs(width),
          Math.abs(height)
        );
        const dataUrl = tempCanvas.toDataURL();
        onAreaSelect(selectedArea, dataUrl);
      }
    }
  };
  return (
    <div className={styles.imageCropContainer}>
      <canvas ref={canvasRef} onClick={onCanvasClicked} />
      <canvas hidden ref={tempCropCanvasRef} width={500} height={500} style={{ opacity: 0 }} />
      {loadingStatus === 'loading' && 'LOADING IMAGE...'}
    </div>
  );
};

export default ImageCropFeedback;
