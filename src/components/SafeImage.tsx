import React, { useState, ImgHTMLAttributes } from 'react';
import styled from 'styled-components';

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  fallbackComponent?: React.ReactNode;
  onErrorCallback?: (error: any) => void;
}

const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const StyledImage = styled.img<{ $isLoading?: boolean }>`
  opacity: ${props => props.$isLoading ? 0.7 : 1};
  transition: opacity 0.3s ease;
  width: 100%;
  height: auto;
`;

const FallbackContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  color: var(--text-muted);
  min-height: 200px;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  font-size: 14px;
`;

const DefaultFallback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  
  svg {
    width: 48px;
    height: 48px;
    opacity: 0.5;
  }
`;

const defaultFallbackImage = '/images/placeholder.png';

/**
 * SafeImage component that gracefully handles image loading errors
 * 
 * @param src - Primary image source URL
 * @param alt - Alternative text for the image
 * @param fallbackSrc - Optional fallback image URL if primary fails
 * @param fallbackComponent - Optional React component to show if all images fail
 * @param onErrorCallback - Optional callback function when image fails to load
 */
export default function SafeImage({
  src,
  alt,
  fallbackSrc = defaultFallbackImage,
  fallbackComponent,
  onErrorCallback,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [attemptedFallback, setAttemptedFallback] = useState(false);

  const handleError = (error: any) => {
    console.warn(`Failed to load image: ${currentSrc}`, error);
    
    // Call the error callback if provided
    if (onErrorCallback) {
      onErrorCallback(error);
    }

    // Try fallback image if available and not already attempted
    if (fallbackSrc && !attemptedFallback) {
      console.log(`Trying fallback image: ${fallbackSrc}`);
      setCurrentSrc(fallbackSrc);
      setAttemptedFallback(true);
      setIsLoading(true);
    } else {
      // Show fallback component
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // If all image sources failed, show fallback component or default
  if (hasError) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    return (
      <FallbackContainer>
        <DefaultFallback>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{alt || 'Image unavailable'}</span>
        </DefaultFallback>
      </FallbackContainer>
    );
  }

  return (
    <ImageContainer>
      <StyledImage
        {...props}
        src={currentSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        $isLoading={isLoading}
      />
    </ImageContainer>
  );
}

/**
 * SafeBackgroundImage - Component for background images with error handling
 */
export const SafeBackgroundImage = styled.div<{
  $src: string;
  $fallbackSrc?: string;
}>`
  background-image: url(${props => props.$src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--bg-tertiary);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &[data-error="true"]::before {
    opacity: 1;
  }
`;
