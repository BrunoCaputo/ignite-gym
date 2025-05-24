import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { Center, Heading, Text, VStack } from '@gluestack-ui/themed'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native'

export function Profile() {
  const [userPhoto, setUserPhoto] = useState(
    'https://github.com/BrunoCaputo.png',
  )

  async function handleUserPhotoSelect() {
    try {
      const selectedImage = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (selectedImage.canceled) {
        return
      }

      const imageUri = selectedImage.assets[0].uri

      if (imageUri) {
        const imageInfo = (await FileSystem.getInfoAsync(imageUri)) as {
          size: number
        }

        if (imageInfo.size && imageInfo.size / 1024 / 1024 > 5) {
          return Alert.alert(
            'Essa imagem é muito grande. Escolha uma de até 5MB',
          )
        }

        setUserPhoto(selectedImage.assets[0].uri)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
          <Center mt="$6" px="$10">
            <UserPhoto
              source={{ uri: userPhoto }}
              size="xl"
              alt="Imagem do usuário"
            />

            <TouchableOpacity onPress={handleUserPhotoSelect}>
              <Text
                color="$green500"
                fontFamily="$heading"
                fontSize="$md"
                mt="$2"
                mb="$8"
              >
                Alterar Foto
              </Text>
            </TouchableOpacity>

            <Center w="$full" gap="$4">
              <Input placeholder="Nome" bg="$gray600" />
              <Input value="bruno@email.com" bg="$gray600" isReadOnly />
            </Center>

            <Heading
              alignSelf="flex-start"
              fontFamily="$heading"
              color="$gray200"
              fontSize="$md"
              mt="$12"
              mb="$2"
            >
              Alterar senha
            </Heading>

            <Center w="$full" gap="$4">
              <Input placeholder="Senha antiga" bg="$gray600" secureTextEntry />
              <Input placeholder="Nova senha" bg="$gray600" secureTextEntry />
              <Input
                placeholder="Confirme a nova senha"
                bg="$gray600"
                secureTextEntry
              />

              <Button title="Atualizar" />
            </Center>
          </Center>
        </ScrollView>
      </KeyboardAvoidingView>
    </VStack>
  )
}
