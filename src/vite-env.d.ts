/// <reference types="vite/client" />

interface Window {
  ethereum?: BrowserProvider & AbstractProvider;
}

// declare type Eip1193Provider = import('ethers').Eip1193Provider;
declare type BrowserProvider = import('ethers').BrowserProvider;
declare type AbstractProvider = import('web3-core').AbstractProvider;
