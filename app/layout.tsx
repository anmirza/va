import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans, IBM_Plex_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { FollowProvider } from '@/lib/follow-context'
import './globals.css'

const dmSerif = DM_Serif_Display({ weight: ['400'], subsets: ['latin'], variable: '--font-dm-serif' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const ibmPlexMono = IBM_Plex_Mono({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--font-ibm-mono' })

export const metadata: Metadata = {
  title: 'REQUISTI - Advertising Industry Directory',
  description: 'Discover the world\'s most innovative advertising agencies, campaigns, and talent on REQUISTI',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <AuthProvider>
          <FollowProvider>
            {children}
          </FollowProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
