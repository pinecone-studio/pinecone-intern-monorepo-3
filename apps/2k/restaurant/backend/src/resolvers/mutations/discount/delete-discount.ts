import { DiscountModel } from "../../../models/discount.model"

export const deleteDiscount = async (_: unknown, { discountId}: {discountId: string}) => {
    const deletedDiscount = await DiscountModel.findByIdAndDelete(discountId);
    if(!deletedDiscount) {
        throw new Error(`Discount with ID ${discountId} not found`);
    }
     return deletedDiscount;
}