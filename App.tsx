/**
 * Copyright 2023 Coinbase Global, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { createConfig } from '@gluestack-ui/themed';
import { config } from './gluestack-ui.config';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import {
  GluestackUIProvider,
  Box,
} from '@gluestack-ui/themed';

import { Main } from './screens/Main';
import { ButtonTheme } from './components/themes/Button';
import { ButtonTextTheme } from './components/themes/ButtonText';
import { InputTheme } from './components/themes/Input';
import { InputFieldTheme } from './components/themes/InputField';
import { TextareaTheme } from './components/themes/Textarea';
import { TextareaInputTheme } from './components/themes/TextareaInput';

import store from './app/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

let persistor = persistStore(store);

const extendedConfig = createConfig({
  ...config.theme,
  components: {
    Button: {
      theme: ButtonTheme,
    },
    ButtonText: {
      theme: ButtonTextTheme,
    },
    Input: {
      theme: InputTheme,
    },
    InputField: {
      theme: InputFieldTheme,
    },
    Textarea: {
      theme: TextareaTheme,
    },
    TextareaInput: {
      theme: TextareaInputTheme,
    }
  },
})

function App(): JSX.Element {

  const backgroundStyle = {
    flex: 1,
    backgroundColor: Colors.black
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <SafeAreaView style={backgroundStyle}>
            <StatusBar
              barStyle='light-content'
              backgroundColor={backgroundStyle.backgroundColor}
            />
            <GluestackUIProvider config={extendedConfig}>
            <NavigationContainer>
              <Box
                style={backgroundStyle}
                height="100%">
                <Main />
              </Box>
            </NavigationContainer>
            </GluestackUIProvider>
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}

export default App;
