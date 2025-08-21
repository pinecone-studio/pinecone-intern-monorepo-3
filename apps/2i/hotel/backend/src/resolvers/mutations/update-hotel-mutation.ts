import { HotelModel } from "../../models/hotel-model"


export const updateHotel = async (_: unknown, args:{id:string, hotelName?:string, description?:string, location?:string, starRating?:string}) =>{

 if (!args.id) {
    throw new Error("No ID provided");
  }

const fieldsToUpdate: any = {};
  if (args.hotelName !== undefined) fieldsToUpdate.hotelName = args.hotelName;
  if(args.description !== undefined) fieldsToUpdate.description = args.description;
  if (args.location !== undefined) fieldsToUpdate.location = args.location;
  if (args.starRating !== undefined) fieldsToUpdate.starRating = args.starRating;

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error("No fields to update");
  }



 const updatedHotel = await HotelModel.findOneAndUpdate(
    
    { _id: args.id }, 
    fieldsToUpdate,
    { new: true }


  );
if (!updatedHotel) {
  throw new Error("Hotel not found");
}

  return updatedHotel;

}