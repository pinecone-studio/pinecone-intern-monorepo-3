import { DiscountModel } from "../../../models/discount.model";

export const getDiscount = async () => {
 
    const discounts = await DiscountModel.find();
    return discounts || []
};
