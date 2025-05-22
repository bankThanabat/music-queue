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
import { searchYouTubeVideos } from "@/lib/youtube-api"
import { getYouTubeSuggestions } from "@/lib/youtube-suggestions"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import supabase from "@/lib/supabase"
import { Tables } from "@/types/database.types"

export default function SelectSong() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Tables<'songs'>[] | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { data: recentSongs } = useQuery<Tables<'songs'>[]>({
    queryKey: ['recent-songs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      return data;
    },
  });

  // Define the song mutation at the component level
  const songMutation = useMutation({
    mutationFn: async (songData: Tables<'songs'>) => {
      console.log(songData)
      const { data, error } = await supabase
        .from('songs')
        .insert({
          title: songData.title,
          artist: songData.artist,
          cover_url: songData.cover_url,
          duration: songData.duration,
          youtube_id: songData.youtube_id,
          created_at: songData.created_at,
          price: songData.price || 10,
        })
        .select()
        .single();


      if (error) {
        throw error;
      }
      queryClient.invalidateQueries({ queryKey: ['recent-songs'] })
      return data;
    },
    onSuccess: (data) => {
      // Redirect to home page after successful song selection
      router.push(`/payment?songId=${data.id}`);
    },
    onError: (error) => {
      console.error('Error adding song:', error);
      // You could add error handling here, like showing a toast notification
    }
  });

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
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchError(null)
    setShowSuggestions(false)

    try {
      const youtubeResults = await searchYouTubeVideos(searchQuery);

      if (youtubeResults.length === 0) {
        setSearchResults([]);
        setSearchError("No results found. Try a different search term.");
        return;
      }

      const songResults: Tables<'songs'>[] = youtubeResults.map((video) => ({
        id: video.id,
        title: video.title,
        artist: video.channelTitle,
        cover_url: video.thumbnailUrl,
        duration: video.duration,
        price: 10,
        payment_status: 'pending',
        status: 'pending',
        created_at: new Date().toISOString(),
        youtube_id: video.videoId,
      }));

      setSearchResults(songResults);
    } catch (error) {
      console.error('Error searching YouTube:', error);
      setSearchError('Error searching YouTube. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  }

  const handleSelectSong = (song: Tables<'songs'>) => {
    songMutation.mutate(song);
  }

  const renderSongList = (songs: Tables<'songs'>[]) => {
    return (
      <div className="space-y-3">
        {songs.map((song) => (
          <Card key={song.id} className="bg-[#282828] border-[#535353] hover:bg-[#535353] transition-colors">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                {song.youtube_id ? (
                  // YouTube thumbnail for search results
                  <div className="relative w-[50px] h-[50px]">
                    <Image
                      src={song.cover_url}
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
                    src={getImageWithFallback(song.cover_url, 50, 50)}
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
                  <p className="text-sm font-medium text-[#1DB954]">{'10'} บาท</p>
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
        ) : searchResults && searchResults.length > 0 && (
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
          <TabsContent value="recent" className="mt-4">
            {recentSongs ? renderSongList(recentSongs) : (
              <div className="p-4 bg-[#282828] rounded-md border border-[#535353]">
                <p className="text-[#B3B3B3] text-center">Loading recent songs...</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
