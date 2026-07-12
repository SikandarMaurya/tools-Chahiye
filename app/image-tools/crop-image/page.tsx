import { Metadata } from 'next';
import ImageCropperClient from '@/components/image-cropper-client';

export const metadata: Metadata = {
  title: 'Crop Image Online | AI Smart Image Cropper Free',
  description: 'Crop JPG, PNG, WEBP, AVIF and other images online using AI Smart Crop, face detection, social media presets and enterprise-grade processing.',
};

export default function CropImagePage() {
  return <ImageCropperClient />;
}
