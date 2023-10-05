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
import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SignIn } from './SignIn';
import { GetStarted } from './GetStarted';
import { RecoverWallet } from './RecoverWallet';
import { Home } from './Home';
import { BackupWallet } from './BackupWallet';
import { ResetPasscode } from './ResetPasscode';
import { ExportWallet } from './ExportWallet';
import { FundWallet } from './FundWallet';
import { PaymentDetails } from './PaymentDetails';
import { Pay } from './Pay';
import { PayEntry } from './PayEntry';
import { PayReview } from './PayReview';

import {
  Icon,
  Image,
  HStack,
  Heading,
} from '@gluestack-ui/themed';
import { X, Bell, ArrowLeft } from 'lucide-react-native';

import { config } from "../gluestack-ui.config"
import { config as AppConfig } from '../app.config';
import { PROXY_SERVER_HOST, PROXY_SERVER_PORT } from "@env";

import {
  initMPCKeyService,
  initMPCSdk,
  initMPCWalletService,
  initPoolService,
} from '@coinbase/waas-sdk-react-native';
import {
  setNetworks
} from '../app/global';

import { listNetworks } from '../api/apiCalls';

const Stack = createNativeStackNavigator();

export const Main = () => {

  const dispatch = useDispatch();

  const address = useSelector(state => state.global.address);

  useEffect(() => {
    let initServices = async function () {

      const proxyUrl = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}`;
      try {
        // Initialize the MPCKeyService and MPCSdk.
        await initMPCSdk(true);
        await initPoolService('', '', proxyUrl);
        await initMPCKeyService('', '', proxyUrl);
        await initMPCWalletService('', '', proxyUrl);
      } catch (error) {
        console.log(error);
      }
    };

    let getNetworks = async function () {
      try {
        const listNetworksRes = await listNetworks();
        dispatch(setNetworks(listNetworksRes.networks));
      } catch (error) {
        console.log(error);
      }
    };
    
    initServices();
    getNetworks();
  }, [address]);

  return (
    <Stack.Navigator initialRouteName={address ? "Home" : "SignIn"}>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }} />
      <Stack.Screen
        name="GetStarted"
        component={GetStarted}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: config.theme.tokens.colors.background,
          },
          headerTintColor: config.theme.tokens.colors.textInverse,
          headerTitle: "",
          headerLeft: () => (
            <Icon as={ArrowLeft} color="$textInverse" size={26} onPress={() => navigation.goBack()}/>
          ),
          headerRight: () => (
            <Icon as={X} color="$textInverse" size={26} onPress={() => navigation.goBack()} />
          ),
        })}/>
      <Stack.Screen
        name="RecoverWallet"
        component={RecoverWallet}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: config.theme.tokens.colors.background,
          },
          headerTintColor: config.theme.tokens.colors.textInverse,
          headerTitle: "",
          headerLeft: () => (<></>),
          headerRight: () => (
            <Icon as={X} color="$textInverse" size={26} onPress={() => navigation.goBack()} />
          ),
        })}/>
      <Stack.Screen
        name="Home"
        component={Home}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: config.theme.tokens.colors.background,
          },
          headerTintColor: config.theme.tokens.colors.textInverse,
          headerTitle: "",
          headerLeft: () => (
            <HStack>
              <Image
                alt="logo"
                height={26}
                width={26}
                borderRadius="$full"
                source={require('../assets/logo.png')}
              />
              <Heading fontWeight={900} ml={10} size="sm" color="$textInverse">{AppConfig.theme.appName}</Heading>
            </HStack>
          ),
        })}/>
      <Stack.Screen
        name="BackupWallet"
        component={BackupWallet}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: config.theme.tokens.colors.background,
          },
          headerTintColor: config.theme.tokens.colors.textInverse,
          headerTitle: "",
          headerLeft: () => (
            <Icon as={ArrowLeft} color="$textInverse" size={26} onPress={() => navigation.goBack()}/>
          ),
          headerRight: () => (
            <Icon as={X} color="$textInverse" size={26} onPress={() => navigation.goBack()} />
          ),
        })}/>
      <Stack.Screen
        name="ResetPasscode"
        component={ResetPasscode}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: config.theme.tokens.colors.background,
          },
          headerTintColor: config.theme.tokens.colors.textInverse,
          headerTitle: "",
          headerLeft: () => (<></>),
          headerRight: () => (
            <Icon as={X} color="$textInverse" size={26} onPress={() => navigation.goBack()} />
          ),
        })}/>
      <Stack.Screen
        name="ExportWallet"
        component={ExportWallet}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: config.theme.tokens.colors.background,
          },
          headerTintColor: config.theme.tokens.colors.textInverse,
          headerTitle: "",
          headerLeft: () => (<></>),
          headerRight: () => (
            <Icon as={X} color="$textInverse" size={26} onPress={() => navigation.goBack()} />
          ),
        })}/>
      <Stack.Screen
        name="FundWallet"
        component={FundWallet}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: config.theme.tokens.colors.background,
          },
          headerTintColor: config.theme.tokens.colors.textInverse,
          headerTitle: "",
          headerLeft: () => (<></>),
          headerRight: () => (
            <Icon as={X} color="$textInverse" size={26} onPress={() => navigation.goBack()} />
          ),
        })}/>
      <Stack.Screen
        name="PaymentDetails"
        component={PaymentDetails}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: config.theme.tokens.colors.background,
          },
          headerTintColor: config.theme.tokens.colors.textInverse,
          headerTitle: "Payment details",
          headerLeft: () => (
            <Icon as={ArrowLeft} color="$textInverse" size={26} onPress={() => navigation.goBack()}/>
          ),
          headerRight: () => (
            <Icon as={X} color="$textInverse" size={26} onPress={() => navigation.goBack()} />
          ),
        })}/>
      <Stack.Screen
        name="Pay"
        component={Pay}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: config.theme.tokens.colors.background,
          },
          headerTintColor: config.theme.tokens.colors.textInverse,
          headerTitle: "Pay",
          headerLeft: () => (
            <Icon as={ArrowLeft} color="$textInverse" size={26} onPress={() => navigation.goBack()}/>
          ),
          headerRight: () => (
            <Icon as={X} color="$textInverse" size={26} onPress={() => navigation.goBack()} />
          ),
        })}/>
      <Stack.Screen
        name="PayEntry"
        component={PayEntry}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: config.theme.tokens.colors.background,
          },
          headerTintColor: config.theme.tokens.colors.textInverse,
          headerTitle: "Pay",
          headerLeft: () => (
            <Icon as={ArrowLeft} color="$textInverse" size={26} onPress={() => navigation.goBack()}/>
          ),
          headerRight: () => (
            <Icon as={X} color="$textInverse" size={26} onPress={() => navigation.goBack()} />
          ),
        })}/>
        <Stack.Screen
        name="PayReview"
        component={PayReview}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: config.theme.tokens.colors.background,
          },
          headerTintColor: config.theme.tokens.colors.textInverse,
          headerTitle: "Review",
          headerLeft: () => (
            <Icon as={ArrowLeft} color="$textInverse" size={26} onPress={() => navigation.goBack()}/>
          ),
          headerRight: () => (
            <Icon as={X} color="$textInverse" size={26} onPress={() => navigation.goBack()} />
          ),
        })}/>
    </Stack.Navigator>
  );
};
