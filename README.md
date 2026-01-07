# Atlantis - Spiritual Guidance Platform

A dynamic, bilingual spiritual guidance website with authentication, user dashboard, and admin panel.

## Features

- 🌍 **Bilingual Support**: English & Arabic with easy language switching
- 🔐 **Authentication**: Secure login/signup with Supabase
- 📱 **Responsive Design**: Works on all devices
- 🎨 **Modern UI**: Clean, spiritual-themed interface
- 📊 **User Dashboard**: Track spiritual progress and journal entries
- 👑 **Admin Panel**: Manage users, content, and translations
- 🔊 **Meditation Player**: Guided meditation sessions
- 📝 **Spiritual Journal**: Personal reflections with mood tracking

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (Auth + Database)
- **Hosting**: Netlify (with serverless functions)
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Playfair Display, Poppins)

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- Git
- Supabase account
- Netlify account

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Create the following tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  meditation_streak INTEGER DEFAULT 0,
  total_meditations INTEGER DEFAULT 0,
  journal_entries INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Journal entries table
CREATE TABLE journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  mood TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Content table
CREATE TABLE content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'article',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

4. Enable Row Level Security (RLS) and create policies.

### 3. Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd atlantis
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Supabase credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

4. Start local server:
```bash
netlify dev
```

### 4. Deployment

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`

3. Deploy!
```bash
netlify deploy --prod
```

## Project Structure

```
atlantis/
├── index.html                    # Main landing page
├── pages/                        # Page templates
│   ├── login.html               # Login/Signup page
│   ├── dashboard.html           # User dashboard
│   └── admin.html              # Admin panel
├── css/
│   └── style.css               # All styles
├── js/
│   ├── supabase.js             # Supabase initialization
│   ├── auth.js                 # Authentication logic
│   ├── forms.js                # Form handling
│   └── utils.js               # Utilities & i18n
├── functions/                  # Netlify Functions
│   ├── signup.js              # Signup API
│   └── protected-api.js       # Protected endpoints
├── translations/               # i18n files (optional)
│   ├── en.json
│   └── ar.json
├── .env                       # Environment variables
├── netlify.toml              # Netlify configuration
└── README.md                 # This file
```

## Adding New Languages

1. Create a new translation file in `translations/` folder (e.g., `es.json`)
2. Update the language switcher in HTML files
3. Add language to `SUPPORTED_LANGUAGES` in `.env`
4. Update the i18n manager in `utils.js`

## API Endpoints

- `POST /api/signup` - User registration
- `GET /api/stats` - User statistics (protected)
- `GET /api/users` - List users (admin only)
- `GET/POST /api/content` - Content management

## Development Guidelines

1. Follow mobile-first responsive design
2. Use semantic HTML5 elements
3. Maintain consistent spacing (1rem = 16px)
4. Use CSS custom properties (variables) for theming
5. Follow ES6+ JavaScript practices
6. Add comments for complex logic
7. Test all features on different screen sizes

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Email: support@atlantis-spiritual.com

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Atlantis** - Your journey to spiritual growth begins here. ✨