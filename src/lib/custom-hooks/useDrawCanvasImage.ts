import { RefObject, useEffect, useRef, useState } from 'react';

import { CropDimensions } from '../../components/ImageCropFeedback/ImageCropFeedback';

type LoadingStatus = 'idle' | 'loading' | 'resolved';

const onImageLoadPromise = (image: HTMLImageElement, imageUrl: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    image.src = imageUrl;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = (error) => {
      reject(error);
    };
  });
export const useDrawCanvasImage = (
  canvasRef: RefObject<HTMLCanvasElement>,
  { defaultCrop, imageUrl }: { defaultCrop: CropDimensions; imageUrl: string }
): { image: HTMLImageElement; loadingStatus: LoadingStatus } => {
  const imageRef = useRef<HTMLImageElement>(new Image());
  const [loadingStatus, setLoadingStatus] = useState<{ status: LoadingStatus }>({
    status: 'idle',
  });
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');
      const image = imageRef.current;
      setLoadingStatus({ status: 'loading' });
      const draw = async () => {
        const loadedImage = await onImageLoadPromise(image, imageUrl);
        canvas.width = loadedImage.width;
        canvas.height = loadedImage.height;
        if (canvasCtx) {
          canvasCtx.drawImage(loadedImage, 0, 0);
          canvasCtx.strokeStyle = 'white';
          const { right, left, top, bottom } = defaultCrop;
          const cropWidth = right - left;
          const cropHeight = bottom - top;
          canvasCtx.strokeRect(left, top, cropWidth, cropHeight);
          setLoadingStatus({ status: 'resolved' });
        }
      };
      draw();
    }
  }, [imageRef.current, canvasRef.current, top]);
  return { image: imageRef.current, loadingStatus: loadingStatus.status };
};
