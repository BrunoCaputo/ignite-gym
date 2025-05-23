import { HistoryCard } from '@components/HistoryCard'
import { ScreenHeader } from '@components/ScreenHeader'
import { Heading, Text, VStack } from '@gluestack-ui/themed'
import { useState } from 'react'
import { SectionList } from 'react-native'

interface IExercise {
  title: string
  data: { group: string; exercise: string; time: string }[]
}

export function History() {
  const [exercises] = useState<IExercise[]>([
    {
      title: '22.07.24',
      data: [
        { group: 'costas', exercise: 'Puxada frontal', time: '08:56' },
        { group: 'costas', exercise: 'Remada unilateral', time: '09:00' },
      ],
    },
    {
      title: '23.07.24',
      data: [{ group: 'costas', exercise: 'Puxada frontal', time: '10:27' }],
    },
  ])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item.exercise}
        renderItem={({ item: { group, exercise, time } }) => (
          <HistoryCard group={group} exercise={exercise} time={time} />
        )}
        renderSectionHeader={({ section }) => (
          <Heading color="$gray200" fontSize="$md" mt="$10" mb="$3">
            {section.title}
          </Heading>
        )}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: 'center' }
        }
        ListEmptyComponent={() => (
          <Text color="$gray200" textAlign="center">
            Não há exercícios registrados ainda. {'\n'}
            Vamos fazer execícios hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}
