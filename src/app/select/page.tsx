"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Music, Search, ArrowLeft, Clock, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getImageWithFallback } from "@/lib/image-utils"

interface Song {
  id: string
  title: string
  artist: string
  coverUrl: string
  duration: string
  price: number
}

export default function SelectSong() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Song[]>([])

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

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate API call to search for songs
    setTimeout(() => {
      const results = [
        {
          id: "s1",
          title: searchQuery,
          artist: "Various Artists",
          coverUrl: "/placeholder.svg?height=300&width=300",
          duration: "3:30",
          price: 10,
        },
        {
          id: "s2",
          title: `${searchQuery} (Remix)`,
          artist: "DJ Mix",
          coverUrl: "/placeholder.svg?height=300&width=300",
          duration: "4:15",
          price: 15,
        },
        {
          id: "s3",
          title: `${searchQuery} feat. Artist`,
          artist: "Collaboration",
          coverUrl: "/placeholder.svg?height=300&width=300",
          duration: "3:45",
          price: 10,
        },
      ]

      setSearchResults(results)
      setIsSearching(false)
    }, 1000)
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
                <Image
                  src={getImageWithFallback(song.coverUrl, 50, 50)}
                  alt={song.title}
                  width={50}
                  height={50}
                  className="rounded-md"
                />
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
          <Input
            placeholder="ค้นหาเพลง หรือ ศิลปิน"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#282828] border-[#535353] text-[#FFFFFF] focus-visible:ring-[#1DB954]/50"
          />
          <Button onClick={handleSearch} disabled={isSearching} className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-[#FFFFFF]">
            {isSearching ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-[#FFFFFF]">ผลการค้นหา</h2>
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
