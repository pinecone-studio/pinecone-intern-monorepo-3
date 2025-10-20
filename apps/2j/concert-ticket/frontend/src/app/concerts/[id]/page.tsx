'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { HeroSlider } from '@/components/detail/hero-slider';
import { ConcertDetails } from '@/components/detail/concert-details';
import { RelatedConcerts } from '@/components/detail/related-concerts';
import { useGetConcertQuery, TicketType, GetConcertQuery } from '@/generated';

const calculateDoorOpenTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes - 120;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};

const calculateMusicStartTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + 60;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};

const getTicketTypeName = (type: TicketType): string => {
  switch (type) {
    case TicketType.Vip:
      return 'VIP тасалбар';
    case TicketType.Regular:
      return 'Энгийн тасалбар';
    case TicketType.GeneralAdmission:
      return 'Арын тасалбар';
    default:
      return 'Тасалбар';
  }
};

const getTicketTypeColor = (type: TicketType): string => {
  switch (type) {
    case TicketType.Vip:
      return '#4651c9';
    case TicketType.Regular:
      return '#c772c4';
    case TicketType.GeneralAdmission:
      return '#D7D7F8';
    default:
      return '#888888';
  }
};

interface ConcertContentProps {
  concert: NonNullable<GetConcertQuery['concert']>;
  concertId: string;
}

const ConcertContent = ({ concert, concertId }: ConcertContentProps) => {
  const [selectedDate, setSelectedDate] = React.useState<string>('');

  const handleBookTicket = () => {
    const urlParams = new URLSearchParams();
    if (selectedDate) {
      urlParams.set('selectedDate', selectedDate);
    }
    urlParams.set('concertId', concertId);
    window.location.href = `/cart?${urlParams.toString()}`;
  };

  const doorOpenTime = calculateDoorOpenTime(concert.time);
  const musicStartTime = calculateMusicStartTime(concert.time);

  const ticketCategories = concert.ticketCategories.map((category) => ({
    id: category.id,
    name: getTicketTypeName(category.type),
    price: category.unitPrice,
    available: category.availableQuantity,
    color: getTicketTypeColor(category.type),
  }));

  const specialArtists = concert.otherArtists?.map((artist) => artist.name) ?? [];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSlider title={concert.name} artist={concert.mainArtist.name} dates={[concert.date]} backgroundImage={concert.image ?? '/images/hero-bg.jpg'} />
      <ConcertDetails
        eventDate={concert.date}
        eventTime={concert.time}
        venue={concert.venue}
        specialArtists={specialArtists}
        schedule={{ doorOpen: doorOpenTime, musicStart: musicStartTime }}
        ticketCategories={ticketCategories}
        _onBookTicket={handleBookTicket}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <RelatedConcerts excludeConcertId={concertId} />
      <Footer />
    </div>
  );
};

const LoadingState = ({ _concertId }: { _concertId: string }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex items-center justify-center flex-1 py-20">
        <div className="text-white">Ачааллаж байна...</div>
      </div>
      <Footer />
    </div>
  );
};

const ErrorState = ({ _concertId }: { _concertId: string }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex items-center justify-center flex-1 py-20">
        <div className="text-red-400">Концертын мэдээлэл олдсонгүй</div>
      </div>
      <Footer />
    </div>
  );
};

const ConcertDetailPage = () => {
  const params = useParams();
  const concertId = params.id as string;

  const { data, loading, error } = useGetConcertQuery({
    variables: { id: concertId },
    skip: !concertId,
  });

  if (loading) {
    return <LoadingState _concertId={concertId} />;
  }

  if (error || !data?.concert) {
    return <ErrorState _concertId={concertId} />;
  }

  return <ConcertContent concert={data.concert} concertId={concertId} />;
};

export default ConcertDetailPage;
