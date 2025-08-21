import { HotelModel } from "../../models/hotel-model"
import { connectToDb } from "../../utils/connect-to-db";

export const deleteHotel = async (_: unknown, args: { id: string }) =>{

    await connectToDb();
    
    const deletedHotel = await HotelModel.findByIdAndDelete(args.id);

    return !!deletedHotel;

}