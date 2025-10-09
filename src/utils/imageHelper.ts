/**
 * Image helper utilities for safe image loading and fallbacks
 */

export const DEFAULT_IMAGES = {
  placeholder: '/images/placeholder.png',
  avatar: '/images/avatar-placeholder.png',
  logo: '/images/logo-placeholder.svg',
  banner: '/images/banner-placeholder.jpg',
  notFound: '/images/not-found.png',
};

/**
 * Get a safe image URL with fallback
 */
export function getSafeImageUrl(url: string | null | undefined, fallback: string = DEFAULT_IMAGES.placeholder): string {
  if (!url) {
    return fallback;
  }

  // Check if URL is valid
  try {
    // Handle relative URLs
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return url;
    }

    // Handle absolute URLs
    new URL(url);
    return url;
  } catch (error) {
    console.warn(`Invalid image URL: ${url}, using fallback`);
    return fallback;
  }
}

/**
 * Preload an image and return a promise
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = (error) => {
      console.warn(`Failed to preload image: ${src}`);
      reject(error);
    };
    
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export async function preloadImages(sources: string[]): Promise<HTMLImageElement[]> {
  const promises = sources.map(src => preloadImage(src).catch(() => null));
  const results = await Promise.all(promises);
  return results.filter(Boolean) as HTMLImageElement[];
}

/**
 * Check if an image URL is accessible
 */
export async function checkImageExists(url: string): Promise<boolean> {
  try {
    await preloadImage(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get image with automatic fallback chain
 */
export async function getImageWithFallback(
  primaryUrl: string,
  fallbacks: string[] = [DEFAULT_IMAGES.placeholder]
): Promise<string> {
  // Try primary URL
  const primaryExists = await checkImageExists(primaryUrl);
  if (primaryExists) {
    return primaryUrl;
  }

  // Try fallback URLs in order
  for (const fallbackUrl of fallbacks) {
    const exists = await checkImageExists(fallbackUrl);
    if (exists) {
      return fallbackUrl;
    }
  }

  // Return last fallback (even if it doesn't exist)
  return fallbacks[fallbacks.length - 1] || DEFAULT_IMAGES.placeholder;
}

/**
 * Generate a placeholder image URL based on dimensions and text
 */
export function generatePlaceholder(
  width: number = 400,
  height: number = 300,
  text: string = 'Image'
): string {
  // Using a data URI or placeholder service
  const bgColor = '9CA3AF';
  const textColor = 'FFFFFF';
  
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
}

/**
 * Safely get image dimensions
 */
export async function getImageDimensions(url: string): Promise<{ width: number; height: number } | null> {
  try {
    const img = await preloadImage(url);
    return {
      width: img.naturalWidth,
      height: img.naturalHeight,
    };
  } catch {
    return null;
  }
}

/**
 * Create a blob URL from a file with error handling
 */
export function createSafeBlobUrl(file: File | Blob): string | null {
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Failed to create blob URL:', error);
    return null;
  }
}

/**
 * Revoke blob URL safely
 */
export function revokeSafeBlobUrl(url: string): void {
  try {
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to revoke blob URL:', error);
  }
}

/**
 * Convert image to base64 with error handling
 */
export async function imageToBase64(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = (error) => {
      console.error('Failed to convert image to base64:', error);
      resolve(null);
    };
    
    try {
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to read file:', error);
      resolve(null);
    }
  });
}
