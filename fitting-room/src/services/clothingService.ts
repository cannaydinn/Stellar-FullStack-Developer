import { ContractService } from "./contract";
import { WalletService } from "./wallet";
import { PaymentService } from "./paymentService";

export interface ClothingItem {
  id: string;
  name: string;
  path: string;
  price: string;
  category: 'top' | 'bottom';
}

export class ClothingService {
  private static instance: ClothingService;
  private contractService: ContractService;
  private walletService: WalletService;
  private paymentService: PaymentService;
  private basketKey = 'fitting_room_basket';

  private constructor() {
    this.contractService = ContractService.getInstance();
    this.walletService = WalletService.getInstance();
    this.paymentService = PaymentService.getInstance();
  }

  public static getInstance(): ClothingService {
    if (!ClothingService.instance) {
      ClothingService.instance = new ClothingService();
    }
    return ClothingService.instance;
  }

  async purchaseClothing(item: ClothingItem): Promise<boolean> {
    try {
      if (!this.walletService.isConnected()) {
        throw new Error("Wallet not connected");
      }

      console.log(`Purchasing ${item.name} for ${item.price} XLM`);
      
      // Gerçek XLM ödeme işlemi - Mağaza test adresi
      // NOT: Gerçek uygulamada mağazanın kendi Stellar adresini kullanın
      const success = await this.paymentService.sendXLMSimulation(
        "GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR", // Test mağaza adresi
        item.price,
        `Clothing: ${item.name} (${item.id})`
      );

      if (success) {
        console.log(`Successfully purchased ${item.name} for ${item.price} XLM`);
        return true;
      } else {
        console.error(`Failed to purchase ${item.name}`);
        return false;
      }
    } catch (error) {
      console.error("Error purchasing clothing:", error);
      if (error instanceof Error) {
        console.error("Detailed error:", error.message);
        if (error.message.includes("Testnet'te bulunamadı")) {
          alert("⚠️ Hesabınız Testnet'te aktif değil!\n\nLütfen Friendbot'tan test XLM alın:\n1. Freighter extension'ı açın\n2. 'Fund with Friendbot' butonuna tıklayın\nveya şu linki ziyaret edin:\nhttps://friendbot.stellar.org");
        } else {
          alert(`Satın alma hatası: ${error.message}`);
        }
      }
      return false;
    }
  }

  async purchaseBasket(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.walletService.isConnected()) {
        throw new Error("Wallet not connected");
      }

      const basket = this.getBasket();
      if (basket.length === 0) {
        return { success: false, message: "Sepetiniz boş" };
      }

      console.log(`Purchasing ${basket.length} items from basket`);
      
      // Simulate processing each item
      let successCount = 0;
      for (const item of basket) {
        for (let i = 0; i < item.quantity; i++) {
          const success = await this.purchaseClothing(item);
          if (success) successCount++;
        }
      }

      if (successCount > 0) {
        // Clear basket after successful purchase
        this.clearBasket();
        return { 
          success: true, 
          message: `${successCount} ürün başarıyla satın alındı` 
        };
      } else {
        return { 
          success: false, 
          message: "Satın alma işlemi başarısız" 
        };
      }
    } catch (error) {
      console.error("Error purchasing basket:", error);
      return { 
        success: false, 
        message: "Satın alma işleminde hata oluştu" 
      };
    }
  }

  async addToBasket(item: ClothingItem): Promise<boolean> {
    try {
      if (!this.walletService.isConnected()) {
        throw new Error("Wallet not connected");
      }

      console.log(`Adding ${item.name} to basket`);
      
      // Get current basket from localStorage
      const currentBasket = this.getBasket();
      
      // Check if item already exists in basket
      const existingItemIndex = currentBasket.findIndex(basketItem => basketItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Increase quantity if item already exists
        currentBasket[existingItemIndex].quantity += 1;
      } else {
        // Add new item to basket
        currentBasket.push({ ...item, quantity: 1 });
      }
      
      // Save updated basket to localStorage
      localStorage.setItem(this.basketKey, JSON.stringify(currentBasket));
      
      return true;
    } catch (error) {
      console.error("Error adding to basket:", error);
      return false;
    }
  }

  getBasket(): (ClothingItem & { quantity: number })[] {
    try {
      const basketData = localStorage.getItem(this.basketKey);
      return basketData ? JSON.parse(basketData) : [];
    } catch (error) {
      console.error("Error getting basket:", error);
      return [];
    }
  }

  getBasketItemCount(): number {
    const basket = this.getBasket();
    return basket.reduce((total, item) => total + item.quantity, 0);
  }

  clearBasket(): void {
    localStorage.removeItem(this.basketKey);
  }

  async removeFromBasket(itemId: string): Promise<boolean> {
    try {
      if (!this.walletService.isConnected()) {
        throw new Error("Wallet not connected");
      }

      console.log(`Removing item ${itemId} from basket`);
      
      // Get current basket from localStorage
      const currentBasket = this.getBasket();
      
      // Find item in basket
      const existingItemIndex = currentBasket.findIndex(basketItem => basketItem.id === itemId);
      
      if (existingItemIndex >= 0) {
        // Decrease quantity or remove item
        if (currentBasket[existingItemIndex].quantity > 1) {
          currentBasket[existingItemIndex].quantity -= 1;
        } else {
          // Remove item completely if quantity is 1
          currentBasket.splice(existingItemIndex, 1);
        }
        
        // Save updated basket to localStorage
        localStorage.setItem(this.basketKey, JSON.stringify(currentBasket));
        
        console.log(`Item ${itemId} removed from basket`);
        return true;
      } else {
        console.log(`Item ${itemId} not found in basket`);
        return false;
      }
    } catch (error) {
      console.error("Error removing from basket:", error);
      return false;
    }
  }

  async removeAllFromBasket(itemId: string): Promise<boolean> {
    try {
      if (!this.walletService.isConnected()) {
        throw new Error("Wallet not connected");
      }

      console.log(`Removing all ${itemId} from basket`);
      
      // Get current basket from localStorage
      const currentBasket = this.getBasket();
      
      // Filter out the item completely
      const updatedBasket = currentBasket.filter(basketItem => basketItem.id !== itemId);
      
      // Save updated basket to localStorage
      localStorage.setItem(this.basketKey, JSON.stringify(updatedBasket));
      
      console.log(`All ${itemId} removed from basket`);
      return true;
    } catch (error) {
      console.error("Error removing all from basket:", error);
      return false;
    }
  }

  getBasketItems(): (ClothingItem & { quantity: number })[] {
    return this.getBasket();
  }

  async getOwnedClothing(): Promise<ClothingItem[]> {
    try {
      if (!this.walletService.isConnected()) {
        throw new Error("Wallet not connected");
      }

      // TODO: Implement getting owned clothing from contract
      // This would query the smart contract for user's owned items
      
      return [];
    } catch (error) {
      console.error("Error getting owned clothing:", error);
      return [];
    }
  }
}
