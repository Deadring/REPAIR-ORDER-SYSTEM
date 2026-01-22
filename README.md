# REPAIR ORDER SYSTEM

Sistem manajemen repair order menggunakan React (Frontend) dan Node.js + MySQL (Backend).

## Fitur

- ✅ Menampilkan semua repair order dalam bentuk tabel
- ✅ Tambah repair order baru
- ✅ Edit repair order
- ✅ Hapus repair order
- ✅ Data disimpan di database MySQL
- ✅ REST API dengan Express.js
- ✅ Interface responsif dan modern

## Teknologi yang Digunakan

### Frontend
- React 18
- Axios (HTTP Client)
- CSS3

### Backend
- Node.js
- Express.js
- MySQL2
- CORS
- dotenv

## Struktur Database

Tabel: `repair_orders`

| Field | Type | Description |
|-------|------|-------------|
| id | INT | Primary Key, Auto Increment |
| arrival_number | VARCHAR(50) | Nomor kedatangan |
| arrival_date | DATE | Tanggal kedatangan |
| store | VARCHAR(100) | Nama toko |
| division | VARCHAR(50) | Divisi |
| device_name | VARCHAR(200) | Nama perangkat |
| number_inventory | VARCHAR(100) | Nomor inventaris |
| issue | TEXT | Masalah perangkat |
| repair_note | TEXT | Catatan perbaikan |
| departure_date | DATE | Tanggal keberangkatan |
| departure_number | VARCHAR(50) | Nomor keberangkatan |
| rd | VARCHAR(10) | RD |
| sr | VARCHAR(50) | SR |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu diupdate |

## Cara Instalasi

### 1. Setup Database

1. Buka MySQL dan jalankan file `backend/database.sql`:
```sql
mysql -u root -p < backend/database.sql
```

Atau copy-paste isi file tersebut ke MySQL Workbench/phpMyAdmin.

### 2. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Konfigurasi database (edit file .env)
# Sesuaikan DB_USER dan DB_PASSWORD dengan MySQL Anda

# Jalankan server
npm start
```

Server akan berjalan di `http://localhost:5000`

### 3. Setup Frontend

```bash
# Buka terminal baru, masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan aplikasi
npm start
```

Aplikasi akan buka otomatis di browser `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/repair-orders | Mendapatkan semua repair orders |
| GET | /api/repair-orders/:id | Mendapatkan repair order berdasarkan ID |
| POST | /api/repair-orders | Membuat repair order baru |
| PUT | /api/repair-orders/:id | Update repair order |
| DELETE | /api/repair-orders/:id | Hapus repair order |
| GET | /api/health | Health check |

## Penggunaan

1. **Menampilkan Data**: Data akan otomatis ditampilkan saat aplikasi dibuka
2. **Tambah Data**: Klik tombol "Tambah Repair Order Baru"
3. **Edit Data**: Klik icon pensil (✏️) pada baris yang ingin diedit
4. **Hapus Data**: Klik icon tempat sampah (🗑️) pada baris yang ingin dihapus

## Screenshot

Aplikasi menampilkan tabel dengan kolom:
- Arrival (Number SJ, Date, Origin)
- Device Name
- Number Inventory
- Issue
- Repair Note
- Departure (Date, Number SJ)
- RD, SR
- Actions (Edit/Delete)

## Konfigurasi

File `.env` di folder backend:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=repair_order_db
PORT=5000
```

## Troubleshooting

1. **Port sudah digunakan**: Ganti PORT di file `.env`
2. **Koneksi database gagal**: Periksa kredensial MySQL di `.env`
3. **CORS error**: Pastikan backend sudah berjalan terlebih dahulu

## Development

Untuk development dengan auto-reload:

Backend:
```bash
npm run dev
```

Frontend:
```bash
npm start
```

## Lisensi

MIT License
