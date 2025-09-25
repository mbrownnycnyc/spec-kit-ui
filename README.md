# Spec-Kit UI

A web UI to assist humans with using spec-kit.  This includes Spec-ear-fier, which is a precursor step to engaging in spec-kit.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mbrownnycnyc/spec-kit-ui.git
   cd spec-kit-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 🌟 Features

### 📖 Interactive Learning
- **Overview Section**: Comprehensive introduction to Spec-Driven Development principles
- **Step-by-Step Journey**: Guided path through SDD methodology
- **Core Principles**: Deep dive into the constitutional foundation of SDD

### 🎙️ Spec-ear-fier
- **Speech-to-Text**: Capture ideas naturally using Web Speech API
- **Real-time Transcription**: See your words appear instantly as you speak
- **Auto-save Functionality**: Save transcripts as markdown files
- **Prompt Generation**: Convert spoken ideas into structured `/specify` and `/clarify` commands

### 🎯 Prompt Generator
- **Template Library**: Pre-built templates for specifications and implementation plans
- **Interactive Variables**: Dynamic form fields for customization
- **Real-time Preview**: See generated prompts as you type
- **Copy to Clipboard**: One-click copying for easy use with AI assistants

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large buttons and intuitive gestures
- **Accessible**: WCAG-compliant color contrasts and navigation

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Tech Stack

- **Framework**: React 19 with hooks
- **Build Tool**: Vite
- **Styling**: CSS with custom properties
- **Markdown**: ReactMarkdown with GitHub Flavored Markdown
- **Icons**: Native emoji support
- **Speech**: Web Speech API integration

## 📚 Browser Support

### Required Features
- **Speech Recognition**: Chrome, Edge, Safari (modern versions)
- **ES6+ Support**: All modern browsers
- **CSS Grid/Flexbox**: IE11+, all modern browsers

### Fallback Behavior
The application gracefully degrades when speech recognition is not available:
- Shows browser compatibility warnings
- Disables speech recording features
- Maintains full functionality for text-based tools