import BackgroundImg from '@assets/background.png'
import { Image, VStack } from '@gluestack-ui/themed'

export function SignIn() {
  return (
    <VStack flex={1} bg="$gray700">
      <Image
        w="$full"
        h={624}
        source={BackgroundImg}
        defaultSource={BackgroundImg}
        alt="Pessoas treinando"
        position="absolute"
      />
    </VStack>
  )
}
