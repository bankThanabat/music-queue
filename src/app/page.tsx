"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Music, PlayCircle, ListMusic, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useMobile } from "@/hooks/use-mobile"
import { getImageWithFallback } from "@/lib/image-utils"

interface Song {
  id: string
  title: string
  artist: string
  coverUrl: string
  duration: string
}

export default function Home() {
  const isMobile = useMobile()
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [queue, setQueue] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // This would be replaced with actual API calls
        setCurrentSong({
          id: "1",
          title: "ถ้าเธอรักฉันจริง",
          artist: "Three Man Down",
          coverUrl: "/placeholder.svg?height=300&width=300",
          duration: "3:45",
        })

        setQueue([
          {
            id: "2",
            title: "แปะหัวใจ",
            artist: "Tilly Birds",
            coverUrl: "/placeholder.svg?height=300&width=300",
            duration: "4:12",
          },
          {
            id: "3",
            title: "ทุกอย่าง",
            artist: "Bodyslam",
            coverUrl: "/placeholder.svg?height=300&width=300",
            duration: "4:30",
          },
          {
            id: "4",
            title: "คำถามโง่ๆ",
            artist: "Lomosonic",
            coverUrl: "/placeholder.svg?height=300&width=300",
            duration: "3:55",
          },
        ])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000)

    return () => clearInterval(intervalId)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#191414] text-[#FFFFFF]">
      {/* Header */}
      <div className="w-full bg-[#191414] border-b border-[#282828] p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Music className="h-6 w-6 text-[#1DB954]" />
          <h1 className="text-xl font-bold text-[#FFFFFF]">MusicQueue</h1>
        </div>
        <Link href="/select">
          <Button className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-[#FFFFFF]" size={isMobile ? "sm" : "default"}>
            <QrCode className="h-4 w-4 mr-2" />
            เลือกเพลง
          </Button>
        </Link>
      </div>

      {/* Current Playing */}
      {currentSong && (
        <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2 text-[#FFFFFF]">กำลังเล่น</h2>
          <div className="relative w-full aspect-square mb-4">
            <Image
              src={getImageWithFallback(currentSong.coverUrl, 300, 300)}
              alt={currentSong.title}
              fill
              className="object-cover rounded-lg shadow-lg"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
              <PlayCircle className="h-16 w-16 text-[#FFFFFF] opacity-80" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-center text-[#FFFFFF]">{currentSong.title}</h3>
          <p className="text-lg text-[#B3B3B3] text-center">{currentSong.artist}</p>
          <p className="text-sm text-[#B3B3B3] mt-1">{currentSong.duration}</p>
        </div>
      )}

      {/* Queue */}
      <div className="w-full max-w-md mx-auto p-4">
        <div className="flex items-center gap-2 mb-4">
          <ListMusic className="h-5 w-5 text-[#1DB954]" />
          <h2 className="text-xl font-semibold text-[#FFFFFF]">รายการเพลงถัดไป</h2>
        </div>
        <Separator className="mb-4 bg-[#282828]" />

        {queue.length > 0 ? (
          <div className="space-y-3">
            {queue.map((song) => (
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
                    <span className="text-sm text-[#B3B3B3]">{song.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-[#B3B3B3] py-8">ไม่มีเพลงในคิว</p>
        )}

        <div className="mt-6 flex justify-center">
          <Link href="/select">
            <Button className="w-full bg-[#1DB954] hover:bg-[#1DB954]/90 text-[#FFFFFF]">
              <QrCode className="h-4 w-4 mr-2" />
              เพิ่มเพลงในคิว
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
