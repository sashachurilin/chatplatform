# HeyChat

Pet project messenger web app inspired by modern messaging clients like Telegram and WhatsApp. Built to experiment with rich chat interactions, live voice recordings with audio waveforms, custom wallpaper themes, and smooth keyboard navigation.

## Features

- **Messaging & Media**: Text messaging, file/image attachments with an interactive lightbox viewer, voice notes with live audio visualizer waveforms, GIFs powered by Giphy/Tenor, interactive polls, and checklists.
- **Personalization**: Customizable chat wallpapers (preset gallery, solid colors, custom images, blur and dim adjustments), selectable message bubble color accents, and dark/light mode toggle.
- **Search & Filters**: Instant message search with query highlighting, media tabs (photos, files, voice, links), and a date picker filter.
- **Navigation & Shortcuts**: Keyboard navigation (search, drawer toggle, chat switching, emoji picker, media viewer navigation), responsive layout for mobile and desktop screens.
- **Profile & Account**: Editable username, bio, user handle, and quick avatar selection.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Radix UI, Phosphor Icons, React Hook Form + Zod.
- **Backend**: Java / Spring Boot (in `chat-service/`) with JPA entities and REST endpoints.

## Getting Started

### Frontend

```bash
cd chat-application
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend

```bash
cd chat-service
./mvnw spring-boot:run
```
