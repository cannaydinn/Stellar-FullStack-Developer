import {
  Server,
  SorobanRpc,
  Networks,
  Transaction,
  FeeBumpTransaction,
  TransactionBuilder,
} from "soroban-client";
import { WalletService } from "./wallet";

export class ContractService {
  private static instance: ContractService;
  private walletService: WalletService;
  private rpcUrl: string = "https://soroban-testnet.stellar.org";
  private server: Server;
  private networkPassphrase: string = Networks.TESTNET; // 'Networks' artık soroban-client'tan geliyor
  
  // Deployed Fitting Room Contract
  public readonly CONTRACT_ID: string = "CCTR33G5M5QLPD7IKFANMCRRYT6REBY4CR6UXVA5EPISXPEYT27RVPNI";
  public readonly CONTRACT_DEPLOYER: string = "GBV3DPBCSR2RWV4GGY4JMWGI4VU4A5U7B3TJA2BQ7UCZY5GQ72QGZ5DX";

  private constructor() {
    this.walletService = WalletService.getInstance();
    this.server = new Server(this.rpcUrl);
  }

  public static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }

  async submitTransaction(
    xdr: string
  ): Promise<SorobanRpc.SendTransactionResponse> {
    try {
      const signedXDR = await this.walletService.signTransaction(xdr);
      if (!signedXDR) throw new Error("Transaction signing failed");

      const signedTx = TransactionBuilder.fromXDR(
        signedXDR,
        this.networkPassphrase
      ) as Transaction | FeeBumpTransaction;

      const response = await this.server.sendTransaction(signedTx);
      return response;
    } catch (error) {
      console.error("Error submitting transaction:", error);
      throw error;
    }
  }

  async createPaymentTransaction(
    destination: string,
    amount: string,
    memo?: string
  ): Promise<string> {
    try {
      const userPublicKey = this.walletService.getUserPublicKey();
      if (!userPublicKey) throw new Error("No public key available");

      // Get account details
      const account = await this.server.getAccount(userPublicKey);
      
      // Create transaction builder
      const transaction = new TransactionBuilder(account, {
        fee: "100", // 100 stroops fee
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          // @ts-expect-error - Stellar SDK operation
          this.server.operations().payment({
            destination: destination,
            asset: "XLM", // Native XLM
            amount: amount,
          })
        )
        .setTimeout(30)
        .build();

      if (memo) {
        // @ts-expect-error - addMemo method exists on transaction
        transaction.addMemo(memo);
      }

      return transaction.toXDR();
    } catch (error) {
      console.error("Error creating payment transaction:", error);
      throw error;
    }
  }

  // Basit XLM ödeme işlemi için alternatif yöntem
  async sendXLM(destination: string, amount: string, memo?: string): Promise<boolean> {
    try {
      const userPublicKey = this.walletService.getUserPublicKey();
      if (!userPublicKey) throw new Error("No public key available");

      // Testnet için örnek mağaza adresi (gerçek uygulamada kendi adresinizi kullanın)
      const storeAddress = "GCNY5OXYSY4FKHOPT2SPOQZAOEIGZ5ELG32FVL2Q5VY2Q2V2Q2V2Q2V2"; // Örnek adres
      
      const xdr = await this.createPaymentTransaction(
        storeAddress, // Mağaza adresi
        amount,
        memo || `Clothing purchase: ${memo}`
      );

      const response = await this.submitTransaction(xdr);
      
      // @ts-expect-error - Status comparison
      if (response.status === "SUCCESS" || response.status === "PENDING") {
        console.log("Payment successful:", response);
        return true;
      } else {
        console.error("Payment failed:", response);
        return false;
      }
    } catch (error) {
      console.error("Error sending XLM:", error);
      return false;
    }
  }

  async getContractId(contractAddress: string): Promise<string> {
    try {
      const account = await this.server.getAccount(contractAddress);
      return account.accountId();
    } catch (error) {
      console.error("Error getting contract ID:", error);
      throw error;
    }
  }
}