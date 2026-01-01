
import { Webshop } from '../types';

const STORAGE_KEY = 'shopinsta_data';

export const shopService = {
  getAllShops: (): Webshop[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getShopsForUser: (userId: string): Webshop[] => {
    return shopService.getAllShops().filter(s => s.userId === userId);
  },

  saveShop: (shop: Webshop): void => {
    const shops = shopService.getAllShops();
    const index = shops.findIndex(s => s.id === shop.id);
    
    // Check slug uniqueness
    const slugExists = shops.find(s => s.slug === shop.slug && s.id !== shop.id);
    if (slugExists) throw new Error('Shop URL slug is already taken.');

    if (index > -1) {
      shops[index] = shop;
    } else {
      shops.push(shop);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shops));
  },

  deleteShop: (id: string): void => {
    const shops = shopService.getAllShops().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shops));
  },

  getShopBySlug: (slug: string): Webshop | undefined => {
    return shopService.getAllShops().find(s => s.slug === slug);
  }
};
