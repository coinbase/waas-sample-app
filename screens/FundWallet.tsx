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
  Box,
  Text,
  Heading,
  HStack,
  Link,
  LinkText,
} from '@gluestack-ui/themed';

export const FundWallet = ({navigation}) => {

    const title = "How to fund your wallet"

    return (
      <Box flex={1} bg="$background" h="100%" p="$4">
          <Box
            marginTop="$12"
            flex={1}
            >
            <Box w="$full">
              <Heading size="xl" color="$textInverse">{title}</Heading>
            </Box>
            
            <Box w="$full" marginTop="$6">
                <HStack borderTopWidth={1} borderColor="$brandPrimaryForegroundMuted" gap="$2" pt="$4" pb="$4">
                    <Text bold fontWeight="900" size="md" color="$textInverse">1</Text>
                    <Text size="md" color="$textInverse">Copy your wallet address</Text>
                </HStack>
                <HStack borderTopWidth={1} borderColor="$brandPrimaryForegroundMuted" gap="$2" pt="$4" pb="$4">
                    <Text bold fontWeight="900" size="md" color="$textInverse">2</Text>
                    <Link href="https://faucet.triangleplatform.com/base/goerli"><LinkText size="md" color="$textInverse">Visit Base Goerli Faucet</LinkText></Link>
                </HStack>
                <HStack borderTopWidth={1} borderColor="$brandPrimaryForegroundMuted" gap="$2" pt="$4" pb="$4">
                    <Text bold fontWeight="900" size="md" color="$textInverse">3</Text>
                    <Text size="md" color="$textInverse">Paste your wallet address</Text>
                </HStack>
                <HStack borderTopWidth={1} borderBottomWidth={1}  borderColor="$brandPrimaryForegroundMuted" gap="$2" pt="$4" pb="$4">
                    <Text bold fontWeight="900" size="md" color="$textInverse">4</Text>
                    <Text size="md" color="$textInverse">Click Request 0.001 ETH</Text>
                </HStack>
            </Box>
          </Box>
      </Box>
    );
  };