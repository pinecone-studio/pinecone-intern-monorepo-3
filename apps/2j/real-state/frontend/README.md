# Real Estate Frontend

Монголын хамгийн том үл хөдлөх хөрөнгийн веб сайтын frontend хэсэг.

## Онцлог

- **Next.js 14** - React-ийн хамгийн сүүлийн хувилбар
- **TypeScript** - Type safety болон илүү сайн хөгжүүлэлт
- **Tailwind CSS** - Utility-first CSS framework
- **Apollo GraphQL** - GraphQL client
- **Responsive Design** - Бүх төхөөрөмж дээр ажиллана
- **Mongolian Language Support** - Монгол хэл дэмжинэ

## Хуудаснууд

- **Нүүр хуудас** (`/`) - Онцлох байр, хайлт, шүүлт
- **Үл хөдлөх хөрөнгө** (`/properties`) - Бүх байрны жагсаалт
- **Байрны дэлгэрэнгүй** (`/properties/[id]`) - Байрны мэдээлэл
- **Бидний тухай** (`/about`) - Компанийн мэдээлэл
- **Холбоо барих** (`/contact`) - Холбоо барих хэсэг

## Компонентууд

- **Header** - Хүсэлт, навигаци
- **Footer** - Холбоо барих мэдээлэл, холбоос
- **PropertyCard** - Байрны карт
- **HeroSection** - Нүүр хуудасны гол хэсэг
- **SearchFilters** - Хайлт, шүүлт
- **Layout** - Ерөнхий layout

## Ашигласан технологи

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Apollo GraphQL
- Lucide React (icons)
- ESLint
- Prettier

## Суулгах

```bash
# Dependencies суулгах
npm install

# Development server эхлүүлэх
npm run dev

# Production build хийх
npm run build

# Production server эхлүүлэх
npm start
```

## Хөгжүүлэлт

```bash
# Linting
npm run lint

# Testing
npm run test

# E2E testing
npm run e2e
```

## Файлын бүтэц

```
src/
├── app/                    # Next.js app directory
│   ├── about/             # Бидний тухай хуудас
│   ├── contact/           # Холбоо барих хуудас
│   ├── properties/        # Үл хөдлөх хөрөнгө хуудаснууд
│   │   └── [id]/         # Байрны дэлгэрэнгүй хуудас
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Нүүр хуудас
│   └── global.css        # Global styles
├── components/            # React компонентууд
│   ├── Header.tsx        # Хүсэлт
│   ├── Footer.tsx        # Хөл
│   ├── Layout.tsx        # Layout wrapper
│   ├── PropertyCard.tsx  # Байрны карт
│   ├── HeroSection.tsx   # Hero хэсэг
│   ├── SearchFilters.tsx # Хайлт, шүүлт
│   └── index.ts          # Export файл
├── types/                # TypeScript types
│   └── property.ts       # Property types
└── providers/            # Context providers
    └── ApolloWrapper.tsx # Apollo GraphQL wrapper
```

## API Integration

Энэ frontend нь GraphQL API-тай холбогдож ажиллана:

- **Backend URI**: `process.env.BACKEND_URI` эсвэл `http://localhost:4200/api/graphql`
- **Authentication**: localStorage-д token хадгална
- **Apollo Client**: GraphQL queries, mutations, subscriptions

## Environment Variables

```env
BACKEND_URI=http://localhost:4200/api/graphql
NEXT_PUBLIC_APP_URL=http://localhost:4201
```

## Deployment

```bash
# Vercel deployment
npm run deploy-dev    # Development
npm run deploy-prod   # Production

# Preview
npm run preview
```

## Хөгжүүлэгчдэд зориулсан мэдээлэл

- **Code Style**: ESLint + Prettier
- **Type Safety**: TypeScript strict mode
- **Component Structure**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Next.js App Router
- **API**: Apollo GraphQL Client

## Тусламж

Асуулт байвал:
- Email: info@realestate.mn
- Phone: +976 11 123456
- GitHub Issues: [Repository Issues]
