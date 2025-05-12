import {
  Button as GluestackButton,
  ButtonSpinner,
  Text,
} from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

interface ButtonProps extends ComponentProps<typeof GluestackButton> {
  title: string
  isLoading?: boolean
}

export function Button({ title, isLoading = false, ...props }: ButtonProps) {
  return (
    <GluestackButton
      w="$full"
      h="$14"
      bg="$green700"
      borderWidth="$0"
      borderColor="$green500"
      rounded="$sm"
      $active-bg="$green500"
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <ButtonSpinner color="$white" />
      ) : (
        <Text color="$white" fontFamily="$heading" fontSize="$sm">
          {title}
        </Text>
      )}
    </GluestackButton>
  )
}
