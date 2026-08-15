import { NextRequest, NextResponse } from 'next/server'

interface GiphyItem {
  id: string
  title?: string
  images?: {
    fixed_height?: { url?: string }
    downsized_medium?: { url?: string }
    downsized?: { url?: string }
    original?: { url?: string }
  }
}

interface TenorItem {
  id: string
  title?: string
  content_description?: string
  media?: Array<{
    gif?: { url?: string }
    tinygif?: { url?: string }
  }>
}

const RU_TO_EN_MAP: Record<string, string> = {
  котик: 'cute cat',
  кот: 'cat',
  кошка: 'cat',
  коты: 'cats',
  котята: 'kittens',
  собака: 'dog',
  пес: 'dog',
  собачка: 'cute dog',
  смех: 'laughing lol',
  смешно: 'funny lol',
  ржу: 'lmao funny',
  мем: 'meme funny',
  мемы: 'memes',
  туса: 'party celebration',
  вечеринка: 'party hard',
  танец: 'dance happy',
  танцы: 'dancing',
  огонь: 'fire lit',
  любовь: 'love heart',
  сердце: 'heart love',
  шок: 'shocked what',
  вау: 'wow amazed',
  плач: 'crying sad',
  грусть: 'sad crying',
  привет: 'hello waving',
  пока: 'goodbye wave',
  спасибо: 'thank you thanks',
  да: 'yes nodding',
  нет: 'no refusing',
  класс: 'awesome thumbs up',
  ок: 'ok cool',
  ура: 'yay celebration',
  пятница: 'friday party',
  сон: 'sleepy sleeping',
  устал: 'tired exhausted',
  кушать: 'eating food',
  еда: 'food delicious',
  кофе: 'coffee morning',
  работа: 'working typing',
  деньги: 'money rich',
}

const GIPHY_API_KEYS = [
  'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh',
  '56JuGI3ingCAICfZGAK14xXomwDh6Dgn',
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')?.trim() || ''
  const category = searchParams.get('category')?.trim() || 'trending'
  const limit = Math.min(Number(searchParams.get('limit') || 48), 50)

  let searchTerm = query || category
  const lowerQuery = query.toLowerCase()
  if (RU_TO_EN_MAP[lowerQuery]) {
    searchTerm = RU_TO_EN_MAP[lowerQuery]
  }

  for (const apiKey of GIPHY_API_KEYS) {
    try {
      const endpoint =
        searchTerm === 'trending' && !query
          ? `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=${limit}&rating=g`
          : `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(searchTerm)}&limit=${limit}&rating=g`

      const res = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 60 },
      })

      if (res.ok) {
        const json = await res.json()
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          const gifs = (json.data as GiphyItem[]).map((item) => ({
            id: item.id,
            url:
              item.images?.fixed_height?.url ||
              item.images?.downsized_medium?.url ||
              item.images?.downsized?.url ||
              item.images?.original?.url,
            title: item.title || 'GIF',
          }))

          return NextResponse.json({ gifs })
        }
      }
    } catch {
      // Continue to next key or fallback
    }
  }

  try {
    const tenorEndpoint = `https://g.tenor.com/v1/search?q=${encodeURIComponent(searchTerm)}&key=LIVDSRZULELA&limit=${limit}`
    const tenorRes = await fetch(tenorEndpoint)
    if (tenorRes.ok) {
      const tenorJson = await tenorRes.json()
      if (tenorJson.results && Array.isArray(tenorJson.results)) {
        const gifs = (tenorJson.results as TenorItem[]).map((item) => ({
          id: item.id,
          url: item.media?.[0]?.gif?.url || item.media?.[0]?.tinygif?.url,
          title: item.title || item.content_description || 'GIF',
        }))
        return NextResponse.json({ gifs })
      }
    }
  } catch {
    // Return empty fallback
  }

  return NextResponse.json({ gifs: [] })
}
