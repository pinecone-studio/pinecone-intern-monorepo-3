/* eslint-disable no-secrets/no-secrets */
/* eslint-disable max-lines */
import { PROPERTY_IMAGES } from '../constants/images';

// Real locations in Ulaanbaatar, Mongolia with accurate coordinates
export const SAMPLE_PROPERTIES = [
  {
    id: 1,
    title: "Орчин үеийн орон сууц Сүхбаатарын төвд",
    titleEn: "Modern Apartment in Sukhbaatar Center",
    price: 150000000, // 150M MNT
    location: "Сүхбаатар дүүрэг, Чингисийн өргөн чөлөө",
    locationEn: "Sukhbaatar District, Chinggis Avenue",
    coordinates: { lat: 47.9184, lng: 106.9177 }, // Peace Avenue/Chinggis area
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    type: "apartment" as const,
    image: PROPERTY_IMAGES.MODERN_APARTMENT,
    featured: true,
    description: "Хотын төвд байрлах, гоёмсог засалтай орон сууц. Том цонхнууд, гал тогоо, угаалгын өрөө бүрэн тоноглогдсон.",
    descriptionEn: "Luxurious renovated apartment in city center. Large windows, fully equipped kitchen and bathrooms.",
    amenities: ["Паркинг", "Цэнгэлдэх хүрээлэн", "Аюулгүй хамгаалалт", "Лифт"],
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-01-15").toISOString()
  },
  {
    id: 2,
    title: "Тансаг байшин Зайсан толгойд",
    titleEn: "Luxury House in Zaisan",
    price: 450000000, // 450M MNT
    location: "Хан-Уул дүүрэг, Зайсан",
    locationEn: "Khan-Uul District, Zaisan Hill",
    coordinates: { lat: 47.9024, lng: 106.9243 }, // Zaisan area
    bedrooms: 5,
    bathrooms: 4,
    area: 320,
    type: "house" as const,
    image: PROPERTY_IMAGES.LUXURY_HOUSE,
    featured: true,
    description: "Хотын үзэмжтэй, том байшин. Цэнгэлдэх хүрээлэн, гараж, орчин үеийн дизайнтай.",
    descriptionEn: "Large house with city view. Garden, garage, modern design.",
    amenities: ["Цэнэлдэх хүрээлэн", "Гараж 3 машин", "Сауна", "Барбекю"],
    createdAt: new Date("2024-02-01").toISOString(),
    updatedAt: new Date("2024-02-01").toISOString()
  },
  {
    id: 3,
    title: "Гэр бүлийн байшин Баянзүрхэд",
    titleEn: "Family Home in Bayanzurkh",
    price: 180000000, // 180M MNT
    location: "Баянзүрх дүүрэг, 3-р хороо",
    locationEn: "Bayanzurkh District, 3rd Khoroo",
    coordinates: { lat: 47.9138, lng: 106.9630 }, // Bayanzurkh area
    bedrooms: 4,
    bathrooms: 2,
    area: 180,
    type: "house" as const,
    image: PROPERTY_IMAGES.FAMILY_HOME,
    featured: false,
    description: "Сургууль, цэцэрлэгтэй ойрхон. Тохилог орчинтай гэр бүлийн байшин.",
    descriptionEn: "Close to schools and kindergartens. Comfortable family home.",
    amenities: ["Хашаа", "Паркинг", "Хүлэмж", "Агаарын дулааны систем"],
    createdAt: new Date("2024-01-20").toISOString(),
    updatedAt: new Date("2024-01-20").toISOString()
  },
  {
    id: 4,
    title: "Пентхаус Төв цамхагт",
    titleEn: "Penthouse in Central Tower",
    price: 380000000, // 380M MNT
    location: "Сүхбаатар дүүрэг, Токио гудамж",
    locationEn: "Sukhbaatar District, Tokyo Street",
    coordinates: { lat: 47.9191, lng: 106.9157 }, // Central area
    bedrooms: 3,
    bathrooms: 3,
    area: 200,
    type: "apartment" as const,
    image: PROPERTY_IMAGES.PENTHOUSE,
    featured: true,
    description: "Дээд давхрын тансаг орон сууц. 360 градусын хотын үзэмж, дэлгэрэнгүй тохижилт.",
    descriptionEn: "Luxury top floor apartment. 360-degree city view, premium finishes.",
    amenities: ["Терраса", "Фитнес", "Усан бассейн", "Консьерж үйлчилгээ"],
    createdAt: new Date("2024-02-10").toISOString(),
    updatedAt: new Date("2024-02-10").toISOString()
  },
  {
    id: 5,
    title: "Орчин үеийн байшин Сонгинохайрханд",
    titleEn: "Modern Villa in Songinokhairkhan",
    price: 320000000, // 320M MNT
    location: "Сонгинохайрхан дүүрэг, Яармаг",
    locationEn: "Songinokhairkhan District, Yarmag",
    coordinates: { lat: 47.9253, lng: 106.8294 }, // Songinokhairkhan/Yarmag area
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    type: "house" as const,
    image: PROPERTY_IMAGES.VILLA,
    featured: true,
    description: "Шинэ хорооллын орчин үеийн барилга. Эко найрсаг, нарны зай сайтай.",
    descriptionEn: "Modern construction in new neighborhood. Eco-friendly, good sun exposure.",
    amenities: ["Нарны зай системүүд", "Ухаалаг гэр систем", "Гараж", "Цэнгэлдэх хүрээлэн"],
    createdAt: new Date("2024-01-25").toISOString(),
    updatedAt: new Date("2024-01-25").toISOString()
  },
  {
    id: 6,
    title: "Студи орон сууц БЗД-д",
    titleEn: "Studio Apartment in BZD",
    price: 85000000, // 85M MNT
    location: "Баянзүрх дүүрэг, БЗД",
    locationEn: "Bayanzurkh District, BZD",
    coordinates: { lat: 47.8864, lng: 106.9453 }, // BZD area
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    type: "apartment" as const,
    image: PROPERTY_IMAGES.CONDO,
    featured: false,
    description: "Шинэхэн засалтай студи орон сууц. Анхны худалдан авагчдад тохиромжтой.",
    descriptionEn: "Newly renovated studio apartment. Perfect for first-time buyers.",
    amenities: ["Паркинг", "Аюулгүй байдал", "Лифт"],
    createdAt: new Date("2024-02-05").toISOString(),
    updatedAt: new Date("2024-02-05").toISOString()
  },
  {
    id: 7,
    title: "Лофт Чингэлтэй төвд",
    titleEn: "Loft in Chingeltei Center",
    price: 220000000, // 220M MNT
    location: "Чингэлтэй дүүрэг, Их Тойруу",
    locationEn: "Chingeltei District, Ikh Toiruu",
    coordinates: { lat: 47.9225, lng: 106.9093 }, // Chingeltei area
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    type: "apartment" as const,
    image: PROPERTY_IMAGES.LOFT,
    featured: false,
    description: "Индустриал дизайнтай лофт. Өндөр тааз, том цонх, гэрэл сайтай.",
    descriptionEn: "Industrial design loft. High ceilings, large windows, bright.",
    amenities: ["Ажлын орон зай", "Балкон", "Паркинг"],
    createdAt: new Date("2024-01-18").toISOString(),
    updatedAt: new Date("2024-01-18").toISOString()
  },
  {
    id: 8,
    title: "Таунхаус Баянгол дүүрэгт",
    titleEn: "Townhouse in Bayangol",
    price: 195000000, // 195M MNT
    location: "Баянгол дүүрэг, 5-р хороо",
    locationEn: "Bayangol District, 5th Khoroo",
    coordinates: { lat: 47.9156, lng: 106.8769 }, // Bayangol area
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    type: "house" as const,
    image: PROPERTY_IMAGES.COTTAGE,
    featured: false,
    description: "Шинэ таунхаус хороололд. Аюулгүй, тохилог орчинтой.",
    descriptionEn: "New townhouse in gated community. Safe, comfortable environment.",
    amenities: ["Хаалттай хороолол", "Тоглоомын талбай", "Паркинг"],
    createdAt: new Date("2024-02-12").toISOString(),
    updatedAt: new Date("2024-02-12").toISOString()
  },
  {
    id: 9,
    title: "3 өрөө орон сууц Амгалан дүүрэгт",
    titleEn: "3-Bedroom Apartment in Amgalan",
    price: 135000000, // 135M MNT
    location: "Баянзүрх дүүрэг, Амгалан",
    locationEn: "Bayanzurkh District, Amgalan",
    coordinates: { lat: 47.9052, lng: 106.9887 }, // Amgalan area
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    type: "apartment" as const,
    image: PROPERTY_IMAGES.APARTMENT_INTERIOR,
    featured: false,
    description: "Хотын захад байрлах, агаар сайтай орчин. Сургууль ойрхон.",
    descriptionEn: "Located on city outskirts, fresh air environment. Close to schools.",
    amenities: ["Паркинг", "Тоглоомын талбай", "Цэцэрлэгт хүрээлэн"],
    createdAt: new Date("2024-01-30").toISOString(),
    updatedAt: new Date("2024-01-30").toISOString()
  },
  {
    id: 10,
    title: "Бизнесийн байр Энхтайваны өргөн чөлөө",
    titleEn: "Commercial Space on Peace Avenue",
    price: 280000000, // 280M MNT
    location: "Сүхбаатар дүүрэг, Энхтайваны өргөн чөлөө",
    locationEn: "Sukhbaatar District, Peace Avenue",
    coordinates: { lat: 47.9190, lng: 106.9250 }, // Peace Avenue
    bedrooms: 0,
    bathrooms: 2,
    area: 150,
    type: "commercial" as const,
    image: PROPERTY_IMAGES.HOUSE_EXTERIOR,
    featured: true,
    description: "Хотын гол зам дээр байрлах худалдааны талбай. Өндөр урсгалтай газар.",
    descriptionEn: "Commercial space on main avenue. High foot traffic location.",
    amenities: ["Витрин цонх", "Агуулах", "Паркинг", "Аюулгүй байдал"],
    createdAt: new Date("2024-02-08").toISOString(),
    updatedAt: new Date("2024-02-08").toISOString()
  },
  {
    id: 11,
    title: "Цэнгэлдэх хүрээлэнтэй байшин",
    titleEn: "House with Garden",
    price: 165000000, // 165M MNT
    location: "Баянгол дүүрэг, 26-р байр",
    locationEn: "Bayangol District, 26th Apartment Complex",
    coordinates: { lat: 47.9089, lng: 106.8653 },
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    type: "house" as const,
    image: PROPERTY_IMAGES.GARDEN_HOME,
    featured: false,
    description: "Том цэнгэлдэх хүрээлэнтэй байшин. Жимс, хүнсний ногоо тарих боломжтой.",
    descriptionEn: "House with large garden. Space for fruits and vegetables.",
    amenities: ["Цэнгэлдэх хүрээлэн 200м²", "Хүлэмж", "Гараж", "Барбекю талбай"],
    createdAt: new Date("2024-01-28").toISOString(),
    updatedAt: new Date("2024-01-28").toISOString()
  },
  {
    id: 12,
    title: "Өндөр давхрын орон сууц Их Тойруу",
    titleEn: "High-Rise Apartment on Ikh Toiruu",
    price: 175000000, // 175M MNT
    location: "Чингэлтэй дүүрэг, Их Тойруу",
    locationEn: "Chingeltei District, Ikh Toiruu",
    coordinates: { lat: 47.9211, lng: 106.9089 },
    bedrooms: 3,
    bathrooms: 2,
    area: 105,
    type: "apartment" as const,
    image: PROPERTY_IMAGES.MODERN_APARTMENT,
    featured: false,
    description: "15 давхрын 12-р давхарт байрлах. Гайхалтай үзэмжтэй.",
    descriptionEn: "Located on 12th floor of 15-story building. Amazing views.",
    amenities: ["Балкон", "Фитнес төв", "Паркинг", "Лифт 2"],
    createdAt: new Date("2024-02-03").toISOString(),
    updatedAt: new Date("2024-02-03").toISOString()
  }
];

// Property types for filtering
export const PROPERTY_TYPES = [
  { value: 'apartment', labelMn: 'Орон сууц', labelEn: 'Apartment' },
  { value: 'house', labelMn: 'Байшин', labelEn: 'House' },
  { value: 'commercial', labelMn: 'Худалдааны байр', labelEn: 'Commercial' },
  { value: 'land', labelMn: 'Газар', labelEn: 'Land' },
] as const;

// Districts in Ulaanbaatar
export const DISTRICTS = [
  { value: 'sukhbaatar', labelMn: 'Сүхбаатар', labelEn: 'Sukhbaatar', coordinates: { lat: 47.9184, lng: 106.9177 } },
  { value: 'chingeltei', labelMn: 'Чингэлтэй', labelEn: 'Chingeltei', coordinates: { lat: 47.9225, lng: 106.9093 } },
  { value: 'bayanzurkh', labelMn: 'Баянзүрх', labelEn: 'Bayanzurkh', coordinates: { lat: 47.9138, lng: 106.9630 } },
  { value: 'bayangol', labelMn: 'Баянгол', labelEn: 'Bayangol', coordinates: { lat: 47.9156, lng: 106.8769 } },
  { value: 'khan-uul', labelMn: 'Хан-Уул', labelEn: 'Khan-Uul', coordinates: { lat: 47.9024, lng: 106.9243 } },
  { value: 'songinokhairkhan', labelMn: 'Сонгинохайрхан', labelEn: 'Songinokhairkhan', coordinates: { lat: 47.9253, lng: 106.8294 } },
] as const;

// Center of Ulaanbaatar
export const UB_CENTER = {
  lat: 47.9184,
  lng: 106.9177,
  zoom: 12
};
