import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth-context";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "whisprmail - Anonymous Messaging Platform",
  description: "Receive anonymous messages through your unique public link. Safe, secure, and completely anonymous messaging platform.",
  keywords: "anonymous messaging, anonymous feedback, anonymous questions, secure messaging",
  authors: [{ name: "whisprmail" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${bricolageGrotesque.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
