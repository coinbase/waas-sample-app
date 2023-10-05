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
  VStack,
  Icon,
  Pressable,
} from '@gluestack-ui/themed';
import { ChevronRight } from 'lucide-react-native';

export const AccountCell = ({title, onPress}) => {
    return (
      <Pressable onPress={onPress}  p="$4" w="100%">
        <HStack w="100%" justifyContent="space-between">
          <HStack alignItems="center">
            <VStack margin="$2" justifyContent="flex-start">
              <Text size="md" color="$textInverse">{title}</Text>
            </VStack>
          </HStack>
          <VStack margin="$2">
              <Icon as={ChevronRight} color="$textInverse" size={16} />
          </VStack>
        </HStack>
      </Pressable> 
    );
}