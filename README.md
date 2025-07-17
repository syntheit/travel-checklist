# ✈️ Travel Checklist

A modern, offline-first travel checklist app built with Next.js, shadcn/ui, and PWA support. Easily manage, edit, and share your packing lists with a beautiful, responsive interface.

---

## 🚀 Features

- 📝 Add, edit, and reorder checklist items
- 🌓 Light & dark mode
- 📱 Works offline (PWA)
- 📤 Import/export your lists as JSON
- 🗑️ Bulk delete and uncheck all
- 🐳 Easy Docker deployment
- 🪪 MIT License

---

## 🛠️ Getting Started

### 1. **Clone the repository**
```bash
git clone https://github.com/syntheit/travel-checklist.git
cd travel-checklist
```

### 2. **Install dependencies**
```bash
npm install
```

### 3. **Run the development server**
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker

### **Run with Docker Compose**

1. Copy the provided `docker-compose.yml`:

```yaml
version: '3.8'
services:
  travel-checklist:
    image: synzeit/travel-checklist:latest
    ports:
      - "3000:3000"
```

2. Start the app:
```bash
docker-compose up -d
```

### **Or pull the image directly from Docker Hub:**
```bash
docker pull synzeit/travel-checklist:latest
docker run -p 3000:3000 synzeit/travel-checklist:latest
```

---

## 🌐 Live Demo & More
- **Hosted:** [https://travel-checklist.matv.io](https://travel-checklist.matv.io)
- **Docker Hub:** [https://hub.docker.com/r/synzeit/travel-checklist](https://hub.docker.com/r/synzeit/travel-checklist)