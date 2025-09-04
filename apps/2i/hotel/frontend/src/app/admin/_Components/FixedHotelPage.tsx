'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetHotelQuery } from '@/generated';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const FixedHotelPage = () => {
  const { data } = useGetHotelQuery();
  const router = useRouter();

  const handleHotelById = (id: string) => {
    router.push(`/admin/hotels/${id}`);
  };
  return (
    <Table>
      <TableHeader className="">
        <TableRow className="border">
          <TableHead className="border-x">ID</TableHead>
          <TableHead className="border-x">Names</TableHead>
          <TableHead className="border-x">Rooms</TableHead>
          <TableHead className="border-x">Stars Rating</TableHead>
          <TableHead className="border-x">Users Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="border">
        {data?.getHotel.map((hotel, index) => {
          return (
            <TableRow key={index}>
              <TableCell className="border-x">{hotel?._id.slice(0, 8)}</TableCell>
              <TableCell className="border-x">
                <div className="flex items-center gap-2">
                  <div className="w-[48px] h-[48px]">
                    <Image src={hotel?.image?.[0] || ''} alt={hotel?.hotelName || ''} width={50} height={50} className=" rounded-sm w-full h-full object-cover" />
                  </div>
                  <Button variant="link" onClick={() => hotel?._id && handleHotelById(hotel._id)}>
                    {hotel?.hotelName}
                  </Button>
                </div>
              </TableCell>
              <TableCell className="border-x">{hotel?.description}</TableCell>
              <TableCell className="border-x">{hotel?.starRating}</TableCell>
              <TableCell className="border">{hotel?.location}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
