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
  Icon,
  Heading,
  Link,
  LinkText,
} from '@gluestack-ui/themed';
import { AlertCircle, CheckCircle, CheckCircle2 } from 'lucide-react-native';
import { ethToUsd, getNetworkLogo, truncateAddress } from '../utils/utils';
import { mockUsers } from '../data/mockUserData';
import { ethers } from 'ethers';
const PaymentDetailStatusCell = ({status}) => {

    const statusMap = {
        "CREATED": {
            displayString: "Send in progress",
            icon: CheckCircle2
        },
        "SIGNING": {
            displayString: "Send in progress",
            icon: CheckCircle2
        },
        "SIGNED": {
            displayString: "Send in progress",
            icon: CheckCircle2
        },
        "CONFIRMING": {
            displayString: "Send in progress",
            icon: CheckCircle2
        },
        "CONFIRMED": {
            displayString: "Send confirmed",
            icon: CheckCircle
        },
        "FAILED": {
            displayString: "Send failed",
            icon: AlertCircle
        },
        "CANCELLED": {
            displayString: "Send cancelled",
            icon: AlertCircle
        },
    };

    return (
        <HStack padding="$3.5" w="100%" justifyContent="space-between">
        <HStack alignItems="center">
        <VStack paddingLeft="$2" justifyContent="flex-start">
            <Text bold size="sm" color="$textInverse">Details</Text>
            <Text size="sm" color="$brandPrimaryForegroundMuted">{statusMap[status].displayString}</Text>
        </VStack>
        </HStack>
        <HStack space="sm" alignItems="center">
            <VStack alignItems="flex-end">
                <Text size="sm" color="$textInverse">Today</Text>
                <Text size="sm" color="$brandPrimaryForegroundMuted">1:23PM</Text>
            </VStack>
            <Icon as={statusMap[status].icon} color="$brandPrimaryForegroundMuted" size={18} />
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
            <Text size="sm" color="$textInverse">{network.displayName}</Text>
            <Avatar bgColor="$transparent" size="xs" borderRadius="$full">
                <AvatarImage source={logo} />
            </Avatar>
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

const PaymentDetailsTransactionHashCell = ({hash}) => {
    const transactionLink = `https://basescan.org/tx/${hash}`;
    return (
        <HStack padding="$3.5" w="100%" justifyContent="space-between">
        <HStack alignItems="center">
        <VStack paddingLeft="$2" justifyContent="flex-start">
            <Text bold size="sm" color="$textInverse">Transaction</Text>
        </VStack>
        </HStack>
        <HStack space="sm" alignItems="center">
            <VStack alignItems="flex-end">
            <Link href={transactionLink}><LinkText size="sm" color="$brandPrimaryForegroundMuted">{truncateAddress(hash)}</LinkText></Link>
            </VStack>
        </HStack>
        </HStack>
    );
}

export const PaymentDetails = ({navigation, route}) => {

    useEffect(() => {
        getNetworkFees();
        getTransactionValue();
    }, [])

    const { transaction } = route.params;

    // console.log(`TRANSACTION: ${JSON.stringify(transaction)}`)
    
    const address = useSelector(state => state.global.address);
    const username = useSelector(state => state.global.username);
    const email = useSelector(state => state.global.email);

    const [networkFeeEth, setNetworkFeeEth] = useState("0");
    const [networkFeeUsd, setNetworkFeeUsd] = useState(0);
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

    const getNetworkFees = async () => {
        try {
            const networkFee = (
                Number(transactionDetails.maxFeePerGas) +
                Number(transactionDetails.maxPriorityFeePerGas)) * Number(transactionDetails.gas);
            const eth = ethers.formatEther(networkFee);
            const usd = await ethToUsd(eth);
            setNetworkFeeEth(eth);
            setNetworkFeeUsd(usd);
        } catch (error) {
            console.error(error);
        }
    }

    const to = getUserFromAddress(transactionDetails.toAddress);
    const from = getUserFromAddress(transactionDetails.fromAddress);
  
    const receiver = to ? (to.fullName) : truncateAddress(transactionDetails.fromAddress);
    const sender = from ? (from.fullName) : truncateAddress(transactionDetails.toAddress);

    return (
        <>
        <Box bg="$background" h="100%">
            <HStack pb="$8" pt="$8" w="100%" justifyContent="center">
            <VStack alignItems="center">
                <Avatar bgColor="$brandPrimary" size="lg" borderRadius="$full">
                    <AvatarFallbackText>{receiver}</AvatarFallbackText>
                </Avatar>
                <VStack marginTop="$4" alignItems="center" justifyContent="center">
                    <Heading size="md" color="$textInverse">{receiver}</Heading>
                    <HStack mt="$1">
                    <Text size="2xl" mt="$1" color="$textInverse">$</Text>
                    <Text size="4xl" color="$textInverse">{transactionValueUsd}</Text>
                    </HStack>
                    <Text size="md">{transactionValueEth} ETH</Text>
                </VStack>
            </VStack>
        </HStack>
        <VStack>
            <PaymentDetailStatusCell status={transaction.state}/>
            <PaymentDetailsGenericCell title="To" detail={to.fullName ? to.fullName : ""} subdetail={truncateAddress(transactionDetails.toAddress)} />
            <PaymentDetailsGenericCell title="From" detail={from.fullName ? from.fullName : ""} subdetail={truncateAddress(transactionDetails.fromAddress)} />
            <PaymentDetailsNetworkCell networkName={transaction.network}/>
            <PaymentDetailsGenericCell title="Network fee" detail={`$${networkFeeUsd}`} subdetail={`${networkFeeEth} ETH`} />
            {transaction.transaction.hash && <PaymentDetailsTransactionHashCell hash={transaction.transaction.hash}></PaymentDetailsTransactionHashCell>}
        </VStack>
        </Box>
        </>
    )
};