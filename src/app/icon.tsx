import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 512, height: 512 };
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
          background: 'linear-gradient(to bottom right, #22d3ee, #0891b2)',
          borderRadius: '128px',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="300"
          height="300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 6c.6 0 1.2-.2 1.8-.6.9-.6 2.2-.6 3.1 0 .6.4 1.2.6 1.8.6.6 0 1.2-.2 1.8-.6.9-.6 2.2-.6 3.1 0 .6.4 1.2.6 1.8.6.6 0 1.2-.2 1.8-.6.9-.6 2.2-.6 3.1 0 .6.4 1.2.6 1.8.6" />
          <path d="M2 12c.6 0 1.2-.2 1.8-.6.9-.6 2.2-.6 3.1 0 .6.4 1.2.6 1.8.6.6 0 1.2-.2 1.8-.6.9-.6 2.2-.6 3.1 0 .6.4 1.2.6 1.8.6.6 0 1.2-.2 1.8-.6.9-.6 2.2-.6 3.1 0 .6.4 1.2.6 1.8.6" />
          <path d="M2 18c.6 0 1.2-.2 1.8-.6.9-.6 2.2-.6 3.1 0 .6.4 1.2.6 1.8.6.6 0 1.2-.2 1.8-.6.9-.6 2.2-.6 3.1 0 .6.4 1.2.6 1.8.6.6 0 1.2-.2 1.8-.6.9-.6 2.2-.6 3.1 0 .6.4 1.2.6 1.8.6" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
