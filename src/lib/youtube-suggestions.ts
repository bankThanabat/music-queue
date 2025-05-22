/**
 * YouTube search suggestions service
 * Uses our server-side API route to avoid CORS issues
 */

/**
 * Get search suggestions from YouTube via our API route
 * @param query The current search query
 * @returns Array of suggestion strings
 */
export async function getYouTubeSuggestions(query: string): Promise<string[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    // Use our Next.js API route to avoid CORS issues
    const response = await fetch(`/api/youtube-suggestions?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.suggestions || [];
  } catch (error) {
    console.error('Error fetching YouTube suggestions:', error);

    // Return some fallback suggestions in case the API fails
    return [
      `${query} song`,
      `${query} music`,
      `${query} lyrics`,
    ];
  }
}
