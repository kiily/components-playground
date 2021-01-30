import { PartialCropDimensions } from '../components/ImageCropFeedback/ImageCropFeedback';

export const hasAllDimensions = (crop: PartialCropDimensions): boolean =>
  !!(crop.bottom && crop.left && crop.top && crop.right);
