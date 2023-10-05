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
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Text,
  HStack,
  Avatar,
  AvatarFallbackText,
  VStack,
  Icon,
  Pressable,
} from '@gluestack-ui/themed';
import { mockUsers } from '../data/mockUserData';
import { ethToUsd } from '../utils/utils';
import { ethers } from "ethers";
import { AlertCircle, CheckCircle, CheckCircle2 } from 'lucide-react-native';

export const TransactionFeedCell = ({transaction, onPress}) => {

  const statusMap = {
      "CREATED": {
          displayString: "In progress",
          icon: CheckCircle2
      },
      "SIGNING": {
          displayString: "In progress",
          icon: CheckCircle2
      },
      "SIGNED": {
          displayString: "In progress",
          icon: CheckCircle2
      },
      "CONFIRMING": {
          displayString: "In progress",
          icon: CheckCircle2
      },
      "CONFIRMED": {
          displayString: "Confirmed",
          icon: CheckCircle
      },
      "FAILED": {
          displayString: "Failed",
          icon: AlertCircle
      },
      "CANCELLED": {
          displayString: "Cancelled",
          icon: AlertCircle
      },
  };

  useEffect(() => {
      getTransactionValue();
  }, [transaction])

  const address = useSelector(state => state.global.address);
  const username = useSelector(state => state.global.username);
  const email = useSelector(state => state.global.email);

  const [transactionValueEth, setTransactionValueEth] = useState("0");
  const [transactionValueUsd, setTransactionValueUsd] = useState(0);

  const transactionDetails = transaction.transaction.input.ethereum1559Input;

  const getUserFromAddress = (addressOfUser) => {
      const userMap = new Map();
      for (const user of mockUsers) {
        const userAddress = user.address?.Address || user.address?.address;
        userMap.set(userAddress, user);
      }
      const primaryUserAddress = address?.Address || address?.address;
      userMap.set(primaryUserAddress, {
        "username": username,
        "firstName": "John",
        "lastName": "Doe",
        "fullName": "John Doe",
        "email": email,
      })
      const user = userMap.get(addressOfUser);
      return user;
  }

  const getTransactionValue = async () => {
      try {
          const value = transactionDetails.value;
          const eth = ethers.formatEther(value);
          const usd = await ethToUsd(eth);
          setTransactionValueEth(eth);
          setTransactionValueUsd(usd);
      } catch (error) {
          console.error(error);
      }
  }

  const to = getUserFromAddress(transactionDetails.toAddress);
  const from = getUserFromAddress(transactionDetails.fromAddress);

  const userAddress = address?.Address || address?.address;

  return (
    <Pressable onPress={onPress}>
      <HStack padding="$4" w="100%" justifyContent="space-between">
        <HStack alignItems="center">
        <Avatar bgColor="$brandPrimary" size="sm" borderRadius="$full">
            <AvatarFallbackText>{from.fullName}</AvatarFallbackText>
          </Avatar>
          <VStack margin="$1" paddingLeft="$2" justifyContent="flex-start">
            <Text bold size="md" color="$textInverse">{transactionDetails.fromAddress === userAddress ? "You" : from.firstName} paid {transactionDetails.toAddress === userAddress ? "you" : to.firstName}</Text>
            <Text size="md" color="$brandPrimaryForegroundMuted">{statusMap[transaction.state].displayString}</Text>
          </VStack>
        </HStack>
        <HStack margin="$1" space="md" alignItems="center">
            <Text size="md" color={transactionDetails.fromAddress === userAddress ? "$brandNegative" : "$brandPositive"}>
                {transactionDetails.fromAddress === userAddress ? "-" : "+"}${transactionValueUsd}
            </Text>
            <Icon as={statusMap[transaction.state].icon} color="$textInverse" size={18} />
        </HStack>
      </HStack>
    </Pressable>
  );
};