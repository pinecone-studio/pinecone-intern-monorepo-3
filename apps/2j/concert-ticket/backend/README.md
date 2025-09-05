# Concert Ticket Backend

## 🗄️ MongoDB Atlas Setup

### 1. MongoDB Atlas Account үүсгэх
- [MongoDB Atlas](https://www.mongodb.com/atlas) руу орж бүртгүүлэх
- Free tier сонгох (M0 Sandbox)

### 2. Cluster үүсгэх
- **Cloud Provider:** AWS, Google Cloud, эсвэл Azure
- **Region:** Asia Pacific (Tokyo) эсвэл Singapore
- **Cluster Tier:** M0 Sandbox (Free)

### 3. Database Access
- **Username:** `concert-ticket-user`
- **Password:** Хүчтэй нууц үг үүсгэх
- **Database User Privileges:** Read and write to any database

### 4. Network Access
- **IP Address:** `0.0.0.0/0` (бүх IP-ээс хандах)
- **Description:** Development access

### 5. Connection String авах
Cluster → Connect → Connect your application → Copy connection string

```
mongodb+srv://concert-ticket-user:<password>@cluster0.abc123.mongodb.net/concert-tickets?retryWrites=true&w=majority
```

## 🔐 Centralized Secrets Management

### Environment Variables тохиргоо:

**Workspace-д `.env` файл үүсгэхгүй!** Environment variables-ийг centralized secrets system-ээс татана.

#### 1. **Secrets татах:**
```bash
# Development
npx nx run concert-ticket-backend:get-secrets:dev

# Testing  
npx nx run concert-ticket-backend:get-secrets:testing

# Production
npx nx run concert-ticket-backend:get-secrets:prod
```

#### 2. **Environment variables экспортлох:**
```bash
npx nx run concert-ticket-backend:export-env
```

#### 3. **Хэрэгтэй environment variables:**
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - JWT token-ийн нууц түлхүүр  
- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Frontend URL

## 🚀 Server эхлүүлэх

```bash
# Development
npx nx run concert-ticket-backend:serve

# Production
npx nx run concert-ticket-backend:build
node dist/apps/2j/concert-ticket/backend/main.js
```

## 📊 Database Collections

- **users** - Хэрэглэгчийн мэдээлэл
- **artists** - Уран бүтээлчид
- **concerts** - Концертууд
- **ticketCategories** - Тасалбарын төрлүүд
- **bookings** - Захиалгууд

## 🔍 GraphQL Playground

Server эхлэхэд http://localhost:4000/ дээр GraphQL Playground хүртээмжтэй болно.
