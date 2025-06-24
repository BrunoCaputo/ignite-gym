import DefaultUserPhoto from '@assets/userPhotoDefault.png'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ScreenHeader } from '@components/ScreenHeader'
import { Skeleton } from '@components/Skeleton'
import { ToastMessage } from '@components/ToastMessage'
import { UserPhoto } from '@components/UserPhoto'
import { Center, Heading, Text, useToast, VStack } from '@gluestack-ui/themed'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { getUserImage } from '@utils/getUserImage'
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

const profileSchema = yup
  .object({
    name: yup.string().required('Informe o nome'),
    email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
    old_password: yup
      .string()
      .nullable()
      .transform((value) => value ?? null),
    password: yup
      .string()
      .min(6, 'A senha deve ter pelo menos 6 dígitos')
      .nullable()
      .transform((value) => value ?? null),
    password_confirm: yup
      .string()
      .nullable()
      .transform((value) => value ?? null)
      .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais')
      .when('password', {
        is: (Field: unknown) => Field,
        then: (schema) =>
          schema
            .nullable()
            .required('Informe a confirmação da senha.')
            .transform((value) => value ?? null),
      }),
  })
  .strict(true)

type FormDataProps = yup.InferType<typeof profileSchema>

export function Profile() {
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [photoIsLoading, setPhotoIsLoading] = useState<boolean>(false)

  const toast = useToast()
  const { user, updateUserProfile } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    // @ts-expect-error Type error
    resolver: yupResolver(profileSchema),
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

      const image = selectedImage.assets[0]

      const imageUri = image.uri

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

        const fileExtension = imageUri.split('.').pop()

        const imageFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: imageUri,
          type: `${image.type}/${fileExtension}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any

        const userImageUploadForm = new FormData()

        userImageUploadForm.append('avatar', imageFile)

        const updatedAvatarResponse = await api.patch(
          '/users/avatar',
          userImageUploadForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        const userUpdated = user
        userUpdated.avatar = updatedAvatarResponse.data.avatar

        await updateUserProfile(userUpdated)

        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastMessage
              id={id}
              title="Foto atualizada!"
              onClose={() => toast.close(id)}
            />
          ),
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true)

      const userUpdated = user
      userUpdated.name = data.name

      await api.put('/users', data)

      await updateUserProfile(userUpdated)

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Perfil atualizado com sucesso!"
            onClose={() => toast.close(id)}
          />
        ),
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar os dados. Tente novamente mais tarde.'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        ),
      })
    } finally {
      setIsUpdating(false)
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
                source={
                  user.avatar
                    ? { uri: getUserImage(user.avatar) }
                    : DefaultUserPhoto
                }
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
                    errorMessage={errors.name?.message}
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
                    errorMessage={errors.email?.message}
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
              <Controller
                control={control}
                name="old_password"
                render={({ field: { onChange } }) => (
                  <Input
                    placeholder="Senha antiga"
                    bg="$gray600"
                    secureTextEntry
                    onChangeText={onChange}
                    errorMessage={errors.old_password?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange } }) => (
                  <Input
                    placeholder="Nova senha"
                    bg="$gray600"
                    secureTextEntry
                    onChangeText={onChange}
                    errorMessage={errors.password?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password_confirm"
                render={({ field: { onChange } }) => (
                  <Input
                    placeholder="Confirme a nova senha"
                    bg="$gray600"
                    secureTextEntry
                    onChangeText={onChange}
                    errorMessage={errors.password_confirm?.message}
                  />
                )}
              />

              <Button
                title="Atualizar"
                isLoading={isUpdating}
                // @ts-expect-error Type error
                onPress={handleSubmit(handleProfileUpdate)}
              />
            </Center>
          </Center>
        </ScrollView>
      </KeyboardAvoidingView>
    </VStack>
  )
}
