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

export const truncateAddress = (address) => {
    if (!address) return "No Account";
    const match = address.match(
      /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
    );
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
  };

export const getNetworkLogo = (networkName) => {
  const baseLogo = require('../assets/base.png');
  const ethereumLogo = require('../assets/ethereum.png');
  const logoMap = {
    "networks/ethereum-mainnet": ethereumLogo,
    "networks/ethereum-goerli": ethereumLogo,
    "networks/base-goerli": baseLogo,
    "networks/base-mainnet": baseLogo,
  };
  return logoMap[networkName];
}

const getEthPrice = async () => {
  const url = `https://api.coinbase.com/v2/exchange-rates?currency=ETH`;
  const res = await fetch(url);
  if (!res.ok) {
      throw new Error(`Server returned (${res.status}):
      ${JSON.stringify((await res.json()).message)}`);
  }
  const json = await res.json();
  const ethPrice = json.data.rates.USD;
  return ethPrice;
};

export const roundNumber = (value: any) => {
  return Math.round((value + Number.EPSILON) * 10000) / 10000 + .0000;
}

export const ethToUsd = async (ether: any) => {
  const ethPrice: any = await getEthPrice();
  const totalPrice = ether * ethPrice;
  return Math.round((totalPrice + Number.EPSILON) * 100) / 100 + .00;
}

export const usdToETH = async (usd: any) => {
  const ethPrice: any = await getEthPrice();
  const totalEther = usd / ethPrice;
  return Math.round((totalEther + Number.EPSILON) * 10000) / 10000 + .0000;
}

export const retry = async (fn, maxRetries, delayMs, ...args) => {
  return new Promise((resolve, reject) => {
    const attempt = async (retryCount) => {
      try {
        const result = await fn(...args);
        resolve(result);
      } catch (error) {
        if (retryCount < maxRetries) {
          setTimeout(() => attempt(retryCount + 1), delayMs);
        } else {
          reject(error);
        }
      }
    };
    attempt(0);
  });
}