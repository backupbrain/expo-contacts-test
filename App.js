import React, { useRef, useState, useEffect } from 'react'
import { registerRootComponent } from 'expo'
import translate, { setI18nConfig } from './translations'
// import * as RNLocalize from 'react-native-localize;'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import NavMenuButton from './components/buttons/NavMenuButton'
import ContactBookView from './views/contacts/ContactBookView'
import EditContactView from './views/contacts/EditContactView'
// import { useIsDrawerOpen } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { AnodeDarkTheme, AnodeLightTheme } from './themes/AnodeThemes'
import { AppearanceProvider, useColorScheme } from 'react-native-appearance'

import PktPriceTicker from './utils/PktPriceTicker'

const Stack = createStackNavigator()

export default function App () {
  const scheme = useColorScheme()
  const [pktPriceTimeout, setPktPriceTimeout] = useState(null)
  const pktPriceTicker = useRef(new PktPriceTicker())
  // const [, forceUpdate] = useReducer(x => x + 1, 0)
  setI18nConfig()

  /*
  const handleLocalizationChange = () => {
    setI18nConfig()
      .then(() => forceUpdate())
      .catch(error => {
        console.error(error)
      })
  }
  */

  /*
  useEffect(() => {
    // Update the document title using the browser API
    RNLocalize.addEventListener('change', handleLocalizationChange)
  }) */

  useEffect(() => {
    const setupPktPriceTimout = async () => {
      const pktPriceTimeout = setTimeout(() => {
        const updatePktPriceAsync = async () => {
          await pktPriceTicker.current.fetchSpotPrice(pktPriceTicker.current.getUserFiatCurrency())
        }
        updatePktPriceAsync()
      }, PktPriceTicker.UPDATE_FREQUENCY_S * 1000)
      setPktPriceTimeout(pktPriceTimeout)
      await pktPriceTicker.current.fetchSpotPrice(pktPriceTicker.current.getUserFiatCurrency())
    }
    if (!pktPriceTimeout) {
      setupPktPriceTimout()
    }
  }, [pktPriceTicker, setPktPriceTimeout])

  return (
    <AppearanceProvider>
      <SafeAreaProvider>
        <NavigationContainer theme={scheme === 'dark' ? AnodeDarkTheme : AnodeLightTheme}>
          <Stack.Navigator>
            <Stack.Screen
              name='ContactBookView'
              options={{ title: translate('contactBook'), headerRight: () => <NavMenuButton /> }}
              component={ContactBookView}
            />
            <Stack.Screen
              name='EditContactView'
              options={{ title: translate('editContact'), headerRight: () => <NavMenuButton /> }}
              component={EditContactView}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AppearanceProvider>
  )
}

registerRootComponent(App)
