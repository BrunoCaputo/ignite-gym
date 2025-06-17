import { styled } from '@gluestack-style/react'
import { ComponentProps, useEffect, useRef } from 'react'
import { Animated } from 'react-native'

const SkeletonBox = styled(Animated.View, {
  rounded: '$full',
  backgroundColor: '$gray500',
  overflow: 'hidden',
})

type SkeletonBoxProps = ComponentProps<typeof SkeletonBox>

interface SkeletonProps {
  size?: SkeletonBoxProps['width']
}

export function Skeleton({ size }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <SkeletonBox style={{ opacity }} width={size} height={size} />
}
