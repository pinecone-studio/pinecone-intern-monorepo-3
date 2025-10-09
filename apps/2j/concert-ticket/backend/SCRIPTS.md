# 🎭 Mock Data Scripts

Энэ хавтаст MongoDB-д mock data үүсгэх script-ууд байна.

## 📋 Script-ууд

### 1. 🚀 Анхны өгөгдөл үүсгэх
```bash
nx run concert-ticket-backend:seed-data
```
- Хэрэглэгч, дуучин, концерт, тасалбарын ангилал, захиалга үүсгэнэ
- Тест хийхэд зориулсан үндсэн өгөгдөл

### 2. 🎭 Дэлгэрэнгүй mock data үүсгэх
```bash
nx run concert-ticket-backend:generate-mock-data
```
- Илүү олон хэрэглэгч, дуучин, концерт үүсгэнэ
- Санамсаргүй захиалгууд үүсгэнэ
- Тест хийхэд илүү тохиромжтой

### 3. 🧹 Өгөгдөл цэвэрлэх
```bash
nx run concert-ticket-backend:clear-data
```
- Бүх өгөгдлийг цэвэрлэнэ
- Шинэ өгөгдөл үүсгэхээс өмнө ашиглах

## 👥 Тест хийхэд зориулсан хэрэглэгчид

### Админ хэрэглэгч
- **Email**: `admin@concert.com`
- **Password**: `admin123`
- **Role**: `ADMIN`

### Энгийн хэрэглэгчид
- **Email**: `user1@concert.com` / **Password**: `user123`
- **Email**: `user2@concert.com` / **Password**: `user123`
- **Email**: `user3@concert.com` / **Password**: `user123`
- **Email**: `user4@concert.com` / **Password**: `user123`
- **Email**: `user5@concert.com` / **Password**: `user123`

## 🎵 Mock Data-ийн агуулга

### Дуучнууд
- The Hu
- Алтан Ураг
- Батбаяр
- Сара
- Төмөр
- Оюунчимэг
- Баттулга
- Мөнхбаяр

### Концертууд
- 12 концерт (3 сарын хугацаанд)
- Төрөл бүрийн байршил
- VIP, Regular, General Admission тасалбар

### Захиалгууд
- 50 захиалга
- Төрөл бүрийн статус (PENDING, CONFIRMED, CANCELLED)
- Төлбөрийн статус (PENDING, COMPLETED, FAILED)

## 🔧 Ашиглах заавар

1. **Эхлээд өгөгдөл цэвэрлэх**:
   ```bash
   nx run concert-ticket-backend:clear-data
   ```

2. **Mock data үүсгэх**:
   ```bash
   nx run concert-ticket-backend:generate-mock-data
   ```

3. **Backend сервер эхлүүлэх**:
   ```bash
   nx run concert-ticket-backend:serve
   ```

4. **GraphQL Playground нээх**:
   - URL: `http://localhost:3000/api/graphql`

## 📊 Статистик

Script ажилласны дараа дараах статистик харагдана:
- 👥 Хэрэглэгчид: 6
- 🎤 Дуучнууд: 8
- 🎵 Концертууд: 12
- 🎫 Тасалбарын ангиллууд: 36
- 📋 Захиалгууд: ~50

## ⚠️ Анхаарах зүйлс

- Script ажиллахаасаа өмнө MongoDB сервер ажиллаж байгаа эсэхийг шалгаарай
- Environment variables зөв тохируулагдсан эсэхийг шалгаарай
- Өгөгдөл цэвэрлэхэд бүх мэдээлэл алдагдана

## 🐛 Алдаа засах

Хэрэв script ажиллахгүй бол:
1. Database холбоос шалгаарай
2. Environment variables шалгаарай
3. Dependencies суулгасан эсэхийг шалгаарай
4. Console-д алдааны мэдээлэл уншина уу
