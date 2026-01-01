
import { Webshop } from '../types';

const STORAGE_KEY = 'shopinsta_data';

export const shopService = {
  getShops: (): Webshop[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveShop: (shop: Webshop): void => {
    const shops = shopService.getShops();
    const index = shops.findIndex(s => s.id === shop.id);
    if (index > -1) {
      shops[index] = shop;
    } else {
      shops.push(shop);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shops));
  },

  deleteShop: (id: string): void => {
    const shops = shopService.getShops().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shops));
  },

  getShopBySlug: (slug: string): Webshop | undefined => {
    return shopService.getShops().find(s => s.slug === slug);
  }
};
