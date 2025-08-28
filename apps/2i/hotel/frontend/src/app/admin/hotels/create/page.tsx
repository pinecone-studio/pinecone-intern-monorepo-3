'use client';

import { useParams, useRouter } from 'next/navigation';
import { DetailImage } from '../../_Components/DetailsImage';

type Params = {
  id: string;
};

const HotelCreatePage = ({ id }: Params) => {
  const router = useRouter();

  return (
    <div>
      <DetailImage id={id} />
    </div>
  );
};

export default HotelCreatePage;
