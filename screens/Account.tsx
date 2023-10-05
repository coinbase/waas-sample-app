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
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ScrollView, RefreshControl } from 'react-native';
import {
  Box,
  Text,
  HStack,
  Avatar,
  AvatarFallbackText,
  VStack,
  Icon,
  Pressable,
  ButtonGroup,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import { WalletGenerateNetworkCell } from '../components/WalletGenerateNetworkCell';
import { WalletNetworkCell } from '../components/WalletNetworkCell';
import { UserHeader } from '../components/UserHeader';
import { AccountCell } from '../components/AccountCell';
import { listAddresses, listBalances } from '../api/apiCalls';
import { generateAddress, computeMPCOperation } from '@coinbase/waas-sdk-react-native';
import { fetchTransactions, fetchMpcOperations } from '../api/apiCalls';
import { mockUsers } from '../data/mockUserData';
import { ethers } from 'ethers';
import { ethToUsd } from '../utils/utils';
import { AlertCircle, CheckCircle, CheckCircle2 } from 'lucide-react-native';
import { retry } from '../utils/utils';

const WalletTab = ({navigation}) => {

    const address = useSelector(state => state.global.address);
    const networks = useSelector(state => state.global.networks);
    const wallet = useSelector(state => state.global.wallet);
    const deviceGroup = useSelector(state => state.global.deviceGroupName);

    const [networksToAddresses, setNetworksToAddresses] = useState<Map<string, any>>(new Map());
    const [addressesToBalances, setAddressesToBalances] = useState<Map<string, any>>(new Map());
    const [newAddresses, setNewAddresses] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [mpcOperations, setMpcOperations] = useState([]);

    const MAX_RETRIES = 5;
    const DELAY_MS = 1000;
  
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

    useEffect(() => {
        const computeMPCOperation = async () => {
            if (mpcOperations) {
                await compute();
            }
        };
        computeMPCOperation();
    }, [mpcOperations]);

    useEffect(() => {
        getAddresses();
    }, [networks, newAddresses]);

    useEffect(() => {
        getBalances();
    }, [networksToAddresses]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getAddresses();
        getBalances();
        poll();
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
    }, []);
    
    const getAddresses = async () => {
        let networkToAddressesMap: Map<string, any> = new Map();
        for (const network of networks) {
            try {
                const networkName = network.name as string;
                const walletName = wallet?.Name || wallet?.name
                const listAddressesRes = await listAddresses(networkName, walletName);
                networkToAddressesMap.set(networkName, listAddressesRes.addresses);
              } catch (error) {
                console.log(error);
              }
        }
        setNetworksToAddresses(networkToAddressesMap);
    }

    const getBalances = async () => {
        let addressToBalanceMap: Map<string, any> = new Map();
        for (const network of networks) {
            try {
                const addresses = networksToAddresses.get(network.name)
                if (addresses && addresses.length > 0) {
                    for (const address of addresses) {
                        const addressName = address.name as string;
                        const listBalancesRes = await listBalances(addressName);
                        addressToBalanceMap.set(addressName, listBalancesRes.balances);
                    }
                }                
              } catch (error) {
                console.log(error);
              }
        }
        setAddressesToBalances(addressToBalanceMap);
    }

    const generateNewAddress = async (networkName) => {
        const walletName = wallet?.Name || wallet?.name;
        const address = await generateAddress(
            walletName,
            networkName
          );
        const newAddresses = [...newAddresses, address];
        setNewAddresses(newAddresses)
    }

    return (
        <>
        <Box marginBottom="$4" p="$4" w="100%">
            <ButtonGroup space="md" direction="column">
                <Button
                size="md"
                variant="solid"
                action="primary"
                isDisabled={false}
                isFocusVisible={false}
                onPress={() => navigation.navigate('FundWallet')}
                >
                <ButtonText color="$text">Add Base testnet funds</ButtonText>
                </Button>
            </ButtonGroup>
        </Box>
        <ScrollView contentInsetAdjustmentBehavior="automatic" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} showsVerticalScrollIndicator={false}>
            { networks.map((network) => {
                const addresses = networksToAddresses.get(network.name);
                if(addresses && addresses.length > 0) {
                    const address = addresses[0];
                    const addressBalances = addressesToBalances.get(address.name);
                    if (addressBalances) {
                        const balance = addressBalances.length === 0 ? "0" : addressBalances[0].amount;
                        return <WalletNetworkCell key={network.displayName} network={network} address={address.address} balance={balance} />
                    }
                }
            })}
            { networks.map((network) => {
                const addresses = networksToAddresses.get(network.name);
                if(addresses && addresses.length === 0) {
                    return <WalletGenerateNetworkCell key={network.displayName} network={network} onPress={() => generateNewAddress(network.name)}/>
                }
            })}
        </ScrollView>
        </>
    );
};

export const RequestCell = ({senderName, receiverName, note, balance}) => {
    return (
      <VStack w="100%">
        <HStack justifyContent="space-between">
            <HStack alignItems="center">
            <Avatar bgColor="$brandPrimary" size="sm" borderRadius="$full">
                <AvatarFallbackText>{senderName}</AvatarFallbackText>
            </Avatar>
            <VStack p="$2" margin="$1" paddingLeft="$2" justifyContent="flex-start">
                <Text bold size="md" color="$textInverse">{senderName} sent {receiverName} a request</Text>
                <Text size="md" color="$brandPrimaryForegroundMuted">{note}</Text>
            </VStack>
            </HStack>
            <VStack p="$2" margin="$1" paddingRight="$2">
                {/* TODO: Convert balance from ETH to USD */}
                <Text size="md" color="$textInverse">${balance}</Text>
                <Text size="md" color="$brandPrimaryForegroundMuted">{balance} ETH</Text>
            </VStack>
        </HStack>
        <ButtonGroup gap="$1" mt="$2" space="md" direction="row">
                <Button
                flex={1}
                size="md"
                variant="solid"
                action="primary"
                minHeight="$2"
                isDisabled={false}
                isFocusVisible={false}
                onPress={() => {}}
                >
                <ButtonText color="$text">Remind</ButtonText>
                </Button>
                <Button
                flex={1}
                size="md"
                variant="outline"
                action="primary"
                minHeight="$2"
                isDisabled={false}
                isFocusVisible={false}
                onPress={() => {}}
                >
                <ButtonText>Cancel</ButtonText>
                </Button>
            </ButtonGroup>
      </VStack>
    );
}

export const TransactionCell = ({transaction, onPress}) => {

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

    useEffect(() => {
        getTransactionValue();
    }, [])

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
      <HStack pt="$2" w="100%" justifyContent="space-between">
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

const TransactionsTab = ({ navigation }) => {

    const wallet = useSelector(state => state.global.wallet);
    const address = useSelector(state => state.global.address);
    const deviceGroup = useSelector(state => state.global.deviceGroupName);

    const [inProgressTransactions, setInProgressTransactions] = useState([] as any[]);
    const [completedTransactions, setCompletedTransactions] = useState([] as any[]);
    const [refreshing, setRefreshing] = useState(false);
    const [mpcOperations, setMpcOperations] = useState([]);

    const MAX_RETRIES = 5;
    const DELAY_MS = 1000;
  
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

    useEffect(() => {
        const computeMPCOperation = async () => {
            if (mpcOperations) {
                await compute();
            }
        };
        computeMPCOperation();
    }, [mpcOperations]);
  
    useEffect(() => {
        getTransactions();
        poll();
      }, []);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      getTransactions();
      poll();
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }, []);

    const getTransactions = async () => {
        const mpcWallet = wallet?.Name || wallet?.name;
        const userAddress = address?.Address || address?.address;
        try {
            const json = await fetchTransactions(mpcWallet);
            const transactions = json.mpcTransactions.reverse();
            const inprogress = transactions.filter(transaction => {
                const status = transaction.state
                const details = transaction.transaction.input.ethereum1559Input
                return (status == "CREATED" ||
                    status == "SIGNING" ||
                    status == "SIGNED" ||
                    status == "CONFIRMING") && (details.fromAddress === userAddress ||
                        details.toAddress === userAddress);
            });
            const completed = transactions.filter(transaction => {
                const status = transaction.state
                const details = transaction.transaction.input.ethereum1559Input
                return (status == "CONFIRMED") && (details.fromAddress === userAddress ||
                    details.toAddress === userAddress);
            });
            setInProgressTransactions(inprogress);
            setCompletedTransactions(completed);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic" refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            } showsVerticalScrollIndicator={false}>
                    {inProgressTransactions.length <= 0 && completedTransactions.length <= 0 && <Box p="$4"><Text size="md" color="$textInverse">No transactions found</Text></Box>}
        <Box p="$4">
        {inProgressTransactions.length > 0 && <Text size="sm" color="$textInverse">In progress</Text>}
            <VStack>
                {inProgressTransactions.map(transaction => <TransactionCell key={transaction.name} transaction={transaction} onPress={() => { navigation.navigate('PaymentDetails', { transaction: transaction }) }}/>)}
            </VStack>
        </Box>
        <Box p="$4">
        {completedTransactions.length > 0 && <Text size="sm" color="$textInverse">Completed</Text>}
            <VStack>
                {completedTransactions.map(transaction => <TransactionCell key={transaction.name} transaction={transaction} onPress={() => { navigation.navigate('PaymentDetails', { transaction: transaction }) }}/>)}
            </VStack>
        </Box>
        </ScrollView>
    );
};

const AccountTab = ({navigation}) => {
    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <AccountCell title="Back up wallet" onPress={() => navigation.navigate('BackupWallet')} />
          <AccountCell title="Reset passcode" onPress={() => navigation.navigate('ResetPasscode')} />
          <AccountCell title="Export wallet"  onPress={() => navigation.navigate('ExportWallet')} />
        </ScrollView>
    );
};

export const Account = ({navigation}) => {

    const [tabIndex, setTabIndex] = useState(0);

    const Tabs = () => {
        return (
          <HStack w="100%" justifyContent="start" borderBottomWidth={1} borderRadius={4} borderColor="rgba(138,145,158, .2)">
            <Pressable
                onPress={() => setTabIndex(0)}
                p="$5"
                borderBottomWidth={tabIndex == 0 ? 2 : 0}
                borderColor={tabIndex == 0 ? "$brandPrimary" : ""}
                >
                <Text bold size="md" color={tabIndex == 0 ? "$brandPrimary" : "$textInverse"}>Wallet</Text>
            </Pressable>
            <Pressable
                onPress={() => setTabIndex(1)}
                p="$5"
                borderBottomWidth={tabIndex == 1 ? 2 : 0}
                borderColor={tabIndex == 1 ? "$brandPrimary" : ""}
                >
                <Text bold size="md" color={tabIndex == 1 ? "$brandPrimary" : "$textInverse"}>Transactions</Text>
            </Pressable>
            <Pressable
                onPress={() => setTabIndex(2)}
                p="$5"
                borderBottomWidth={tabIndex == 2 ? 2 : 0}
                borderColor={tabIndex == 2 ? "$brandPrimary" : ""}
                >
                <Text bold size="md" color={tabIndex == 2 ? "$brandPrimary" : "$textInverse"}>Account</Text>
            </Pressable>
          </HStack>
        );
    };

    const UserAccount = () => {
        return (
            <Box bg="$background" h="100%">
            <UserHeader name="John Doe"/>
            <Tabs />
            {
            tabIndex == 0 ? <WalletTab navigation={navigation}/> :
            tabIndex == 1 ? <TransactionsTab navigation={navigation}/> :
            tabIndex == 2 ? <AccountTab navigation={navigation}/> : <></>
            }
            </Box>
        )
    }

    return (<><UserAccount></UserAccount></>);
};