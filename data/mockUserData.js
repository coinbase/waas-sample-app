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
export const mockUsers = [
    {
        "username":"saralyons",
        "fullName":"Sara Lyons",
        "firstName":"Sara",
        "lastName": "Lyons",
        "email":"saralyons@example.com",
        "address": {
            "Address": "0xe87a8414C741aFb4770989Ef09a5Ac94F5dEA251",
            "Name": "networks/base-goerli/addresses/0xe87a8414C741aFb4770989Ef09a5Ac94F5dEA251",
            "MPCWallet": "pools/b8fed2c5-69de-4379-812c-97c020fdac73/mpcWallets/5c7aa44e-0813-4d13-b0cc-a5fc0fdd3723",
            "MPCKeys": [
              "pools/b8fed2c5-69de-4379-812c-97c020fdac73/deviceGroups/175e5ab5-ccd4-4a7a-991b-a4ce6a963adc/mpcKeys/66364852-6f50-3234-6f71-714c79524b68"
            ]
        },
        "transactions":[
          {
             "name": "pools/b8fed2c5-69de-4379-812c-97c020fdac73/mpcWallets/5c7aa44e-0813-4d13-b0cc-a5fc0fdd3723/mpcTransactions/01234567-abcd-0123-abcd-012345678912",
             "network": "networks/base-goerli",
             "fromAddresses": [
                 "networks/base-goerli/addresses/0xe87a8414C741aFb4770989Ef09a5Ac94F5dEA251"
             ],
             "state": "CONFIRMED",
             "transaction": {
                "input": {
                   "ethereum1559Input": {
                         "chainId": "0x14a33",
                         "nonce": 2,
                         "maxPriorityFeePerGas": "2000000000",
                         "maxFeePerGas": "100000000000",
                         "gas": 21000,
                         "fromAddress": "0xe87a8414C741aFb4770989Ef09a5Ac94F5dEA251",
                         "toAddress": "0x6d4ed22f5EcD7d9d3a0E955C05E1E151B7cfb71f",
                         "value": "230000000000000000",
                         "data": ""
                   }
                }
             }
          }
        ]
     },
     {
        "username":"juliand",
        "fullName":"Julian Delpy",
        "firstName":"Julian",
        "lastName": "Delpy",
        "email":"juliand@example.com",
        "address": {
            "Address": "0x6d4ed22f5EcD7d9d3a0E955C05E1E151B7cfb71f",
            "Name": "networks/base-goerli/addresses/0x6d4ed22f5EcD7d9d3a0E955C05E1E151B7cfb71f",
            "MPCWallet": "pools/b8fed2c5-69de-4379-812c-97c020fdac73/mpcWallets/5c7aa44e-0813-4d13-b0cc-a5fc0fdd3723",
            "MPCKeys": [
              "pools/b8fed2c5-69de-4379-812c-97c020fdac73/deviceGroups/175e5ab5-ccd4-4a7a-991b-a4ce6a963adc/mpcKeys/41694c46-7a45-3238-3635-4546554d2f52"
            ]
        },
        "transactions":[
          {
             "name": "pools/b8fed2c5-69de-4379-812c-97c020fdac73/deviceGroups/175e5ab5-ccd4-4a7a-991b-a4ce6a963adc/mpcTransactions/01234567-abcd-0123-abcd-0123456789ab",
             "network": "networks/base-goerli",
             "fromAddresses": [
                 "networks/base-goerli/addresses/0x6d4ed22f5EcD7d9d3a0E955C05E1E151B7cfb71f"
             ],
             "state": "CONFIRMED",
             "transaction": {
                "input": {
                   "ethereum1559Input": {
                         "chainId": "0x14a33",
                         "nonce": 2,
                         "maxPriorityFeePerGas": "2000000000",
                         "maxFeePerGas": "100000000000",
                         "gas": 21000,
                         "fromAddress": "0x6d4ed22f5EcD7d9d3a0E955C05E1E151B7cfb71f",
                         "toAddress": "0xe87a8414C741aFb4770989Ef09a5Ac94F5dEA251",
                         "value": "410000000000000000",
                         "data": ""
                   }
                }
             }
          }
        ]
     }
];