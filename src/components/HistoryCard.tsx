import { Heading, HStack, Text, VStack } from '@gluestack-ui/themed'

interface HistoryCardProps {
  group: string
  exercise: string
  time: string
}

export function HistoryCard({ group, exercise, time }: HistoryCardProps) {
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
          {exercise}
        </Text>
      </VStack>

      <Text color="$gray300" fontSize="$md">
        {time}
      </Text>
    </HStack>
  )
}
