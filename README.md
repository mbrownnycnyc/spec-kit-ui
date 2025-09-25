# Spec-Kit UI

A modern web interface for learning and implementing Spec-Driven Development (SDD) methodology. This interactive platform provides tools, tutorials, and templates to help developers master the art of creating executable specifications.

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

### 🌙 Dark Theme
- **Toggle Switch**: Floating button for instant theme switching
- **Complete Coverage**: All components styled for both light and dark modes
- **Smooth Transitions**: Elegant animations between theme changes

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

### Project Structure

```
spec-kit-ui/
├── spec-kit-ui/          # Main application directory
│   ├── src/
│   │   ├── App.jsx       # Main application component
│   │   ├── App.css       # Application styles
│   │   └── main.jsx      # Entry point
│   ├── index.html        # HTML template
│   ├── package.json      # Dependencies and scripts
│   └── vite.config.js    # Vite configuration
└── README.md             # This file
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

## 🔧 Configuration

### Environment Variables
No environment variables are required for basic functionality.

### Customization
- **Colors**: Modify CSS custom properties in `App.css`
- **Templates**: Edit template definitions in `App.jsx`
- **Navigation**: Update sections array in the main component

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Test thoroughly across different browsers
- Ensure accessibility compliance
- Update documentation as needed

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Spec-Driven Development**: Revolutionary methodology for inverting traditional software development workflows
- **Web Speech API**: Enables powerful speech-to-text capabilities
- **React Ecosystem**: Provides robust foundation for modern web applications
- **Vite**: Blazing fast build tool and development server

## 📞 Support

For questions, issues, or contributions:
- Create an issue on GitHub
- Check the documentation in the application
- Review the Spec-Driven Development methodology guides

---

**Built with ❤️ using Spec-Driven Development principles**