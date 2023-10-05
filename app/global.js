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
import { createSlice } from '@reduxjs/toolkit'

export const global = createSlice({
  name: 'global',
  initialState: {
    username: '',
    email: '',
    address: null,
    device: null,
    deviceGroupName: '',
    pool: '',
    wallet: null,
    address: null,
    networks: null,
    passcode: '',
  },
  reducers: {
    setUsername: (state, action) => {
        state.username = action.payload
    },
    setEmail: (state, action) => {
        state.email = action.payload
    },
    setAddress: (state, action) => {
      state.address = action.payload
    },
    setDevice: (state, action) => {
      state.device = action.payload
    },
    setPool: (state, action) => {
      state.pool = action.payload
    },
    setDeviceGroupName: (state, action) => {
      state.deviceGroupName = action.payload
    },
    setWallet: (state, action) => {
      state.wallet = action.payload
    },
    setNetworks: (state, action) => {
      state.networks = action.payload
    },
    setPasscode: (state, action) => {
      state.passcode = action.payload
    },
  }
})

export const {
    setUsername,
    setEmail,
    setAddress,
    setDevice, 
    setPool,
    setDeviceGroupName,
    setWallet,
    setNetworks,
    setPasscode,
} = global.actions

export default global.reducer