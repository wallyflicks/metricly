import axios from 'axios'

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

export interface YouTubeChannelData {
  channelId: string
  title: string
  description: string
  thumbnail: string
  subscribers: number
  totalViews: number
  totalVideos: number
}

export interface YouTubeVideoMetrics {
  videoId: string
  title: string
  views: number
  likes: number
  comments: number
}

export const fetchYouTubeChannelData = async (
  apiKey: string
): Promise<YouTubeChannelData> => {
  try {
    // Get authenticated user's channel
    const channelResponse = await axios.get(`${YOUTUBE_API_BASE}/channels`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        mine: true,
        key: apiKey,
      },
    })

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      throw new Error('No channel found')
    }

    const channel = channelResponse.data.items[0]
    const stats = channel.statistics

    return {
      channelId: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnail: channel.snippet.thumbnails.default.url,
      subscribers: parseInt(stats.subscriberCount || 0),
      totalViews: parseInt(stats.viewCount || 0),
      totalVideos: parseInt(stats.videoCount || 0),
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`YouTube API Error: ${error.response?.data?.error?.message || error.message}`)
    }
    throw error
  }
}

export const fetchYouTubeVideoMetrics = async (
  apiKey: string,
  limit: number = 10
): Promise<YouTubeVideoMetrics[]> => {
  try {
    // Get user's uploads playlist
    const uploadsResponse = await axios.get(`${YOUTUBE_API_BASE}/channels`, {
      params: {
        part: 'contentDetails',
        mine: true,
        key: apiKey,
      },
    })

    const uploadsPlaylistId = uploadsResponse.data.items[0].contentDetails.relatedPlaylists.uploads

    // Get videos from uploads playlist
    const videosResponse = await axios.get(`${YOUTUBE_API_BASE}/playlistItems`, {
      params: {
        part: 'snippet',
        playlistId: uploadsPlaylistId,
        maxResults: Math.min(limit, 50),
        key: apiKey,
      },
    })

    const videoIds = videosResponse.data.items.map(
      (item: any) => item.snippet.resourceId.videoId
    )

    if (videoIds.length === 0) return []

    // Get video statistics
    const statsResponse = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        part: 'statistics,snippet',
        id: videoIds.join(','),
        key: apiKey,
      },
    })

    return statsResponse.data.items.map((video: any) => ({
      videoId: video.id,
      title: video.snippet.title,
      views: parseInt(video.statistics.viewCount || 0),
      likes: parseInt(video.statistics.likeCount || 0),
      comments: parseInt(video.statistics.commentCount || 0),
    }))
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`YouTube API Error: ${error.response?.data?.error?.message || error.message}`)
    }
    throw error
  }
}
