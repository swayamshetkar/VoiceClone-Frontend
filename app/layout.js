import "./styles.css";

export const metadata = {
  title: "VoiceFront",
  description: "Thin frontend for dubbing and voice clone workflows"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
