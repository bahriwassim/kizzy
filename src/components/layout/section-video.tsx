'use client'

import { useMemo, useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX } from 'lucide-react'

export function SectionVideo({ videoId }: { videoId: string }) {
  const [muted, setMuted] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const src = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: '1',
      mute: muted ? '1' : '0',
      controls: '0',
      loop: '1',
      playlist: videoId,
      modestbranding: '1',
      rel: '0',
      playsinline: '1',
      enablejsapi: '1'
    })
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  }, [videoId, muted])

  useEffect(() => {
    const el = iframeRef.current
    el?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*')
  }, [])

  useEffect(() => {
    const el = iframeRef.current
    if (!el) return
    const cmd = muted ? 'mute' : 'unMute'
    el.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: cmd, args: [] }), '*')
  }, [muted])

  const toggleSound = () => {
    setMuted((m) => !m)
    const el = iframeRef.current
    if (!el) return
    el.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*')
  }

  return (
    <div className="relative w-full rounded-xl border border-white/10" style={{ aspectRatio: '16/9' }}>
      <iframe
        ref={iframeRef}
        className="absolute inset-0 w-full h-full rounded-xl"
        src={src}
        title={`video-${videoId}`}
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
      <div className="absolute bottom-3 left-3 pointer-events-auto">
        <Button variant="outline" size="sm" className="bg-black/40 text-white border-white/30 hover:bg-black/60" onClick={toggleSound}>
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span className="ml-2 text-xs">{muted ? 'Son désactivé' : 'Son activé'}</span>
        </Button>
      </div>
    </div>
  )
}
