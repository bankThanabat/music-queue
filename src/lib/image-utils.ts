/**
 * Utility functions for handling images
 */

/**
 * Returns a fallback image URL if the provided URL is invalid or not found
 * @param url - The original image URL
 * @param width - The width of the fallback image
 * @param height - The height of the fallback image
 * @returns The original URL or a fallback dummy image URL
 */
export function getImageWithFallback(
  url: string | null | undefined,
  width: number = 300,
  height: number = 300
): string {
  // If URL is null, undefined, or empty string, return fallback
  if (!url) {
    return `https://www.dummyimage.com/${width}x${height}/f2f2f2/d1d1d1`;
  }

  // If URL is a placeholder or doesn't start with http/https, return fallback
  if (url.includes("placeholder.svg") || (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/"))) {
    return `https://www.dummyimage.com/${width}x${height}/f2f2f2/d1d1d1`;
  }

  return url;
}

/**
 * Custom Image component with built-in error handling
 * This can be used as an alternative approach if needed
 */
export const imageOnErrorHandler = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = event.target as HTMLImageElement;
  const width = target.width || 300;
  const height = target.height || 300;
  target.src = `https://www.dummyimage.com/${width}x${height}/f2f2f2/d1d1d1`;
  target.onerror = null; // Prevent infinite loop if the fallback also fails
};
