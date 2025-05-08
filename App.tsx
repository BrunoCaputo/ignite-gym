import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'
import { GluestackUIProvider, Text } from '@gluestack-ui/themed'
import { StatusBar, View } from 'react-native'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_700Bold, Roboto_400Regular })

  return (
    <GluestackUIProvider>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#202024',
        }}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        {fontsLoaded ? <Text color="white">Home</Text> : <View />}
      </View>
    </GluestackUIProvider>
  )
}
