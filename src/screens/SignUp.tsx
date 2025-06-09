import BackgroundImg from '@assets/background.png'
import Logo from '@assets/logo.svg'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ToastMessage } from '@components/ToastMessage'
import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  useToast,
  VStack,
} from '@gluestack-ui/themed'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform } from 'react-native'
import * as yup from 'yup'

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
  password: yup
    .string()
    .required('Informe a senha')
    .min(6, 'A senha deve ter pelo menos 6 dígitos'),
  password_confirm: yup
    .string()
    .required('Confirme a senha')
    .oneOf([yup.ref('password'), ''], 'As senhas devem ser iguais'),
})

type FormDataProps = yup.InferType<typeof signUpSchema>

export function SignUp() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  })
  const navigation = useNavigation()
  const toast = useToast()
  const { signIn } = useAuth()

  function handleLogin() {
    navigation.goBack()
  }

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      setIsLoading(true)

      await api.post('/users', { name, email, password })
      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Não foi possível criar a conta. Tente novamente mais tarde'

      setIsLoading(false)

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
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack flex={1}>
          <Image
            w="$full"
            h={624}
            source={BackgroundImg}
            defaultSource={BackgroundImg}
            alt="Pessoas treinando"
            position="absolute"
          />

          <VStack flex={1} px="$10" pb="$16">
            <Center my="$24">
              <Logo />

              <Text color="$gray100" fontSize="$sm">
                Treine sua mente e seu corpo
              </Text>
            </Center>

            <Center flex={1} gap="$2">
              <Heading color="$gray100">Crie sua conta</Heading>

              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Nome"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.name?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="E-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Senha"
                    secureTextEntry
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.password?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password_confirm"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Confirme a Senha"
                    secureTextEntry
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.password_confirm?.message}
                    onSubmitEditing={handleSubmit(handleSignUp)}
                    returnKeyType="send"
                  />
                )}
              />

              <Button
                title="Criar e acessar"
                onPress={handleSubmit(handleSignUp)}
                isLoading={isLoading}
              />
            </Center>

            <Button
              title="Voltar para o login"
              variant="outline"
              mt="$12"
              onPress={handleLogin}
            />
          </VStack>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
