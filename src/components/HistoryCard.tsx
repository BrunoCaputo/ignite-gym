import { HistoryDTO } from '@dtos/HistoryDTO'
import { Heading, HStack, Text, VStack } from '@gluestack-ui/themed'

interface HistoryCardProps {
  data: HistoryDTO
}

export function HistoryCard({ data: { group, name, hour } }: HistoryCardProps) {
  return (
    <HStack
      w="$full"
      px="$5"
      py="$4"
      mb="$3"
      bg="$gray600"
      rounded="$md"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack flex={1} mr="$5">
        <Heading
          color="$white"
          fontSize="$md"
          fontFamily="$heading"
          textTransform="capitalize"
          numberOfLines={1}
        >
          {group}
        </Heading>

        <Text color="$gray100" fontSize="$lg" numberOfLines={1}>
          {name}
        </Text>
      </VStack>

      <Text color="$gray300" fontSize="$md">
        {hour}
      </Text>
    </HStack>
  )
}
