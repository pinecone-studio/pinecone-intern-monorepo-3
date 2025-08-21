
import { HotelModel } from "../../models/hotel-model";




export const getHotelById = async (_:unknown, args: {id: string})=>{
  try {
    const hotel = await HotelModel.findById(args.id);
    return hotel 
  } catch(err){
    console.error(err)
    throw new Error("Server error")
  }
}

 