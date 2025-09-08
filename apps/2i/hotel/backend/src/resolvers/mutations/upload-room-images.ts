import { RoomModel } from '../../models/room-model';

type Args = {
  roomId: string;
  image: string[];
};

export const uploadRoomImages = async (_: unknown, args: Args) => {
  const { roomId, image } = args;

  try {
    const existingRoom = await RoomModel.findById(roomId);

    if (!existingRoom) {
      throw new Error('Room not found');
    }

    existingRoom.roomImgs.push(...image);
    await existingRoom.save();
    return { message: 'Successfully uploaded images of room' };
  } catch (err) {
    throw new Error(`Server error ${err}`);
  }
};
