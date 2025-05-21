"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Music, Search, ArrowLeft, Clock, ThumbsUp, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getImageWithFallback } from "@/lib/image-utils"
import { searchYouTubeVideos, YouTubeSearchResult, getYouTubeThumbnail } from "@/lib/youtube-api"
import { getYouTubeSuggestions } from "@/lib/youtube-suggestions"

interface Song {
  id: string
  title: string
  artist: string
  coverUrl: string
  duration: string
  price: number
  videoId?: string // YouTube video ID for linking to the actual video
}

export default function SelectSong() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Song[]>([])
  const [searchError, setSearchError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const popularSongs: Song[] = [
    {
      id: "p1",
      title: "ภักดี",
      artist: "COCKTAIL",
      coverUrl: "/placeholder.svg?height=300&width=300",
      duration: "4:23",
      price: 10,
    },
    {
      id: "p2",
      title: "แฟนเก่า",
      artist: "COCKTAIL",
      coverUrl: "/placeholder.svg?height=300&width=300",
      duration: "4:05",
      price: 10,
    },
    {
      id: "p3",
      title: "ใจเดียว",
      artist: "Tilly Birds",
      coverUrl: "/placeholder.svg?height=300&width=300",
      duration: "3:50",
      price: 10,
    },
    {
      id: "p4",
      title: "ไม่เป็นไร",
      artist: "Lomosonic",
      coverUrl: "/placeholder.svg?height=300&width=300",
      duration: "4:12",
      price: 10,
    },
    {
      id: "p5",
      title: "เพื่อนเล่น ไม่เล่นเพื่อน",
      artist: "Three Man Down",
      coverUrl: "/placeholder.svg?height=300&width=300",
      duration: "3:45",
      price: 10,
    },
  ]

  const recentSongs: Song[] = [
    {
      id: "r1",
      title: "ถ้าเธอรักฉันจริง",
      artist: "Three Man Down",
      coverUrl: "/placeholder.svg?height=300&width=300",
      duration: "3:45",
      price: 10,
    },
    {
      id: "r2",
      title: "แปะหัวใจ",
      artist: "Tilly Birds",
      coverUrl: "/placeholder.svg?height=300&width=300",
      duration: "4:12",
      price: 10,
    },
    {
      id: "r3",
      title: "ทุกอย่าง",
      artist: "Bodyslam",
      coverUrl: "/placeholder.svg?height=300&width=300",
      duration: "4:30",
      price: 10,
    },
  ]

  // Handle click outside suggestions to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const results = await getYouTubeSuggestions(searchQuery);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

    // Debounce the suggestions to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchError(null)
    setShowSuggestions(false)

    try {
      // Search YouTube for music videos
      const youtubeResults = await searchYouTubeVideos(searchQuery);
      
      if (youtubeResults.length === 0) {
        setSearchResults([]);
        setSearchError("No results found. Try a different search term.");
        return;
      }
      
      // Convert YouTube results to our Song format
      const songResults = youtubeResults.map((video) => ({
        id: video.id,
        title: video.title,
        artist: video.channelTitle,
        coverUrl: video.thumbnailUrl,
        duration: video.duration,
        price: 10, // Default price - could be dynamic based on video length or other factors
        videoId: video.videoId,
      }));

      setSearchResults(songResults);
    } catch (error) {
      console.error('Error searching YouTube:', error);
      setSearchError('Error searching YouTube. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  }

  const handleSelectSong = (song: Song) => {
    // Navigate to payment page with song details
    router.push(
      `/payment?songId=${song.id}&title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}&price=${song.price}`,
    )
  }

  const renderSongList = (songs: Song[]) => {
    return (
      <div className="space-y-3">
        {songs.map((song) => (
          <Card key={song.id} className="bg-[#282828] border-[#535353] hover:bg-[#535353] transition-colors">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                {song.videoId ? (
                  // YouTube thumbnail for search results
                  <div className="relative w-[50px] h-[50px]">
                    <Image
                      src={song.coverUrl}
                      alt={song.title}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                    <div className="absolute bottom-1 right-1">
                      <Youtube className="h-3 w-3 text-[#FF0000]" />
                    </div>
                  </div>
                ) : (
                  // Regular image for non-YouTube songs
                  <Image
                    src={getImageWithFallback(song.coverUrl, 50, 50)}
                    alt={song.title}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[#FFFFFF] truncate">{song.title}</h3>
                  <p className="text-sm text-[#B3B3B3] truncate">{song.artist}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#B3B3B3]">{song.duration}</p>
                  <p className="text-sm font-medium text-[#1DB954]">{song.price} บาท</p>
                </div>
                <Button size="sm" onClick={() => handleSelectSong(song)} className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-[#FFFFFF]">
                  เลือก
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#191414] text-[#FFFFFF]">
      {/* Header */}
      <div className="w-full bg-[#191414] border-b border-[#282828] p-4 flex items-center gap-2 sticky top-0 z-10">
        <Link href="/">
          <Button className="hover:bg-[#282828] text-[#FFFFFF]" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-[#1DB954]" />
          <h1 className="text-xl font-bold text-[#FFFFFF]">เลือกเพลง</h1>
        </div>
      </div>

      {/* Search */}
      <div className="w-full max-w-md mx-auto p-4">
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              placeholder="ค้นหาเพลงจาก YouTube"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="bg-[#282828] border-[#535353] text-[#FFFFFF] focus-visible:ring-[#1DB954]/50 w-full"
            />
            
            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-20 mt-1 w-full bg-[#282828] border border-[#535353] rounded-md shadow-lg overflow-hidden"
              >
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 hover:bg-[#535353] cursor-pointer flex items-center gap-2 text-[#FFFFFF]"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setShowSuggestions(false);
                      handleSearch();
                    }}
                  >
                    <Search className="h-4 w-4 text-[#B3B3B3]" />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button onClick={handleSearch} disabled={isSearching} className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-[#FFFFFF]">
            {isSearching ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {searchError ? (
          <div className="mb-6 p-4 bg-[#282828] rounded-md border border-[#535353]">
            <p className="text-[#B3B3B3] text-center">{searchError}</p>
          </div>
        ) : searchResults.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Youtube className="h-5 w-5 text-[#FF0000]" />
              <h2 className="text-lg font-semibold text-[#FFFFFF]">ผลการค้นหาจาก YouTube</h2>
            </div>
            {renderSongList(searchResults)}
          </div>
        )}

        <Tabs defaultValue="popular">
          <TabsList className="grid w-full grid-cols-2 bg-[#282828]">
            <TabsTrigger value="popular" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-[#FFFFFF] text-[#B3B3B3]">
              <ThumbsUp className="h-4 w-4 mr-2" />
              ยอดนิยม
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-[#FFFFFF] text-[#B3B3B3]">
              <Clock className="h-4 w-4 mr-2" />
              เล่นล่าสุด
            </TabsTrigger>
          </TabsList>
          <TabsContent value="popular" className="mt-4">
            {renderSongList(popularSongs)}
          </TabsContent>
          <TabsContent value="recent" className="mt-4">
            {renderSongList(recentSongs)}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
