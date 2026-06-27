import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/constants';

export const alt = `${SITE.name} — ${SITE.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #08080A 0%, #101014 60%, #0d1a3a 100%)',
          color: '#fff',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#7FA6FF',
            fontSize: 26,
            letterSpacing: 6,
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          Premium Streetwear · Morocco
        </div>
        <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: '-6px', marginTop: 18, lineHeight: 1 }}>
          NOVYR
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, marginTop: 8, color: '#D4D4D8' }}>
          {SITE.slogan}
        </div>
        <div style={{ fontSize: 28, marginTop: 36, color: '#A1A1AA' }}>
          Free delivery anywhere in Morocco · Cash on delivery
        </div>
      </div>
    ),
    size
  );
}
