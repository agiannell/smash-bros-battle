import { useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { FighterImage } from './FighterImage'
import { GreenButton } from './GreenButton'
import type { Contender } from '../lib/types'

interface ContendersProps {
  contender: Contender
  editNameFn: (slot: 0 | 1, name: string) => void
  replaceFn: (slot: 0 | 1) => void
}

export function Contenders({ contender, editNameFn, replaceFn }: ContendersProps) {
  const [editing, setEditing] = useState(false)
  const [userInput, setUserInput] = useState('')

  const handleEdit = () => {
    if (userInput.trim() === '') return
    editNameFn(contender.slot, userInput.trim())
    setEditing(false)
    setUserInput('')
  }

  return (
    <View className="w-44 items-center">
      <Text className="font-bangers text-3xl tracking-widest text-white">HP: {contender.hp}</Text>
      <View className="my-2 bg-black/70">
        <FighterImage uri={contender.image} label={contender.name} size={160} />
      </View>
      {editing ? (
        <View className="flex-row items-center justify-center">
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
        <View className="items-center">
          <Text className="text-center font-bangers text-3xl tracking-widest text-white">{contender.name}</Text>
          <View className="mt-1 flex-row items-center justify-center">
            <GreenButton label="Edit Name" onPress={() => setEditing(true)} />
            <GreenButton label="Replace" onPress={() => replaceFn(contender.slot)} />
          </View>
        </View>
      )}
    </View>
  )
}
