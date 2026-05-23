import { AddressInput, addressRepository } from "../repositories/address.repository";

export class AddressService {
  async getAddresses(userId: string) {
    return addressRepository.getByUser(userId);
  }

  async addAddress(data: AddressInput) {
    return addressRepository.create(data);
  }

  async updateAddress(userId: string, addressId: string, data: Partial<AddressInput>) {
    return addressRepository.update(userId, addressId, data);
  }

  async deleteAddress(userId: string, addressId: string) {
    return addressRepository.delete(userId, addressId);
  }

  async setDefaultAddress(userId: string, addressId: string) {
    return addressRepository.setDefault(userId, addressId);
  }
}

export const addressService = new AddressService();
