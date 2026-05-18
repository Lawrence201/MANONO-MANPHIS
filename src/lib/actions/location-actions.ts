"use server";

/**
 * Resolves a shortened Google Maps URL to its full destination
 * to extract coordinates from the final redirect URL.
 */
export async function resolveGoogleMapsLink(shortUrl: string) {
  try {
    // Follow redirects automatically to get the final destination URL
    const response = await fetch(shortUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    return { 
      success: true, 
      url: response.url 
    };
  } catch (error) {
    console.error('Failed to resolve Google Maps link:', error);
    return { success: false, error: 'Could not resolve the link' };
  }
}
