import { DiscountModel } from '../../../models/discount.model';

export const updateDiscount = async (
  _: unknown,
  {
    discountId,
    input: { discountName, discountRate, startDate, endDate },
  }: {
    discountId: string;
    input: {
      discountName: string;
      discountRate: number;
      startDate: string;
      endDate: string;
    };
  }
) => {
  const updatedDiscount = await DiscountModel.findByIdAndUpdate(discountId, { $set: { discountName, discountRate, startDate, endDate } }, { new: true, runValidators: true });
  if (!updatedDiscount) {
    throw new Error(`Discount with ID ${discountId} not found`);
  }

  return updatedDiscount;
};
