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
  HStack,
  Avatar,
  AvatarFallbackText,
  VStack,
  Heading,
} from '@gluestack-ui/themed';

export const UserHeader = ({name}) => {
    return (
      <HStack paddingTop="$8" w="100%" justifyContent="center">
        <VStack alignItems="center">
          <Avatar bgColor="$brandPrimary" size="lg" borderRadius="$full">
            <AvatarFallbackText>{name}</AvatarFallbackText>
          </Avatar>
          <VStack marginTop="$4" paddingLeft="$2" justifyContent="flex-start">
            <Heading size="xl" color="$brandPrimary">{name}</Heading>
          </VStack>
        </VStack>
      </HStack>
    );
};