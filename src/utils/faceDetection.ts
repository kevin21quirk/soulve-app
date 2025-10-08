import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export const loadFaceDetectionModels = async () => {
  if (modelsLoaded) return;
  
  try {
    // Load models from jsDelivr CDN
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model';
    
    console.log('Loading face detection models from CDN...');
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    
    modelsLoaded = true;
    console.log('✓ Face detection models loaded successfully');
  } catch (error) {
    console.error('Error loading face detection models:', error);
    throw new Error('Failed to load face detection models. Please check your internet connection.');
  }
};

export interface FaceDetectionResult {
  detected: boolean;
  qualityScore: number;
  embedding?: number[];
  landmarks?: any;
  error?: string;
}

export const detectFaceInImage = async (
  imageElement: HTMLImageElement
): Promise<FaceDetectionResult> => {
  try {
    await loadFaceDetectionModels();
    
    const detection = await faceapi
      .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    if (!detection) {
      return {
        detected: false,
        qualityScore: 0,
        error: 'No face detected in image'
      };
    }
    
    // Calculate quality score based on detection confidence
    const qualityScore = Math.min(detection.detection.score * 100, 100);
    
    return {
      detected: true,
      qualityScore: Math.round(qualityScore * 100) / 100,
      embedding: Array.from(detection.descriptor),
      landmarks: detection.landmarks,
    };
  } catch (error) {
    console.error('Error detecting face:', error);
    return {
      detected: false,
      qualityScore: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const compareFaces = (
  embedding1: number[],
  embedding2: number[]
): number => {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must be the same length');
  }
  
  // Calculate Euclidean distance
  const distance = faceapi.euclideanDistance(embedding1, embedding2);
  
  // Convert distance to similarity score (0-1)
  // Typical threshold for face matching is around 0.6
  // Lower distance = higher similarity
  const similarity = Math.max(0, 1 - distance);
  
  return Math.round(similarity * 100) / 100;
};

export interface LivenessCheckResult {
  passed: boolean;
  checks: {
    faceDetected: boolean;
    multipleFaces: boolean;
    sufficientQuality: boolean;
  };
  score: number;
}

export const performBasicLivenessCheck = async (
  imageElement: HTMLImageElement
): Promise<LivenessCheckResult> => {
  try {
    await loadFaceDetectionModels();
    
    // Detect all faces in the image
    const detections = await faceapi
      .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    
    const faceDetected = detections.length === 1;
    const multipleFaces = detections.length > 1;
    const sufficientQuality = detections.length === 1 && detections[0].detection.score > 0.5;
    
    const checks = {
      faceDetected,
      multipleFaces: !multipleFaces, // Pass if NOT multiple faces
      sufficientQuality,
    };
    
    const passed = faceDetected && !multipleFaces && sufficientQuality;
    const score = passed ? detections[0].detection.score : 0;
    
    return {
      passed,
      checks,
      score: Math.round(score * 100) / 100,
    };
  } catch (error) {
    console.error('Error performing liveness check:', error);
    return {
      passed: false,
      checks: {
        faceDetected: false,
        multipleFaces: false,
        sufficientQuality: false,
      },
      score: 0,
    };
  }
};

export const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
};

export const loadImageFromUrl = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image from URL'));
    img.src = url;
  });
};
