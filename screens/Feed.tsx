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
import { Box, Text } from '@gluestack-ui/themed';
import { TransactionFeedCell } from '../components/TransactionFeedCell';
import { mockUsers } from '../data/mockUserData';
import { computeMPCOperation } from '@coinbase/waas-sdk-react-native';
import { fetchTransactions, fetchMpcOperations } from '../api/apiCalls';
import { retry } from '../utils/utils';

export const Feed = ({navigation}) => {

  const address = useSelector(state => state.global.address);
  const wallet = useSelector(state => state.global.wallet);
  const deviceGroup = useSelector(state => state.global.deviceGroupName);

  const [mockTransactions, setMockTransactions] = useState([] as any[]);
  const [feedTransactions, setFeedTransactions] = useState([] as any[]);
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
    setupMocks();
    getTransactions();
    poll();
  }, []);

  useEffect(() => {
    getTransactions();
    poll();
  }, [mockTransactions]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setupMocks();
    getTransactions();
    poll();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [mockTransactions]);

  const setupMocks = () => {
    const transactions = mockUsers.reduce((acc, user) => {
      return [...acc, ...user.transactions];
    }, [])
    setMockTransactions(transactions);
    setFeedTransactions(transactions);
  }

  const getTransactions = async () => {
    const mpcWallet = wallet?.Name || wallet?.name;
    try {
      const json = await fetchTransactions(mpcWallet);
      const transactions = json.mpcTransactions.reverse();
      const updatedTransactions = [...transactions, ...mockTransactions];
      setFeedTransactions(updatedTransactions);
    } catch (error) { 
      console.error(error);
    }
  };

  return (
    <Box bg="$background" h="100%">
        <ScrollView contentInsetAdjustmentBehavior="automatic" refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          } showsVerticalScrollIndicator={false}>
        { feedTransactions && feedTransactions.map(transaction => {
          return <TransactionFeedCell key={transaction.name} transaction={transaction} onPress={() => {
            navigation.navigate('PaymentDetails', { transaction: transaction })}}/>
        }) }
        </ScrollView>
    </Box>
  );
};
