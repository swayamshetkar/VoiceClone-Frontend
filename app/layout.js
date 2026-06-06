import './globals.css';

export const viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1
};

export const metadata = {
  title: 'VoiceFront — AI Voice & Video Studio',
  description: 'Dub videos, translate audio, and clone voices with AI. An open-source frontend for the VoiceFront dubbing platform.',
  keywords: 'voice cloning, video dubbing, audio translation, AI, TTS'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
