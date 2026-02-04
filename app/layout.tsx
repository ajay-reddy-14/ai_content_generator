import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Content Generator - Create Engaging Content Instantly',
  description: 'Generate high-quality blog posts, social media content, emails, and product descriptions using AI technology. Fast, customizable, and professional.',
  keywords: 'AI content generator, blog post generator, social media content, email generator, product description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
