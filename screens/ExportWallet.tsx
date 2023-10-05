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
// import { getDeviceGroup } from '../api/apiCalls';
import {
  prepareDeviceArchive,
  computePrepareDeviceArchiveMPCOperation,
  pollForPendingDeviceArchives,
  PrepareDeviceArchiveOperation,
  getDeviceGroup,
  exportPrivateKeys,
} from '@coinbase/waas-sdk-react-native';
import { useSelector } from 'react-redux'
import Clipboard from '@react-native-clipboard/clipboard';
import { Copy, Check } from 'lucide-react-native';

export const ExportWallet = ({navigation}) => {

    const deviceGroupName = useSelector(state => state.global.deviceGroupName);
    const device = useSelector(state => state.global.device);

    const [passcode, setPasscode] = useState();
    const [copyingKeys, setCopyingKeys] = useState(false);
    const [keyCopied, setKeyCopied] = useState(false);
  
    const copyKey = async () => {
      setCopyingKeys(true);
      try {
        const key = await prepareArchive();
        Clipboard.setString(key);
        setCopyingKeys(false);
        setKeyCopied(true);
      } catch (err) {
        console.log(err);
        setCopyingKeys(false);
      }
    }
    const prepareArchive = async () => {
      const operationName = (await prepareDeviceArchive(
        deviceGroupName,
        device?.name
      )) as string;

      const pendingDeviceArchiveOperations =
      await pollForPendingDeviceArchives(deviceGroupName);

      let pendingOperation!: PrepareDeviceArchiveOperation;

      for (let i = pendingDeviceArchiveOperations.length - 1; i >= 0; i--) {
        if (
          pendingDeviceArchiveOperations[i]?.Operation === operationName
        ) {
          pendingOperation = pendingDeviceArchiveOperations[
            i
          ] as PrepareDeviceArchiveOperation;

          break;
        }
      }

      if (!pendingOperation) {
        throw new Error(
          `could not find operation with name ${operationName}`
        );
      }
      await computePrepareDeviceArchiveMPCOperation(
        pendingOperation!.MPCData,
        passcode
      );
      return await exportKey();
    }

    const exportKey = async () => {
      const retrievedDeviceGroup = await getDeviceGroup(deviceGroupName);
      const mpcKeyExportMetadata = retrievedDeviceGroup.MPCKeyExportMetadata
      let privateKey = "";
      if (mpcKeyExportMetadata) {
          const response = await exportPrivateKeys(mpcKeyExportMetadata, passcode);
          privateKey = JSON.stringify(response);
      }
      return privateKey;
    };

    const title = "Export Wallet"
    const description = "Take your wallet with you to another provider (e.g. Metamask)."
    const instructions = "Enter your passcode to copy your keys"
    const warning = "Never share your private keys with anyone!\nThey control your accounts."
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
                    onPress={() => copyKey()}
                    marginBottom="$4"
                >
                { copyingKeys && <Spinner color="$text" /> }
                { !copyingKeys && <ButtonText color="$text">{keyCopied ? "Keys copied" : "Copy keys"}</ButtonText> }
                { !copyingKeys && <ButtonIcon ml="$2" color="$text" as={keyCopied ? Check : Copy} /> }
                </Button>
                <Text size="sm" color="$brandNegative">Warning</Text>
                <Text size="sm" color="$textInverse">{warning}</Text>
            </Box>
          </Box>
      </Box>
    );
  };