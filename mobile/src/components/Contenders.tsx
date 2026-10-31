import { useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'
import { FighterImage } from './FighterImage'
import { GreenButton } from './GreenButton'
import type { Contender } from '../lib/types'

interface ContendersProps {
  contender: Contender
  editNameFn: (slot: 0 | 1, name: string) => void
  replaceFn: (slot: 0 | 1) => void
  horizontal?: boolean
  imageSize?: number
  stackButtons?: boolean
}

// iOS shadows have no spread, so the web's soft dark halo is a radial gradient behind the image.
function ImageWithGlow({ uri, label, size }: { uri: string; label: string; size: number }) {
  const spread = size / 2

  return (
    <View style={{ width: size, height: size }}>
      <Svg
        pointerEvents="none"
        width={size + spread * 2}
        height={size + spread * 2}
        style={{ position: 'absolute', left: -spread, top: -spread }}
      >
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
            <Stop offset="0.45" stopColor="#000" stopOpacity={0.7} />
            <Stop offset="1" stopColor="#000" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#glow)" />
      </Svg>
      <FighterImage uri={uri} label={label} size={size} />
    </View>
  )
}

export function Contenders({
  contender,
  editNameFn,
  replaceFn,
  horizontal = false,
  imageSize = 120,
  stackButtons = false,
}: ContendersProps) {
  const [editing, setEditing] = useState(false)
  const [userInput, setUserInput] = useState('')

  const handleEdit = () => {
    if (userInput.trim() === '') return
    editNameFn(contender.slot, userInput.trim())
    setEditing(false)
    setUserInput('')
  }

  const hp = <Text className="z-10 font-bangers text-3xl tracking-widest text-white">HP: {contender.hp}</Text>

  const details = editing ? (
    <View className="flex-row items-center">
      <TextInput
        value={userInput}
        onChangeText={setUserInput}
        onSubmitEditing={handleEdit}
        placeholder={contender.name}
        returnKeyType="done"
        autoFocus
        className="mr-0.5 w-24 bg-white px-2 py-1 text-base text-black"
      />
      <GreenButton label="Submit" onPress={handleEdit} />
    </View>
  ) : (
    <View className={horizontal ? 'items-start' : 'items-center'}>
      <Text className={`font-bangers tracking-widest text-white ${horizontal ? 'text-2xl' : 'text-center text-3xl'}`}>
        {contender.name}
      </Text>
      <View className={`mt-1 ${stackButtons ? 'items-start' : 'flex-row'}`}>
        <GreenButton label="Edit Name" onPress={() => setEditing(true)} />
        <GreenButton label="Replace" onPress={() => replaceFn(contender.slot)} />
      </View>
    </View>
  )

  if (horizontal) {
    return (
      <View className="flex-row items-center">
        <ImageWithGlow uri={contender.image} label={contender.name} size={imageSize} />
        <View className="ml-4 flex-1 items-start">
          {hp}
          {details}
        </View>
      </View>
    )
  }

  return (
    <View className="items-center">
      {hp}
      <View className="my-2">
        <ImageWithGlow uri={contender.image} label={contender.name} size={160} />
      </View>
      {details}
    </View>
  )
}
