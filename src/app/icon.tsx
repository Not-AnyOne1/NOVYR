import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#08080A',
          color: '#fff',
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: '-2px',
          borderRadius: 14,
        }}
      >
        N
      </div>
    ),
    size
  );
}
