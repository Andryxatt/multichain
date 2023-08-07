import { w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createConfig } from 'wagmi'
import { mainnet, zkSync, lineaTestnet, Chain } from 'wagmi/chains'
export const walletConnectProjectId = '37d4531c02159e2d08fc933bcf6e813b'
const lineaMainnet: Chain = {
  id: 59144,
  name: "Linea Mainnnet",
  network: "linea-mainnet",
  nativeCurrency: { name: "Linea Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    infura: {
      http: ["https://consensys-zkevm-goerli-prealpha.infura.io/v3"],
      webSocket: ["wss://consensys-zkevm-goerli-prealpha.infura.io/ws/v3"]
    },
    default: {
      http: ["https://rpc.linea.build"],
      webSocket: ["wss://rpc.linea.build"]
    },
    public: {
      http: ["https://rpc.linea.build"],
      webSocket: ["wss://rpc.linea.build"]
    }
  },
  blockExplorers: {
    default: {
      name: "BlockScout",
      url: "https://explorer.linea.build"
    }
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 498623
    }
  },
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, lineaMainnet, ...(import.meta.env?.MODE === 'development' ? [zkSync] : [])],
  [w3mProvider({ projectId: walletConnectProjectId })],
)

export const config = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    chains,
    projectId: walletConnectProjectId,
    version: 2,
  }),
  publicClient,
  webSocketPublicClient,
})

export { chains }
