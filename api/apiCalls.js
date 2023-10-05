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
import { ethers } from "ethers";
import { PROXY_SERVER_HOST, PROXY_SERVER_PORT } from "@env"
import { config as AppConfig } from "../app.config";

const NETWORK = AppConfig.defaultNetwork;
const CHAIN_ID = AppConfig.defaultChainId;

export const listNetworks = async () => {
    const url = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}/v1/networks`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Server returned (${res.status}):
        ${JSON.stringify((await res.json()).message)}`);
    }
    return await res.json();
};

export const listWallets = async (poolName) => {
    const url = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}/v1/${poolName}/mpcWallets`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Server returned (${res.status}):
        ${JSON.stringify((await res.json()).message)}`);
    }
    return await res.json();
};

export const listAddresses = async (networkName, walletName) => {
    const url = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}/v1/${networkName}/addresses?mpcWallet=${walletName}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Server returned (${res.status}):
        ${JSON.stringify((await res.json()).message)}`);
    }
    return await res.json();
};

export const listBalances = async (addressName) => {
    const url = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}/v1/${addressName}/balances`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Server returned (${res.status}):
        ${JSON.stringify((await res.json()).message)}`);
    }
    return await res.json();
};

export const fetchTransactions = async (walletName) => {
    const url = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}/v1/${walletName}/mpcTransactions`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Server returned (${res.status}):
        ${JSON.stringify((await res.json()).message)}`);
    }
    return await res.json();
};

export const fetchBalance = async (addressName) => {
    const url = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}/v1/${addressName}/balances`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Server returned (${res.status}):
        ${JSON.stringify((await res.json()).message)}`);
    }
    return await res.json();
};

export const fetchMpcOperations = async (deviceGroupName) => {
    const url = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}/v1/${deviceGroupName}/mpcOperations`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Server returned (${res.status}):
        ${JSON.stringify((await res.json()).message)}`);
    }
    return await res.json();
}

export const getDeviceGroup = async (deviceGroupName) => {
    const url = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}/v1/${deviceGroupName}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Server returned (${res.status}):
        ${JSON.stringify((await res.json()).message)}`);
    }
    return await res.json();
}

export const estimateFee = async () => {
    const url = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}/v1/${NETWORK}:estimateFee`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Server returned (${res.status}):
        ${JSON.stringify((await res.json()).message)}`);
    }
    return await res.json();
}

export const createTransaction = async (walletName, fromAddress, toAddress, value, fees) => {
    const transactionFromAddressName = fromAddress?.Name || fromAddress?.name;
    const transactionFromAddress = fromAddress?.Address || fromAddress?.address;
    const transactionToAddress = toAddress?.Address || toAddress?.address;
    const url = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}/v1/${walletName}/mpcTransactions`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        mpc_transaction: {
            network: NETWORK,
            from_addresses: [
                transactionFromAddressName
            ]
        },
        input: {
            ethereum1559Input: {
                chain_id: CHAIN_ID,
                value: ethers.parseUnits(value.toString(),'ether').toString(),
                from_address: transactionFromAddress,
                to_address: transactionToAddress,
                max_priority_fee_per_gas: fees?.ethereumFeeEstimate?.maxPriorityFeePerGas,
                max_fee_per_gas: fees?.ethereumFeeEstimate?.maxFeePerGas,
                gas: 21000
            }
        },
        }),
    });
    if (!res.ok) {
        throw new Error(`Server returned (${res.status}):
        ${JSON.stringify((await res.json()).message)}`);
    }
    return await res.json();
}

export const createPool = async (displayName) => {
    const url = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}/v1/pools`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            displayName,
        }),
    });
    if (!res.ok) {
        throw new Error(`Server returned (${res.status}):
        ${JSON.stringify((await res.json()).message)}`);
    }
    return await res.json();
};

export const registerDevice = async (registrationData) => {
    const url = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}/v1/device:register`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            registrationData,
        }),
    });
    if (!res.ok) {
        throw new Error(`Server returned (${res.status}): ${JSON.stringify((await res.json()).message)}`);
    }
    return await res.json();
};

export const prepareDeviceBackup = async (device, requestId, deviceGroupName) => {
    const url = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}/v1/${deviceGroupName}:prepareDeviceBackup`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            device,
            requestId,
        }),
    });
    if (!res.ok) {
        throw new Error(`Server returned (${res.status}): ${JSON.stringify((await res.json()).message)}`);
    }
    return await res.json();
};

export const addDevice = async (device, requestId, deviceGroupName) => {
    const url = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}/v1/${deviceGroupName}:addDevice`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            device,
            requestId,
        }),
    });
    if (!res.ok) {
        throw new Error(`Server returned (${res.status}): ${JSON.stringify((await res.json()).message)}`);
    }
    return await res.json();
};

export const createDeviceGroup = async (poolName, devices) => {
    const url = `${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}/v1/${poolName}/deviceGroups`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            devices,
        }),
    });
    if (!res.ok) {
        throw new Error(`Server returned (${res.status}): ${JSON.stringify((await res.json()).message)}`);
    }
    return await res.json();
};