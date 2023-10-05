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
import React from 'react';
import {
  Text,
  HStack,
  Avatar,
  AvatarImage,
  VStack,
  Pressable,
} from '@gluestack-ui/themed';
import { getNetworkLogo } from '../utils/utils';

export const WalletGenerateNetworkCell = ({network, onPress}) => {

    const logo = getNetworkLogo(network.name);

    return (
      <HStack padding="$4" w="100%" justifyContent="space-between">
        <HStack alignItems="center">
          <Avatar bgColor="$transparent" size="sm" borderRadius="$full">
            <AvatarImage source={logo} />
          </Avatar>
          <VStack margin="$1" paddingLeft="$2" justifyContent="flex-start">
            <Text bold size="md" color="$textInverse">{network.displayName}</Text>
            <Pressable onPress={onPress}><Text bold size="md" color="$brandPrimary">Generate address</Text></Pressable>
          </VStack>
        </HStack>
      </HStack>
    );
};