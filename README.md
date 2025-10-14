# Naver Scraping API

API sederhana untuk mengambil data dari Naver Shopping API (`paged-composite-cards`) menggunakan Puppeteer.

## Fitur

- Scraping data JSON dari Naver.
- Random delay dan proxy rotation untuk menghindari deteksi.
- Rate limit: 2 request per detik (pakai PQueue).
- Retry otomatis hingga 10x bila gagal.

## Instalasi

```bash
git clone https://github.com/Darari17/web-scraping-example.git
cd web-scraping-example
npm install
```

## Konfigurasi

Buat file .env:

```
PORT=3000
PROXY_1=http://username:password@ip:port
PROXY_2=http://username:password@ip:port
```

## Run

```
npm start
```

## Endpoint

```
GET /naver?url=<naver_api_url>
```

## Contoh:

```
curl "http://localhost:3000/naver?url=https://search.shopping.naver.com/ns/v1/search/paged-composite-cards?query=iphone"
```
