# Spark - Video Asset Manager

A fullstack video asset management application that allows users to save and organize videos from YouTube, Instagram, and TikTok with custom tags.

## Features

- Submit video URLs from YouTube, Instagram, and TikTok
- Automatic platform detection from URL
- Tag videos with preset categories (Motion, Typography, Color, Sound design)
- Duplicate detection with URL normalization
- Persistent storage with SQLite database
- Responsive grid view of saved assets
- Real-time preview before saving

## Getting Started

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Running Tests

```bash
# Type checking
npm run build

# Manual API testing
curl -X POST http://localhost:3000/api/preview \
  -H "Content-Type: application/json" \
  -d '{"url":"https://youtube.com/watch?v=abc123"}'
```

## Architecture

### Technology Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Database**: SQLite with better-sqlite3
- **Validation**: Zod for runtime type validation

### Project Structure

```
app/
├── api/
│   ├── preview/route.ts    # Preview endpoint for URL validation
│   └── assets/route.ts     # CRUD endpoints for assets
├── components/             # React components
│   ├── AssetSubmissionForm.tsx
│   ├── AssetPreviewCard.tsx
│   ├── AssetGrid.tsx
│   ├── AssetCard.tsx
│   ├── PlatformBadge.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
└── page.tsx               # Main page orchestration
lib/
├── db/
│   ├── schema.sql         # Database schema
│   ├── connection.ts      # Database singleton
│   └── operations.ts      # CRUD operations
├── types/
│   └── asset.ts          # TypeScript type definitions
└── validation/
    ├── schemas.ts        # Zod validation schemas
    └── url-validator.ts  # Platform detection & URL normalization
data/
└── spark.db              # SQLite database (gitignored)
```

### Key Design Decisions

#### 1. SQLite for Persistence

- No external dependencies or API keys required
- Fast, reliable, and suitable for production-scale prototypes
- Easy migration path to PostgreSQL if needed
- Demonstrates proper database interaction patterns

#### 2. URL Normalization

Different URL formats for the same video (e.g., `youtube.com/watch?v=abc` and `youtu.be/abc`) are normalized to a canonical format for duplicate detection:

- Extract platform-specific identifiers (video ID, post code, etc.)
- Store both original URL (for display) and normalized URL (for uniqueness)
- Use normalized URL as unique constraint in database

#### 3. Component Architecture

Components follow the Single Responsibility Principle:

- `AssetSubmissionForm`: URL input and validation
- `AssetPreviewCard`: Platform display and tag selection
- `AssetGrid`: Layout container for assets
- `AssetCard`: Individual asset display
- Shared components: `LoadingSpinner`, `ErrorMessage`, `PlatformBadge`

#### 4. Validation Strategy

Two-layer validation approach:

- Client-side: React form validation for immediate feedback
- Server-side: Zod schemas for type-safe runtime validation
- Clear error messages with appropriate HTTP status codes (400 for malformed input, 422 for unsupported platforms)

## API Endpoints

### POST /api/preview

Preview a video URL before saving.

**Request:**
```json
{
  "url": "https://youtube.com/watch?v=abc123"
}
```

**Response:**
```json
{
  "url": "https://youtube.com/watch?v=abc123",
  "platform": "youtube",
  "existing_asset": null
}
```

### POST /api/assets

Create a new asset or return existing one.

**Request:**
```json
{
  "url": "https://youtube.com/watch?v=abc123",
  "tags": ["Motion", "Sound design"]
}
```

**Response:**
```json
{
  "asset": {
    "id": "uuid",
    "url": "https://youtube.com/watch?v=abc123",
    "normalizedUrl": "https://www.youtube.com/watch?v=abc123",
    "platform": "youtube",
    "tags": ["Motion", "Sound design"],
    "createdAt": 1234567890
  },
  "created": true
}
```

### GET /api/assets

Retrieve all saved assets.

**Response:**
```json
{
  "assets": [...]
}
```

## Supported URL Formats

### YouTube
- `https://youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://youtube.com/embed/VIDEO_ID`
- `https://youtube.com/v/VIDEO_ID`

### Instagram
- `https://instagram.com/p/POST_CODE`
- `https://instagram.com/reel/POST_CODE`
- `https://instagram.com/tv/POST_CODE`

### TikTok
- `https://tiktok.com/@user/video/VIDEO_ID`
- `https://tiktok.com/v/VIDEO_ID`
- `https://vm.tiktok.com/SHORT_CODE`

## Trade-offs & Limitations

### Trade-offs Made

- No thumbnail fetching (would require platform API integration and keys)
- No pagination (acceptable for prototype scale < 100 assets)
- No search/filter functionality
- Synchronous DB operations (acceptable for SQLite)
- No optimistic UI updates (refetch after mutations for consistency)

### Future Enhancements

- **Video Metadata**: Fetch thumbnails, titles, authors using platform oEmbed APIs
- **Search & Filtering**: Full-text search, filter by platform/tags
- **Pagination**: Infinite scroll or page-based navigation for large libraries
- **Authentication**: Multi-user support with user-specific libraries
- **Database Migration**: Move to PostgreSQL with Prisma ORM for production
- **Optimistic Updates**: Use React Query for better UX
- **Export**: CSV/JSON export of asset library
- **Bulk Operations**: Delete multiple assets, batch retagging
- **Analytics**: View counts, most popular platforms/tags

## Code Quality

This project follows best practices:

- TypeScript strict mode with no `any` types
- Type-safe runtime validation with Zod
- Single Responsibility Principle for components and functions
- DRY principle with reusable UI components
- Proper error handling with specific error types
- SQL injection prevention with prepared statements
- Semantic HTML for accessibility
- Consistent naming conventions (camelCase for variables, PascalCase for components)
