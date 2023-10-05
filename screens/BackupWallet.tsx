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
import React, { useState } from 'react';
import { useSelector } from 'react-redux'
import {
  Button,
  ButtonText,
  Box,
  Text,
  Heading,
  ButtonIcon,
  Spinner,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  FormControlHelper,
  FormControlHelperText,
  FormControlError,
  FormControlErrorText,
} from '@gluestack-ui/themed';
import { prepareDeviceBackup, fetchMpcOperations } from '../api/apiCalls';
import {
  computePrepareDeviceBackupMPCOperation,
  exportDeviceBackup
} from '@coinbase/waas-sdk-react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Clipboard from '@react-native-clipboard/clipboard';
import { Copy, Check } from 'lucide-react-native';

export const BackupWallet = ({navigation}) => {

    const pool = useSelector(state => state.global.pool);
    const deviceGroupName = useSelector(state => state.global.deviceGroupName);
    const device = useSelector(state => state.global.device);

    const [passcode, setPasscode] = useState();
    const [copyingBackup, setCopyingBackup] = useState(false);

    const [backupCopied, setBackupCopied] = useState(false);
  
    const prepareBackup = async () => {
      const requestId = uuidv4();
      try {
        await prepareDeviceBackup(device.name, requestId, deviceGroupName);
      } catch (e) {
        console.log(e);
      }
      const mpcOperationsRes = await fetchMpcOperations(deviceGroupName);
      const mpcData = mpcOperationsRes.mpcOperations[0].mpcData;
      await computePrepareDeviceBackupMPCOperation(mpcData, passcode);
      const deviceBackup = await exportDeviceBackup();
      return deviceBackup;
    };

    const copyBackup = async () => {
      setCopyingBackup(true);
      try {
        const backup = await prepareBackup();
        const bundle = {
          backup: backup,
          pool: pool,
          deviceGroup: deviceGroupName
        }
        Clipboard.setString(JSON.stringify(bundle));
        setCopyingBackup(false);
        setBackupCopied(true);
      } catch (err) {
        console.log(err);
        setCopyingBackup(false);
      }
    }

    const title = "Back up Wallet"
    const description = "Back up your wallet to recover it at a later time."
    const instructions = "Enter your passcode to copy your wallet backup"
    const message = "Save the copied wallet backup contents to a secure location."
    return (
      <Box flex={1} bg="$background" h="100%" padding="$2">
          <Box
            alignItems="left"
            marginTop="$12"
            flex={1}
            >
            <Box w="$80">
              <Heading size="2xl" color="$textInverse">{title}</Heading>
              <Text mt="$2" size="sm" color="$brandPrimaryForegroundMuted">{description}</Text>
            </Box>

            <Box h="$32" w="$full" marginTop="$8">
            <FormControl
              size="sm"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
              isRequired={false}
            >
              <FormControlLabel mb="$1">
                <FormControlLabelText color="$textInverse">{instructions}</FormControlLabelText>
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
                  6 characters are required.
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </Box>
            
            <Box h="$32" w="$full">
                <Button
                    mt="$4"
                    size="md"
                    variant="solid"
                    action="primary"
                    isDisabled={!passcode || passcode?.length < 6}
                    isFocusVisible={false}
                    onPress={() => copyBackup()}
                    marginBottom="$4"
                >
                { copyingBackup && <Spinner color="$text" /> }
                { !copyingBackup && <ButtonText color="$text">{backupCopied ? "Backup copied" : "Copy backup"}</ButtonText> }
                { !copyingBackup && <ButtonIcon ml="$2" color="$text" as={backupCopied ? Check : Copy} /> }
                </Button>
                <Text size="sm" color="$textInverse">{message}</Text>
            </Box>
          </Box>
      </Box>
    );
  };