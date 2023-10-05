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
import {
  Box,
  Text,
  HStack,
  Avatar,
  AvatarFallbackText,
  VStack,
  Button,
  ButtonText,
  Heading,
  Input,
  InputField,
} from '@gluestack-ui/themed';
import { truncateAddress, usdToETH } from '../utils/utils';
import { mockUsers } from '../data/mockUserData';
import { config as AppConfig } from '../app.config';

export const PayEntry = ({ route, navigation }) => {

    const { address } = route.params;

    const [paymentUsd, setPaymentUsd] = useState("");
    const [paymentEth, setPaymentEth] = useState("0");
    const [user, setUser] = useState({
        username: null,
        address: {
            Address: address,
            Name: `${AppConfig.defaultNetwork}/addresses/${address}`
        }
    });

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        convertPayment();
      }, [paymentUsd]);

    const getUser = () => {
        const userAddress = user.address?.Address || user.address?.address;
        const users = mockUsers.filter((user) => userAddress.toLowerCase() === address.toLowerCase());
        if (users.length > 0) {
            setUser(users[0] as any);
        }
    }

    const convertPayment = async () => {
      try {
        const eth = await usdToETH(paymentUsd);
        setPaymentEth(eth);
      } catch (error) {
        console.error(error);
      }
    }

    return (
        <Box flex={1} h="100%" bg="$background" p="$2">
            <Box flex={1}>
                <HStack pb="$8" pt="$8" w="100%" justifyContent="center">
                    <VStack alignItems="center">
                        <Avatar bgColor="$brandPrimary" size="lg" borderRadius="$full">
                            <AvatarFallbackText>{user.fullName ? user.fullName : ""}</AvatarFallbackText>
                        </Avatar>
                        <VStack marginTop="$4" alignItems="center" justifyContent="center">
                            <Heading size="md" color="$textInverse">{user.fullName ? user.fullName : truncateAddress(user.address?.Address || user.address?.address)}</Heading>
                            <HStack ml="$6" mt="$1" mb="$2" >
                                <Text size="2xl" mt="$1" color="$textInverse">$</Text>
                                <Input isFocused={true} autofocus variant="payment" width={`${50 + (1 + paymentUsd?.length)}%`}>
                                    <InputField autofocus variant="payment" type="text" width={`${50 + (1 + paymentUsd?.length)}%`} placeholder="0" value={paymentUsd} onChangeText={value => setPaymentUsd(value)} />
                                </Input>
                            </HStack>
                            <Text size="md">{paymentEth} ETH</Text>
                        </VStack>
                    </VStack>
                </HStack>
            </Box>
            <Button
                size="md"
                variant="solid"
                action="primary"
                isDisabled={!paymentUsd || paymentUsd?.length <= 0}
                isFocusVisible={false}
                onPress={() => {navigation.navigate('PayReview', { 
                    user: user,
                    paymentUsd: paymentUsd,
                    paymentEth: paymentEth,
                })}}
            >
                <ButtonText color="$text">Pay</ButtonText>
            </Button>
        </Box>
    )
};