'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX } from 'lucide-react'

export function HeroVideo({ videoId }: { videoId: string }) {
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
      enablejsapi: '1',
      origin: typeof window !== 'undefined' ? window.location.origin : ''
    })
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  }, [videoId, muted])

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
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <iframe
        className="absolute"
        src={src}
        title="Hero video"
        allow="autoplay; encrypted-media"
        allowFullScreen
        ref={iframeRef}
        style={{
          width: '100vw',
          height: '56.25vw',
          minWidth: '177.78vh',
          minHeight: '100vh',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
      <div className="absolute bottom-6 left-6 pointer-events-auto">
        <Button variant="outline" size="sm" className="bg-black/40 text-white border-white/30 hover:bg-black/60" onClick={toggleSound}>
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span className="ml-2 text-xs">{muted ? 'Son désactivé' : 'Son activé'}</span>
        </Button>
      </div>
    </div>
  )
}
