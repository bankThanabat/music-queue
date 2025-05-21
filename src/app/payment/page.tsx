"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Music, ArrowLeft, QrCode, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getImageWithFallback } from "@/lib/image-utils"

export default function Payment() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const songId = searchParams.get("songId")
  const title = searchParams.get("title")
  const artist = searchParams.get("artist")
  const price = searchParams.get("price")

  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "success" | "error">("pending")
  const [countdown, setCountdown] = useState(180) // 3 minutes in seconds

  useEffect(() => {
    if (!songId || !title || !artist || !price) {
      router.push("/select")
      return
    }

    // Countdown timer
    if (paymentStatus === "pending" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && paymentStatus === "pending") {
      setPaymentStatus("error")
    }
  }, [songId, title, artist, price, router, countdown, paymentStatus])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const simulatePayment = () => {
    setPaymentStatus("processing")

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("success")

      // Redirect to home after successful payment
      setTimeout(() => {
        router.push("/")
      }, 3000)
    }, 2000)
  }

  return (
    <main className="flex min-h-screen flex-col bg-black text-[#FFFFFF]">
      {/* Header */}
      <div className="w-full bg-gradient-to-b from-[#1DB954]/10 to-black p-4 flex items-center gap-2">
        <Link href="/select">
          <Button className="hover:bg-[#282828] text-[#FFFFFF]" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-[#1DB954]" />
          <h1 className="text-xl font-bold">ชำระเงิน</h1>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center">
        <Card className="w-full bg-[#121212] border-[#282828]">
          <CardHeader>
            <CardTitle className="text-center text-[#FFFFFF]">ชำระเงินด้วย QR พร้อมเพย์</CardTitle>
            <CardDescription className="text-center text-[#B3B3B3]">สแกน QR Code เพื่อชำระเงินสำหรับเพลง</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-medium">{title}</h3>
              <p className="text-sm text-[#B3B3B3]">{artist}</p>
              <p className="text-lg font-bold text-[#1DB954] mt-2">{price} บาท</p>
            </div>

            {paymentStatus === "pending" && (
              <>
                <div className="bg-white p-4 rounded-lg mb-4 border border-[#535353]">
                  <div className="relative w-64 h-64">
                    <Image
                      src={getImageWithFallback("/placeholder.svg?height=300&width=300", 300, 300)}
                      alt="QR Code for payment"
                      fill
                      className="object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <QrCode className="h-32 w-32 text-black opacity-20" />
                    </div>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <p className="text-sm text-[#B3B3B3]">QR Code จะหมดอายุใน</p>
                  <p className="text-xl font-bold text-yellow-500">{formatTime(countdown)}</p>
                </div>

                <Button onClick={simulatePayment} className="w-full bg-[#1DB954] hover:bg-[#1DB954]/90 text-[#FFFFFF]">
                  จำลองการชำระเงิน (สำหรับการทดสอบ)
                </Button>
              </>
            )}

            {paymentStatus === "processing" && (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="h-16 w-16 animate-spin text-[#1DB954] mb-4" />
                <p className="text-lg">กำลังตรวจสอบการชำระเงิน...</p>
              </div>
            )}

            {paymentStatus === "success" && (
              <Alert className="bg-[#1DB954]/20 border-[#1DB954] mb-4">
                <Check className="h-5 w-5 text-[#1DB954]" />
                <AlertTitle>ชำระเงินสำเร็จ!</AlertTitle>
                <AlertDescription>เพลงของคุณถูกเพิ่มเข้าคิวเรียบร้อยแล้ว กำลังกลับไปยังหน้าหลัก...</AlertDescription>
              </Alert>
            )}

            {paymentStatus === "error" && (
              <Alert className="bg-[#E91429]/20 border-[#E91429] mb-4">
                <AlertTitle>การชำระเงินล้มเหลว</AlertTitle>
                <AlertDescription>QR Code หมดอายุแล้ว กรุณาลองใหม่อีกครั้ง</AlertDescription>
              </Alert>
            )}
          </CardContent>

          {paymentStatus === "error" && (
            <CardFooter>
              <Button className="w-full bg-[#282828] hover:bg-[#535353] text-[#FFFFFF] border-[#535353]" onClick={() => router.push("/select")}>
                กลับไปเลือกเพลงใหม่
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </main>
  )
}
