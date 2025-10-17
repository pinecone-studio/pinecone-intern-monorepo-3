import { CreateDiscountInput } from '../../../generated';
import { DiscountModel } from '../../../models/discount.model';

export const createDiscount = async (_: unknown, { input }: { input: CreateDiscountInput }) => {
    console.log("helloo");
    

  const { discountName, discountRate, startDate, endDate } = input;

  console.log("discountRate", discountRate);
  

  try {
    const newDiscount = await DiscountModel.create({ discountName, discountRate, startDate, endDate });

    console.log("discpunt", newDiscount);
    

    return newDiscount;
  } catch (error) {
    throw new Error('Failed to create discount');
  }
};
