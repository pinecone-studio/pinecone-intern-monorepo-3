import { Html } from "next/document";
import { HotelModel } from "../../models/hotel-model";
import { connectToDb } from "../../utils/connect-to-db";


// export const getHotelById = async (_:any, args:{id: string}) => {

//     await connectToDb();

//       if (!args.id) throw new Error("ID is required");

//       // const hotel = await HotelModel.findById({_id: args.id});
//       // if (!hotel) throw new Error("Hotel not found");

//   const requiredFields = ['description', 'hotelName', 'location', 'starRating', 'userRating'];
//   for (const field of requiredFields) {
//     if (hotel[field] == null) {
//       throw new Error(`Missing required field: ${field}`);
//     }
//   }

//       return hotel;
//     }

export const getHotelById = async (_:unknown, args: {id: string})=>{
  try {
    const hotel = await HotelModel.findById(args.id)
    if(!hotel){
      throw new Error("Hotel not found")
    }
    return hotel 
  } catch(err){
    console.error(err)
    throw new Error("Server error")
  }
}

  
