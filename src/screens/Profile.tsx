import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ScreenHeader } from '@components/ScreenHeader'
import { Skeleton } from '@components/Skeleton'
import { ToastMessage } from '@components/ToastMessage'
import { UserPhoto } from '@components/UserPhoto'
import { Center, Heading, Text, useToast, VStack } from '@gluestack-ui/themed'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@hooks/useAuth'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import * as yup from 'yup'

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
  old_password: yup.string().required('Informa a senha antiga'),
  password: yup
    .string()
    .required('Informe a nova senha')
    .min(6, 'A senha deve ter pelo menos 6 dígitos'),
  password_confirm: yup
    .string()
    .required('Confirme a nova senha')
    .oneOf([yup.ref('password'), ''], 'As senhas devem ser iguais'),
})

type FormDataProps = yup.InferType<typeof profileSchema>

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState<boolean>(false)
  const [userPhoto, setUserPhoto] = useState<string>(
    'https://github.com/BrunoCaputo.png',
  )

  const toast = useToast()
  const { user } = useAuth()
  const { control } = useForm<FormDataProps>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  })

  async function handleUserPhotoSelect() {
    try {
      setPhotoIsLoading(true)

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
          return toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title="Imagem muito grande!"
                description="Escolha uma de até 5MB"
                onClose={() => toast.close(id)}
              />
            ),
          })
        }

        setUserPhoto(selectedImage.assets[0].uri)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setPhotoIsLoading(false)
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
            {photoIsLoading ? (
              <Skeleton size="$33" />
            ) : (
              <UserPhoto
                source={{ uri: userPhoto }}
                size="xl"
                alt="Imagem do usuário"
              />
            )}

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
              <Controller
                control={control}
                name="name"
                render={({ field: { value, onChange } }) => (
                  <Input
                    placeholder="Nome"
                    bg="$gray600"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                  <Input
                    placeholder="E-mail"
                    bg="$gray600"
                    isReadOnly
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
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
