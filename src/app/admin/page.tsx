"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Music, ListMusic, Play, Pause, SkipForward, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Song {
  id: string
  title: string
  artist: string
  coverUrl: string
  duration: string
  requestedBy?: string
  requestedAt?: string
}

interface Transaction {
  id: string
  songTitle: string
  amount: number
  customerName: string
  timestamp: string
}

export default function AdminPanel() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [queue, setQueue] = useState<Song[]>([])
  const [history, setHistory] = useState<Song[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
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
          requestedBy: "โต๊ะ 5",
          requestedAt: "17:20",
        })

        setQueue([
          {
            id: "2",
            title: "แปะหัวใจ",
            artist: "Tilly Birds",
            coverUrl: "/placeholder.svg?height=300&width=300",
            duration: "4:12",
            requestedBy: "โต๊ะ 3",
            requestedAt: "17:22",
          },
          {
            id: "3",
            title: "ทุกอย่าง",
            artist: "Bodyslam",
            coverUrl: "/placeholder.svg?height=300&width=300",
            duration: "4:30",
            requestedBy: "โต๊ะ 7",
            requestedAt: "17:23",
          },
          {
            id: "4",
            title: "คำถามโง่ๆ",
            artist: "Lomosonic",
            coverUrl: "/placeholder.svg?height=300&width=300",
            duration: "3:55",
            requestedBy: "โต๊ะ 2",
            requestedAt: "17:25",
          },
        ])

        setHistory([
          {
            id: "h1",
            title: "ภักดี",
            artist: "COCKTAIL",
            coverUrl: "/placeholder.svg?height=300&width=300",
            duration: "4:23",
            requestedBy: "โต๊ะ 1",
            requestedAt: "17:00",
          },
          {
            id: "h2",
            title: "แฟนเก่า",
            artist: "COCKTAIL",
            coverUrl: "/placeholder.svg?height=300&width=300",
            duration: "4:05",
            requestedBy: "โต๊ะ 4",
            requestedAt: "17:05",
          },
          {
            id: "h3",
            title: "ใจเดียว",
            artist: "Tilly Birds",
            coverUrl: "/placeholder.svg?height=300&width=300",
            duration: "3:50",
            requestedBy: "โต๊ะ 6",
            requestedAt: "17:10",
          },
        ])

        setTransactions([
          {
            id: "t1",
            songTitle: "ภักดี",
            amount: 10,
            customerName: "โต๊ะ 1",
            timestamp: "17:00",
          },
          {
            id: "t2",
            songTitle: "แฟนเก่า",
            amount: 10,
            customerName: "โต๊ะ 4",
            timestamp: "17:05",
          },
          {
            id: "t3",
            songTitle: "ใจเดียว",
            amount: 10,
            customerName: "โต๊ะ 6",
            timestamp: "17:10",
          },
          {
            id: "t4",
            songTitle: "ถ้าเธอรักฉันจริง",
            amount: 10,
            customerName: "โต๊ะ 5",
            timestamp: "17:20",
          },
          {
            id: "t5",
            songTitle: "แปะหัวใจ",
            amount: 10,
            customerName: "โต๊ะ 3",
            timestamp: "17:22",
          },
          {
            id: "t6",
            songTitle: "ทุกอย่าง",
            amount: 10,
            customerName: "โต๊ะ 7",
            timestamp: "17:23",
          },
          {
            id: "t7",
            songTitle: "คำถามโง่ๆ",
            amount: 10,
            customerName: "โต๊ะ 2",
            timestamp: "17:25",
          },
        ])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSkip = () => {
    if (queue.length === 0) return

    // Move current song to history
    if (currentSong) {
      setHistory([currentSong, ...history])
    }

    // Set first song in queue as current song
    setCurrentSong(queue[0])

    // Remove first song from queue
    setQueue(queue.slice(1))
  }

  const handleRemoveFromQueue = (songId: string) => {
    setQueue(queue.filter((song) => song.id !== songId))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-950 text-white">
      {/* Header */}
      <div className="w-full bg-gradient-to-b from-primary/20 to-background p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">MusicQueue Admin</h1>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm">
            หน้าลูกค้า
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        {/* Player Controls */}
        <Card className="bg-gray-900 border-gray-800 md:col-span-1">
          <CardHeader>
            <CardTitle>ตัวเล่นเพลง</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {currentSong && (
              <>
                <div className="relative w-full max-w-xs aspect-square mb-4">
                  <Image
                    src={currentSong.coverUrl || "/placeholder.svg"}
                    alt={currentSong.title}
                    fill
                    className="object-cover rounded-lg shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-center">{currentSong.title}</h3>
                <p className="text-gray-400 text-center mb-2">{currentSong.artist}</p>
                <p className="text-sm text-gray-500 mb-4">
                  ขอโดย: {currentSong.requestedBy} เวลา {currentSong.requestedAt}
                </p>

                <div className="flex items-center gap-4 mt-2">
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={handlePlayPause}>
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={handleSkip}>
                    <SkipForward className="h-6 w-6" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Queue Management */}
        <Card className="bg-gray-900 border-gray-800 md:col-span-2">
          <CardHeader>
            <CardTitle>จัดการคิวเพลง</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="queue">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="queue" className="data-[state=active]:bg-primary">
                  <ListMusic className="h-4 w-4 mr-2" />
                  คิวเพลง
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-primary">
                  <Clock className="h-4 w-4 mr-2" />
                  ประวัติการเล่น
                </TabsTrigger>
              </TabsList>

              <TabsContent value="queue" className="mt-4">
                {queue.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[80px]">ลำดับ</TableHead>
                        <TableHead>เพลง</TableHead>
                        <TableHead>ขอโดย</TableHead>
                        <TableHead>เวลา</TableHead>
                        <TableHead className="text-right">จัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {queue.map((song, index) => (
                        <TableRow key={song.id} className="hover:bg-gray-800/50">
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Image
                                src={song.coverUrl || "/placeholder.svg"}
                                alt={song.title}
                                width={40}
                                height={40}
                                className="rounded-md"
                              />
                              <div>
                                <div className="font-medium">{song.title}</div>
                                <div className="text-sm text-gray-400">{song.artist}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{song.requestedBy}</TableCell>
                          <TableCell>{song.requestedAt}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveFromQueue(song.id)}>
                              ลบ
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-400">ไม่มีเพลงในคิว</div>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                {history.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>เพลง</TableHead>
                        <TableHead>ขอโดย</TableHead>
                        <TableHead>เวลา</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((song) => (
                        <TableRow key={song.id} className="hover:bg-gray-800/50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Image
                                src={song.coverUrl || "/placeholder.svg"}
                                alt={song.title}
                                width={40}
                                height={40}
                                className="rounded-md"
                              />
                              <div>
                                <div className="font-medium">{song.title}</div>
                                <div className="text-sm text-gray-400">{song.artist}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{song.requestedBy}</TableCell>
                          <TableCell>{song.requestedAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-400">ไม่มีประวัติการเล่น</div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="bg-gray-900 border-gray-800 md:col-span-3">
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>รายการชำระเงิน</CardTitle>
              <CardDescription>ประวัติการชำระเงินทั้งหมด</CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2 bg-gray-800 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm text-gray-400">รายได้วันนี้</div>
                <div className="font-bold">{transactions.reduce((sum, t) => sum + t.amount, 0)} บาท</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>ID</TableHead>
                  <TableHead>เพลง</TableHead>
                  <TableHead>จำนวนเงิน</TableHead>
                  <TableHead>ลูกค้า</TableHead>
                  <TableHead>เวลา</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-gray-800/50">
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.songTitle}</TableCell>
                    <TableCell>{transaction.amount} บาท</TableCell>
                    <TableCell>{transaction.customerName}</TableCell>
                    <TableCell>{transaction.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
