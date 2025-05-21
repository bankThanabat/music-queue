import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get the query parameter from the URL
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }
  
  try {
    // Make the request to YouTube suggestions API using the Firefox client parameter
    // This format tends to work better and provides consistent results
    const response = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(query)}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        // Important: Adding these options to ensure the request works server-side
        cache: 'no-store',
      }
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract just the suggestions array
    // Response format: [query, suggestions[], [], {metadata}]
    let suggestions: string[] = [];
    if (Array.isArray(data) && Array.isArray(data[1])) {
      suggestions = data[1].slice(0, 10); // Get up to 10 suggestions
    }
    
    // Return the suggestions with CORS headers
    return NextResponse.json({ suggestions }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    console.error('Error fetching YouTube suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
