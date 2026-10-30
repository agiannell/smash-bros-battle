import { Image } from 'expo-image'

interface FighterImageProps {
  uri: string
  label: string
  size: number
}

export function FighterImage({ uri, label, size }: FighterImageProps) {
  return (
    <Image
      source={{ uri }}
      accessibilityLabel={label}
      contentFit="contain"
      cachePolicy="memory-disk"
      style={{ width: size, height: size }}
    />
  )
}
