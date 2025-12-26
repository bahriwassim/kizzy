'use client'

import Script from 'next/script'

export function TikTokPixel() {
  const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || 'D5792KJC77U5DJL53L00'
  if (!pixelId) return null
  const initCode = `
!function(w,d,t){
  w.TiktokAnalyticsObject=t;
  var ttq=w[t]=w[t]||[];
  ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
  ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
  for(var i=0;i<ttq.methods.length;i++) ttq.setAndDefer(ttq,ttq.methods[i]);
  ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++) ttq.setAndDefer(e,ttq.methods[n]);return e};
  ttq.load=function(e,n){
    var r="https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._i=ttq._i||{}; ttq._i[e]=[]; ttq._i[e]._u=r; ttq._t=ttq._t||{}; ttq._t[e]=+new Date; ttq._o=ttq._o||{}; ttq._o[e]=n||{};
    var a=d.createElement("script"); a.type="text/javascript"; a.async=!0; a.src=r+"?sdkid="+e+"&lib="+t;
    var s=d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(a,s);
  };
  ttq.load('${pixelId}');
  ttq.page();
}(window, document, 'ttq');
`
  return <Script id="ttq-init" strategy="afterInteractive">{initCode}</Script>
}
