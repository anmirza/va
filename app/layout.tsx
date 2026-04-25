import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans, IBM_Plex_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/lib/auth-context'
import { FollowProvider } from '@/lib/follow-context'
import './globals.css'

const dmSerif = DM_Serif_Display({ weight: ['400'], subsets: ['latin'], variable: '--font-dm-serif' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const ibmPlexMono = IBM_Plex_Mono({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--font-ibm-mono' })

export const metadata: Metadata = {
  title: 'VA - Advertising Industry Directory',
  description: 'Discover the world\'s most innovative advertising agencies, campaigns, and talent on VA',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/logo-va.png', type: 'image/png', sizes: '48x48' },
      { url: '/logo-va.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo-va.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/logo-va.png', sizes: '180x180', type: 'image/png' }],
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
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
