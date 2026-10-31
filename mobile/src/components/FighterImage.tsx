import { Image } from 'expo-image'

interface FighterImageProps {
  uri: string
  label: string
  size: number
  recyclingKey?: string
}

export function FighterImage({ uri, label, size, recyclingKey }: FighterImageProps) {
  return (
    <Image
      source={{ uri }}
      accessibilityLabel={label}
      contentFit="contain"
      cachePolicy="memory-disk"
      recyclingKey={recyclingKey}
      style={{ width: size, height: size }}
    />
  )
}
