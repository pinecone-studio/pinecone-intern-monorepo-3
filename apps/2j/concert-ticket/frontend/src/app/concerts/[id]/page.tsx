'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { HeroSlider } from '@/components/detail/hero-slider';
import { ConcertDetails } from '@/components/detail/concert-details';
import { RelatedConcerts } from '@/components/detail/related-concerts';
import { useGetConcertQuery, TicketType, GetConcertQuery } from '@/generated';

const formatDateToMMDD = (dateStr: string): string => {
  try {
    let date: Date;

    // Timestamp эсэхийг шалгах (10-13 оронтой тоо)
    if (/^\d{10,13}$/.test(dateStr)) {
      const timestamp = parseInt(dateStr, 10);
      // Unix timestamp (секунд) бол миллисекунд болгох
      date = new Date(timestamp * (String(timestamp).length === 10 ? 1000 : 1));
    } else {
      date = new Date(dateStr);
    }

    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    // Local огноо ашиглах (timezone асуудал арилгах)
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const formatted = `${mm}.${dd}`;
    return formatted;
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Date error';
  }
};

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
  const [selectedDate, setSelectedDate] = React.useState<string>(concert.date ? formatDateToMMDD(concert.date) : '');

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

  // Concert-ийн боломжит огноонуудыг үүсгэх (зөвхөн тухайн тоглолтын огноо)
  const availableDates = React.useMemo(() => {
    try {
      // Concert date-г шалгах
      if (!concert.date) {
        return [formatDateToMMDD(new Date().toISOString())];
      }

      // Зөвхөн тухайн тоглолтын огноо (timestamp эсэхийг шалгахгүй)
      return [formatDateToMMDD(concert.date)];
    } catch (error) {
      console.error('Available dates generation error:', error);
      return [formatDateToMMDD(new Date().toISOString())];
    }
  }, [concert.date]);

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-[1200px] flex-grow px-[16px]">
        <HeroSlider title={concert.name} artist={concert.mainArtist.name} dates={[formatDateToMMDD(concert.date)]} backgroundImage={concert.image ?? '/images/hero-bg.jpg'} />
        <ConcertDetails
          eventDate={formatDateToMMDD(concert.date)}
          eventTime={concert.time}
          venue={concert.venue}
          specialArtists={specialArtists}
          schedule={{ doorOpen: doorOpenTime, musicStart: musicStartTime }}
          ticketCategories={ticketCategories}
          _onBookTicket={handleBookTicket}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          availableDates={availableDates}
        />
        <RelatedConcerts excludeConcertId={concertId} />
      </main>
      <Footer />
    </div>
  );
};

const LoadingState = ({ _concertId }: { _concertId: string }) => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-[1200px] flex-grow px-[16px]">
        <div className="h-[400px] w-full animate-pulse rounded-lg bg-[#393E46]" />
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="h-8 w-3/4 animate-pulse rounded bg-[#393E46]" />
            <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-[#393E46]" />
            <div className="mt-8 h-4 w-full animate-pulse rounded bg-[#393E46]" />
            <div className="mt-2 h-4 w-full animate-pulse rounded bg-[#393E46]" />
          </div>
          <div>
            <div className="h-12 w-full animate-pulse rounded-lg bg-[#393E46]" />
            <div className="mt-4 h-8 w-full animate-pulse rounded-lg bg-[#393E46]" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const ErrorState = ({ _concertId }: { _concertId: string }) => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <div className="flex flex-grow items-center justify-center py-20">
        <div className="text-red-400">Тоглолтын мэдээлэл олдсонгүй</div>
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
