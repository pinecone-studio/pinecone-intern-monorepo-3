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

const initSelectedDate = (concertDate?: string | null): string => {
  if (concertDate) {
    let date: Date | null = null;
    if (/^\d+$/.test(concertDate)) date = new Date(parseInt(concertDate));
    else date = new Date(concertDate);
    if (date && !isNaN(date.getTime())) {
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${mm}.${dd}`;
    }
  }
  return '';
};

// eslint-disable-next-line complexity
const ConcertContent = ({ concert, concertId }: ConcertContentProps) => {
  const [selectedDate, setSelectedDate] = React.useState<string>(() => {
    return initSelectedDate(concert.date);
  });

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
    discountPercentage: category.discountPercentage ?? undefined,
    discountedPrice: category.discountedPrice,
  }));

  const specialArtists = concert.otherArtists?.map((artist) => artist.name) ?? [];

  // Огноо форматлах функц - MM.DD формат
  const formatDateToMMDD = React.useCallback((dateStr: string): string => {
    try {
      let date: Date;

      // Timestamp эсэхийг шалгах
      if (/^\d+$/.test(dateStr)) {
        // Timestamp-г миллисекунд болгож форматлах
        const timestamp = parseInt(dateStr);
        date = new Date(timestamp);
      } else {
        date = new Date(dateStr);
      }

      if (isNaN(date.getTime())) {
        return dateStr;
      }

      // Local огноо ашиглах (timezone асуудал арилгах)
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const formatted = `${mm}.${dd}`;
      return formatted;
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateStr;
    }
  }, []);


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
  }, [concert.date, formatDateToMMDD]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSlider
        title={concert.name ?? ''}
        artist={concert.mainArtist?.name ?? ''}
        dates={[formatDateToMMDD(concert.date ?? '')]}
        backgroundImage={concert.image ?? '/images/hero-bg.jpg'}
      />
      <ConcertDetails
        eventDate={formatDateToMMDD(concert.date ?? '')}
        eventTime={concert.time}
        venue={concert.venue}
        specialArtists={specialArtists.filter((a): a is string => typeof a === 'string')}
        schedule={{ doorOpen: doorOpenTime, musicStart: musicStartTime }}
        ticketCategories={ticketCategories}
        _onBookTicket={handleBookTicket}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        availableDates={availableDates}
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
