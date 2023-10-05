# waas-sample-app

A template-ized [sample wallet application](https://github.com/coinbase/waas-sample-app) that is built using the [WaaS React Native SDK](https://docs.cloud.coinbase.com/waas/docs/waas-sdk) and the [WaaS Proxy Server](https://docs.cloud.coinbase.com/waas/docs/proxy-overview).

This sample application serves as an educational resource and foundational scaffold for developers building with the WaaS APIs. It is provided as an example to guide developers in quickly bootstrapping their own applications with the WaaS APIs, while demonstrating best practices.

## Features

The sample application utilizes the WaaS APIs to implement the following features:

- **MPC wallet creation:** Users can sign-up and create an account with an MPC wallet.
- **Wallet address generation:** Users can generate new wallet addresses for multiple networks.
- **Send transactions and payments:** Users can send payments via transactions executed on the blockchain.
- **Transaction history:** Users can view a history of transactions and details associated with payments made between them and their friends.
- **Wallet backup and recovery:** Users can backup and recover their MPC wallets.
- **Wallet key export:** Users can export their wallet private keys and import them into other existing wallet solutions of their choice.

## Prerequisites

- [Create an API key](https://docs.cloud.coinbase.com/waas/docs/auth), and ideally test it against the client libraries.
- Install and run a [proxy server](https://docs.cloud.coinbase.com/waas/docs/proxy-setup).

## Checkout the code

Checkout the sample app:

```bash
git clone https://github.com/coinbase/waas-sample-app.git
```

**ℹ️ Info:** The sample app assumes the proxy server is running on `http://localhost:8091` by default. If your proxy server is running on a different host or port, update the `PROXY_SERVER_HOST` and `PROXY_SERVER_PORT` variables within the `.env` file.

## Running the app

You can build and run the sample app using yarn by running the commands below from the root directory of the sample app.

### Build

To build the sample app:

```bash
yarn install
cd ios
pod install
cd ..
```

**ℹ️ Info:** If you get an error when you run `pod install`, you may need to pull the latest PodSpecs by running `pod repo update`.

### Run

To run the sample app:

```bash
yarn start
```

**ℹ️ Info:** Once metro is running, you can run the app by starting an emulator. To run on iOS, press **`i`**.

**💡 Tip:** If you get a pop up that says, `Unable to boot device in current state: Booted`, you can close it.

**💡 Tip:** If you get a footer message that appears at the bottom of the app, you can close it.

## App customization

A configuration file is provided in the project, allowing you to modify the default styling and theme of the application.

### Theme, colors, title

To modify the theme and colors of the app:

1. Open `app.config.js`.
2. Update the variables under `config.theme` with your desired color hexcodes and application title.

```js
export const config = {
  /* 
   * Default network of application
   * (i.e. networks/ethereum-mainnet, networks/ethereum-goerli, networks/base-goerli, networks/base-mainnet)
  */
  defaultNetwork: 'networks/base-goerli',
  defaultChainId: '0x14a33',
  theme: {
    appName: 'FRENPAY',
    colors: {
        // list of hexcode colors for theme customization
        background: "#000000",
        text: "#000000",
        textSecondary: "#8A919E",
        textInverse: "#FFFFFF",
        textPositive: '#27AD75',
        textNegative: '#F0616D',
        primary: '#8A96F8',
        primaryHover: '#848FF0',
        primaryPressed: '#8A96F8',
        primaryBackground: '#0A0B0D',
        primaryForeground: '#0A0B0D',
        primaryForegroundMuted: '#8A919E',
        primaryLineHeavy: '#8A919EA8',
        secondary: '#32353D',
        secondaryHover: '#3A3D45',
        secondaryPressed: '#1E2025',
        secondaryForeground: '#FFFFFF',
        default: '#F9F9F9',
        defaultHover: '#F9F9F9',
        defaultPressed: '#EAEAEB',
        defaultForeground: '#000000',
      }
  }
};
```

### Logo

To modify the logo used within the app:

1. Replace `/assets/logo.png`.

## Documentation

For full documentation, refer to [https://docs.cloud.coinbase.com/waas](https://docs.cloud.coinbase.com/waas).

## License

```
Copyright © 2023 Coinbase, Inc. <https://www.coinbase.com/>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```



