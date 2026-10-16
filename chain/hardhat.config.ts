import { configVariable, defineConfig } from "hardhat/config";
import hardhatToolboxViem from "@nomicfoundation/hardhat-toolbox-viem";

// Secrets come from the encrypted Hardhat keystore (`npx hardhat keystore set NAME`) or env vars.
// Never put a private key in this file.
export default defineConfig({
  plugins: [hardhatToolboxViem],
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
      evmVersion: "cancun",
    },
  },
  networks: {
    robinhoodTestnet: {
      type: "http",
      chainType: "generic",
      chainId: 46630,
      url: configVariable("ROBINHOOD_TESTNET_RPC_URL"),
      accounts: [configVariable("DEPLOYER_PRIVATE_KEY")],
    },
    robinhoodMainnet: {
      type: "http",
      chainType: "generic",
      chainId: 4663,
      url: configVariable("ROBINHOOD_MAINNET_RPC_URL"),
      accounts: [configVariable("DEPLOYER_PRIVATE_KEY")],
    },
  },
});
