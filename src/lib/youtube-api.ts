// YouTube API service for music search
// You'll need to get an API key from the Google Cloud Console:
// https://console.cloud.google.com/apis/credentials

// Replace this with your actual API key
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

// YouTube API response types
interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
}

interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

interface YouTubeDetailsResponse {
  items: YouTubeDetailItem[];
}

interface YouTubeDetailItem {
  id: string;
  contentDetails: {
    duration: string;
  };
}

export interface YouTubeSearchResult {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  duration: string; // This will require a separate API call to get video details
  videoId: string;
}

/**
 * Search for music videos on YouTube
 * @param query Search query
 * @param maxResults Maximum number of results to return (default: 10)
 * @returns Array of YouTube search results
 */
export async function searchYouTubeVideos(query: string, maxResults = 10): Promise<YouTubeSearchResult[]> {
  try {
    // First, search for videos
    const searchResponse = await fetch(
      `${YOUTUBE_API_URL}/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(
        query + ' music'
      )}&type=video&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    );

    if (!searchResponse.ok) {
      throw new Error(`YouTube API search error: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json() as YouTubeSearchResponse;

    // Extract video IDs for content details request (to get durations)
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');

    // Get video details including duration
    const detailsResponse = await fetch(
      `${YOUTUBE_API_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    );

    if (!detailsResponse.ok) {
      throw new Error(`YouTube API details error: ${detailsResponse.statusText}`);
    }

    const detailsData = await detailsResponse.json() as YouTubeDetailsResponse;

    // Map the results to our interface
    return searchData.items.map(item => {
      // Find matching details for this video
      const details = detailsData.items.find(detail => detail.id === item.id.videoId);

      // Convert ISO 8601 duration to readable format (PT1H2M3S → 1:02:03)
      let duration = 'Unknown';
      if (details && details.contentDetails && details.contentDetails.duration) {
        duration = formatDuration(details.contentDetails.duration);
      }

      return {
        id: `yt-${item.id.videoId}`,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        duration,
        videoId: item.id.videoId,
      };
    });
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return [];
  }
}

/**
 * Format ISO 8601 duration to readable format
 * @param isoDuration ISO 8601 duration string (e.g., PT1H2M3S)
 * @returns Formatted duration string (e.g., 1:02:03)
 */
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return 'Unknown';

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

/**
 * Get YouTube video thumbnail URL
 * @param videoId YouTube video ID
 * @returns URL to the video thumbnail
 */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

/**
 * Get YouTube video URL
 * @param videoId YouTube video ID
 * @returns URL to the YouTube video
 */
export function getYouTubeVideoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
