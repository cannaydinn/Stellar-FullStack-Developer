import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  getNetwork,
  getNetworkDetails,
  signTransaction
} from "@stellar/freighter-api";

export class WalletService {
  private static instance: WalletService;
  private userPublicKey: string | null = null;

  private constructor() {}

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  async checkConnection(): Promise<boolean> {
    try {
      const { isConnected: hasFreighter } = await isConnected();
      if (!hasFreighter) {
        console.warn("Freighter wallet not detected");
        return false;
      }

      const { isAllowed: isAuthorized } = await isAllowed();
      if (isAuthorized) {
        // If authorized, get the current address
        const { address } = await getAddress();
        this.userPublicKey = address;
      }
      return isAuthorized;
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      return false;
    }
  }

  async connect(): Promise<string | null> {
    try {
      const { address, error } = await requestAccess();
      if (error) {
        console.error("Error connecting wallet:", error);
        return null;
      }
      this.userPublicKey = address;
      return address;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return null;
    }
  }

  async getCurrentNetwork() {
    try {
      const { network, networkPassphrase } = await getNetwork();
      return { network, networkPassphrase };
    } catch (error) {
      console.error("Error getting network:", error);
      return null;
    }
  }

  async getNetworkConfig() {
    try {
      const details = await getNetworkDetails();
      return details;
    } catch (error) {
      console.error("Error getting network config:", error);
      return null;
    }
  }

  async signTransaction(xdr: string): Promise<string | null> {
    try {
      if (!this.userPublicKey) throw new Error("No public key available");
      
      const signed = await signTransaction(xdr, {
        networkPassphrase: "Test SDF Network ; September 2015",
        address: this.userPublicKey
      });
      
      return signed.signedTxXdr;
    } catch (error) {
      console.error("Error signing transaction:", error);
      return null;
    }
  }

  async disconnect(): Promise<void> {
    this.userPublicKey = null;
    // Note: Freighter doesn't have a direct disconnect method
    // This just clears the local state
  }

  getUserPublicKey(): string | null {
    return this.userPublicKey;
  }

  isConnected(): boolean {
    return this.userPublicKey !== null;
  }
}