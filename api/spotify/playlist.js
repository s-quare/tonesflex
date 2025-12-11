import {decode} from 'html-entities'

// /api/spotify/playlist.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mood } = req.body;
    
    if (!mood || mood.trim() === '') {
      return res.status(400).json({ error: 'Mood is required' });
    }

    //console.log('Generating playlist for mood:', mood);
    
    // Get Spotify access token
    const token = await getSpotifyToken();
    //console.log('Got Spotify token');
    
    // Search for playlists based on mood
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(mood)}&type=playlist&limit=5`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Spotify search error:', searchResponse.status, errorText);
      return res.status(500).json({ 
        error: `Failed to retrieve requested playlists` 
      });
    }
    
    const searchData = await searchResponse.json();

    //console.log(searchData)
    
    // Check if we found playlists
    if (!searchData.playlists?.items?.length) {
      return res.status(404).json({ 
        error: `No playlists found -` 
      });
    }
    
    const playlist = searchData.playlists.items.find(item => item !== null) //.playlists.items[0];
    //console.log('Selected playlist:', playlist.name);

    if (!playlist) {
      return res.status(404).json({
        error: 'No playlist found --'
      })
    }
    
    // Get tracks from the playlist
    const playlistId = playlist.id;
    const tracksResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`, //?limit=15
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (!tracksResponse.ok) {
      return res.status(500).json({ 
        error: 'Failed to fetch playlist tracks' 
      });
    }
    
    const tracksData = await tracksResponse.json();
    
    // Format tracks
    const formattedTracks = [];
    for (const item of tracksData.items.slice(0, 50)) {
      if (item.track) {
        formattedTracks.push({
          id: item.track.id,
          name: decode(item.track.name),
          artist: decode(item.track.artists.map(a => a.name).join(', ')),
          album: decode(item.track.album.name),
          duration: item.track.duration_ms,
          previewUrl: item.track.preview_url,
          spotifyUrl: item.track.external_urls?.spotify || `https://open.spotify.com/track/${item.track.id}`,
          albumArt: item.track.album.images[0]?.url
        });
      }
    }
    
    if (formattedTracks.length === 0) {
      return res.status(404).json({ 
        error: 'Playlist has no available tracks' 
      });
    }
    
    // Create playlist object
    const playlistObject = {
      title: decode(playlist.name) || `${mood} Mix`,
      description: decode(playlist.description) || `A playlist for your "${mood}" mood`,
      coverImage: playlist.images?.[0]?.url,
      tracks: formattedTracks,
      spotifyId: playlist.id,
      spotifyUrl: playlist.external_urls?.spotify || `https://open.spotify.com/playlist/${playlist.id}`
    };
    
    //console.log('Successfully created playlist with', formattedTracks.length, 'tracks');
    
    return res.status(200).json({ 
      success: true, 
      playlist: playlistObject 
    });
    
  } catch (error) {
    console.error('Spotify API Error:', error);
    return res.status(500).json({ 
      error: error
    });
  }
}

// Get Spotify access token 
async function getSpotifyToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('API error. Contact developer');
  }
  
  // Use TextEncoder for Base64 encoding (Node.js compatible)
  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = typeof Buffer !== 'undefined' 
    ? Buffer.from(credentials).toString('base64')
    : btoa(credentials); // Fallback for browser environment
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${encodedCredentials}`
    },
    body: 'grant_type=client_credentials'
  });
  
  if (!response.ok) {
    throw new Error('Server error. Failed to get token');
  }
  
  const data = await response.json();
  return data.access_token;
}