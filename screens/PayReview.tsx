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
  Box,
  Text,
  HStack,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  VStack,
  Button,
  ButtonText,
  Heading,
} from '@gluestack-ui/themed';
import { computeMPCOperation } from '@coinbase/waas-sdk-react-native';
import { getNetworkLogo, truncateAddress, ethToUsd} from '../utils/utils';
import { config as AppConfig } from '../app.config';
import { estimateFee, createTransaction, fetchBalance, fetchMpcOperations } from '../api/apiCalls';
import { ethers } from "ethers";
import { retry } from '../utils/utils';

const PaymentDetailNoteCell = ({note}) => {
    return (
        <HStack padding="$3.5" w="100%" justifyContent="space-between">
        <HStack alignItems="center">
          <VStack paddingLeft="$2" justifyContent="flex-start">
            <Text bold size="sm" color="$textInverse">Note</Text>
            <Text size="sm" color="$brandPrimaryForegroundMuted">{note}</Text>
          </VStack>
        </HStack>
      </HStack>
    );
}

const PaymentDetailsNetworkCell = ({networkName}) => {
    const networks = useSelector(state => state.global.networks);
    const networkList = networks.filter(network => network.name === networkName);
    const network = networkList[0];
    const logo = getNetworkLogo(networkName);

    return (
        <HStack padding="$3.5" w="100%" justifyContent="space-between">
        <HStack alignItems="center">
        <VStack paddingLeft="$2" justifyContent="flex-start">
            <Text bold size="sm" color="$textInverse">Network</Text>
        </VStack>
        </HStack>
        <HStack space="sm" alignItems="flex-end">
            <Avatar bgColor="$transparent" size="xs" borderRadius="$full">
                <AvatarImage source={logo} />
            </Avatar>
            <Text size="sm" color="$textInverse">{network.displayName}</Text>
        </HStack>
        </HStack>
    );
}

const PaymentDetailsGenericCell = ({title, detail, subdetail}) => {
    return (
        <HStack padding="$3.5" w="100%" justifyContent="space-between">
        <HStack alignItems="center">
        <VStack paddingLeft="$2" justifyContent="flex-start">
            <Text bold size="sm" color="$textInverse">{title}</Text>
        </VStack>
        </HStack>
        <HStack space="sm" alignItems="center">
            <VStack alignItems="flex-end">
                <Text size="sm" color="$textInverse">{detail}</Text>
                <Text size="sm" color="$brandPrimaryForegroundMuted">{subdetail}</Text>
            </VStack>
        </HStack>
        </HStack>
    );
}

export const PayReview = ({route, navigation}) => {

    const { user, paymentUsd, paymentEth } = route.params;

    const address = useSelector(state => state.global.address);
    const wallet = useSelector(state => state.global.wallet);
    const deviceGroup = useSelector(state => state.global.deviceGroupName);

    const [networkFeeEth, setNetworkFeeEth] = useState("0");
    const [networkFeeUsd, setNetworkFeeUsd] = useState(0);
    const [balanceEth, setBalanceEth] = useState("0");
    const [balanceUsd, setBalanceUsd] = useState(0);

    const [txMetadata, setTxMetadata] = useState(null);
    const [mpcOperations, setMpcOperations] = useState([]);

    const MAX_RETRIES = 5;
    const DELAY_MS = 1000;

    useEffect(() => {
        getNetworkFees();
        getBalance();
      }, []);

    const getNetworkFees = async () => {
        try {
            const fees = await estimateFee();
            const gas = 21000;
            const networkFee = (
                Number(fees?.ethereumFeeEstimate?.maxFeePerGas) +
                Number(fees?.ethereumFeeEstimate?.maxPriorityFeePerGas)) * gas;
            const eth = ethers.formatEther(networkFee);
            const usd = await ethToUsd(eth);
            setNetworkFeeEth(eth);
            setNetworkFeeUsd(usd);
        } catch (error) {
            console.error(error);
        }
    }

    const getBalance = async () => {
        try {
            const addressName = address?.Name || address?.name;
            const fetchBalanceRes = await fetchBalance(addressName);
            const balances = fetchBalanceRes.balances;
            const balance = balances ? balances[0].amount : "0";
            const eth = ethers.formatEther(balance);
            const usd = await ethToUsd(eth);
            setBalanceEth(eth);
            setBalanceUsd(usd);
        } catch (error) {
            console.error(error);
        }
    }

    const resetState = () => {
        setNetworkFeeEth("0");
        setNetworkFeeUsd(0);
        setBalanceEth("0");
        setBalanceUsd(0);
    };

    const compute = async () => {
        try {
          for (const mpcOperation of mpcOperations) {
            const mpcData = mpcOperation!.mpcData;
            await computeMPCOperation(mpcData);
          }
        } catch (error) {
          console.error(error);
          console.log("Cannot compute MPC operation.");
        }
    }

    const poll = async () => {
        try {
            const res = await retry(fetchMpcOperations, MAX_RETRIES, DELAY_MS, deviceGroup);
            setMpcOperations(res.mpcOperations);
        } catch (error) {
          console.error(error);
          console.log("Cannot fetch MPC operations.");
        }
      }

    const pay = async () => {
        const walletName = wallet?.Name || wallet?.name;
        try {
          const fees = await estimateFee();
          const res = await createTransaction(walletName, address, user.address, paymentEth, fees);
          setTxMetadata(res.metadata);
          resetState();
          navigation.navigate('Home');
        } catch (error) {
            console.error(error);
            console.log("Cannot create transaction.");
        }
    };

    useEffect(() => {
        const computeMPCOperation = async () => {
            if (mpcOperations) {
                await compute();
            }
        };
        computeMPCOperation();
    }, [mpcOperations]);
    
    useEffect(() => {
        const fetchTxMetadata = async () => {
            if (txMetadata) {
                await poll();
            }
        };
        fetchTxMetadata();
    }, [txMetadata]);

    return (
        <Box flex={1} bg="$background" h="100%" p="$2">
            <Box flex={1}>
                <HStack pb="$8" pt="$8" w="100%" justifyContent="center">
                    <VStack alignItems="center">
                        <Avatar bgColor="$brandPrimary" size="lg" borderRadius="$full">
                            <AvatarFallbackText>{user.fullName ? user.fullName : ""}</AvatarFallbackText>
                        </Avatar>
                        <VStack marginTop="$4" alignItems="center" justifyContent="center">
                            <Heading size="md" color="$textInverse">{user.fullName ? user.fullName : truncateAddress(user.address?.Address || user.address?.address)}</Heading>
                            <HStack mt="$1">
                            <Text size="2xl" mt="$1" color="$textInverse">$</Text>
                            <Text size="4xl" color="$textInverse">{paymentUsd}</Text>
                            </HStack>
                            <Text size="md">{paymentEth} ETH</Text>
                        </VStack>
                    </VStack>
                </HStack>
                <VStack>
                    <PaymentDetailsGenericCell title="To" detail={user.fullName ? user.fullName : ""} subdetail={truncateAddress(user.address?.Address || user.address?.address)} />
                    <PaymentDetailsGenericCell title="Account balance" detail={`$${balanceUsd}`} subdetail={`${balanceEth} ETH`} />
                    <PaymentDetailsNetworkCell networkName={AppConfig.defaultNetwork}/>
                    <PaymentDetailsGenericCell title="Network fee" detail={`$${networkFeeUsd}`} subdetail={`${networkFeeEth} ETH`} />
                    
                </VStack>
            </Box>
            <Button
                size="md"
                variant="solid"
                action="primary"
                isDisabled={paymentUsd.length <= 0}
                isFocusVisible={false}
                onPress={() => { pay()}}
            >
                <ButtonText color="$text">Pay</ButtonText>
            </Button>
        </Box>
    )
};