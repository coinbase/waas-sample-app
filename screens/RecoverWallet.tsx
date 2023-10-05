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
import { useDispatch } from 'react-redux';
import {
  Button,
  ButtonText,
  Box,
  Text,
  Heading,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
  VStack,
  Textarea,
  TextareaInput,
  Spinner
} from '@gluestack-ui/themed';
import {
  getRegistrationData,
  bootstrapDevice,
  computeAddDeviceMPCOperation 
} from '@coinbase/waas-sdk-react-native';
import {
  setDevice,
  setDeviceGroupName,
  setWallet,
  setAddress,
  setPool,
  setPasscode as storePasscode
} from '../app/global';
import { registerDevice, addDevice, fetchMpcOperations, listWallets, listAddresses } from '../api/apiCalls';
import { config as AppConfig } from '../app.config';
import { v4 as uuidv4 } from 'uuid';
import { retry } from '../utils/utils';

export const RecoverWallet = ({navigation}) => {

  const MAX_RETRIES = 5;
  const DELAY_MS = 1000;

  const dispatch = useDispatch();

  const [recoveringWallet, setRecoveringWallet] = useState(false);
  const [deviceBackup, setDeviceBackup] = useState("");
  const [computeStatus, setComputeStatus] = useState();
  const [passcode, setPasscode] = useState("");
  const [mpcOperations, setMpcOperations] = useState([]);

  const compute = async () => {
      let backupBundle;
      try {
        backupBundle = JSON.parse(deviceBackup);
      } catch(error) {}
      try {
        if (backupBundle && backupBundle.backup) {
          for (const mpcOperation of mpcOperations) {
            const mpcData = mpcOperation!.mpcData;
            const status = await computeAddDeviceMPCOperation(mpcData, passcode, backupBundle.backup);
            if (status === "success") {
              setComputeStatus(status);
            }
          }
        }
    } catch (error) {
      console.error(error);
      console.log("Cannot compute add device MPC operation.");
    }
  }

  useEffect(() => {
      const restoreData = async () => {
        if (deviceBackup && deviceBackup.length > 0) {
          const backupBundle = JSON.parse(deviceBackup);
          const listWalletsRes = await listWallets(backupBundle.pool.name);
          const wallet = listWalletsRes.mpcWallets[0];
          dispatch(setWallet(wallet));
          const listAddressesRes = await listAddresses(AppConfig.defaultNetwork, wallet.name);
          const address = listAddressesRes.addresses[0];
          dispatch(setAddress(address));
          setRecoveringWallet(false);
          navigation.navigate('Home');
        }
      };
      restoreData();
  }, [computeStatus]);

  useEffect(() => {
      const computeMPCOperation = async () => {
          if (mpcOperations && mpcOperations.length > 0) {
              await compute();
          }
      };
      computeMPCOperation();
  }, [mpcOperations]);

  const recoverWallet = async () => {
    try {
      setRecoveringWallet(true);
      const backupBundle = JSON.parse(deviceBackup);
      dispatch(setPool(backupBundle.pool));
      dispatch(setDeviceGroupName(backupBundle.deviceGroup));

      await bootstrapDevice(passcode);
      dispatch(storePasscode(passcode));

      const regData = await getRegistrationData();
      const registeredDevice = await registerDevice(regData);
      dispatch(setDevice(registeredDevice));

      const requestId = uuidv4();
      await addDevice(registeredDevice?.name, requestId, backupBundle.deviceGroup);

      const res = await retry(fetchMpcOperations, MAX_RETRIES, DELAY_MS, backupBundle.deviceGroup);
      setMpcOperations(res.mpcOperations);
    } catch (e) {
      setRecoveringWallet(false);
      console.log(e);
    }
  }

  const title = "Recover wallet"
  const description = "To recover your wallet you must enter a passcode and add your backup file."
  return (
    <Box flex={1} bg="$background" h="100%" padding="$2">
        <VStack
          flex={1}
          alignItems="left"
          marginTop="$12"
          >
          <Box w="$80">
            <Heading size="2xl" color="$textInverse">{title}</Heading>
            <Text color="$textInverse">{description}</Text>
          </Box>
          <Box alignSelf="center" w="$full" mt="$6">
            <FormControl
              size="sm"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
              isRequired={false}
            >
              <FormControlLabel mb="$1">
                <FormControlLabelText color="$textInverse">Wallet backup</FormControlLabelText>
              </FormControlLabel>
              <Textarea
                mb="$4"
                size="md"
                isReadOnly={false}
                isInvalid={false}
                isDisabled={false}
                w="$full"
              >
                <TextareaInput placeholder="Enter your wallet backup here..." value={deviceBackup} onChangeText={value => setDeviceBackup(value)} />
              </Textarea>
              <FormControlLabel mb="$1">
                <FormControlLabelText color="$textInverse">Passcode</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField type="password" placeholder="Passcode" value={passcode} onChangeText={value => setPasscode(value)} />
              </Input>
              <FormControlHelper>
                <FormControlHelperText>
                  6 character minimum
                </FormControlHelperText>
              </FormControlHelper>
              <FormControlError>
                <FormControlErrorText>
                  Atleast 6 characters are required.
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </Box>
        </VStack>
          <Button
          size="md"
          variant="solid"
          action="primary"
          isDisabled={!(deviceBackup && deviceBackup.length > 0) || (!passcode || passcode?.length < 6)}
          isFocusVisible={false}
          onPress={() => recoverWallet()}
          >
          { recoveringWallet && <Spinner color="$text" /> }
          { !recoveringWallet && <ButtonText color="$text">Recover wallet</ButtonText> }
          </Button>
    </Box>
  );
};