import { CreateDiscountInput } from '../../../generated';
import { DiscountModel } from '../../../models/discount.model';

export const createDiscount = async (_: unknown, { input }: { input: CreateDiscountInput }) => {
  
  const { discountName, discountRate, startDate, endDate } = input;

  try {
    const newDiscount = await DiscountModel.create({ discountName, discountRate, startDate, endDate });

    return newDiscount;
  } catch (error) {
    throw new Error('Failed to create discount');
  }
};
