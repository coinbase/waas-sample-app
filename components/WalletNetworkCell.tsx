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
import React, { useState, useEffect } from 'react';
import {
  Text,
  HStack,
  Avatar,
  AvatarImage,
  VStack,
  Pressable,
  Icon,
} from '@gluestack-ui/themed';
import { truncateAddress } from '../utils/utils';
import { getNetworkLogo } from '../utils/utils';
import { Copy } from 'lucide-react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { ethToUsd, roundNumber } from '../utils/utils';
import { ethers } from "ethers";

export const WalletNetworkCell = ({network, address, balance}) => {

    const logo = getNetworkLogo(network.name);

    const copyAddress = () => {
      Clipboard.setString(address);
    };

    const [ethBalance, setEthBalance] = useState(0);
    const [usdBalance, setUsdBalance] = useState(0);

    useEffect(() => {
      convertBalances();
    }, [balance]);

    const convertBalances = async () => {
      try {
        const eth = roundNumber(Number(ethers.formatEther(balance)));
        const usd = await ethToUsd(eth);
        setEthBalance(eth);
        setUsdBalance(usd);
      } catch (error) {
        console.error(error);
      }
    }

    return (
      <HStack padding="$4" w="100%" justifyContent="space-between">
        <HStack alignItems="center">
          <Avatar bgColor="$transparent" size="sm" borderRadius="$full">
            <AvatarImage source={logo} />
          </Avatar>
          <VStack margin="$1" paddingLeft="$2" justifyContent="flex-start">
            <Text bold size="md" color="$textInverse">{network.displayName}</Text>
            <HStack>
              <Text size="md" color="$brandPrimaryForegroundMuted">{truncateAddress(address)}</Text>
              <Pressable
                ml="$2"
                justifyContent="center"
                onPress={() => { copyAddress() }}
                >
                <VStack alignItems="center">
                    <Icon as={Copy} color="$brandPrimaryForegroundMuted" size={16} />
                </VStack>
            </Pressable>
            </HStack>
          </VStack>
        </HStack>
        <VStack margin="$1" paddingRight="$2" alignItems="flex-end">
            <Text size="md" color="$textInverse">${usdBalance}</Text>
            <Text size="md" color="$brandPrimaryForegroundMuted">{ethBalance} ETH</Text>
        </VStack>
      </HStack>
    );
}