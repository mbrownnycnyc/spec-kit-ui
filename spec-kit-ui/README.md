# Spec-Driven Development (SDD) Toolkit

A comprehensive web-based user interface for learning and implementing Spec-Driven Development (SDD). This interactive toolkit provides guidance, prompt generation, and step-by-step tutorials for mastering the SDD methodology.

**SpecKit has achieved rapid adoption with over 16,300 GitHub stars, making it one of the fastest-growing developer tools for specification-driven development.**

## 🌟 Features

### 📋 Overview
- **Interactive Learning**: Understand the core principles of Spec-Driven Development
- **Methodology Guide**: Complete walkthrough of the SDD workflow
- **Progress Tracking**: Visual progress indicators for learning modules

### 🚀 Step-by-Step Guidance
- **Phase-by-Phase Implementation**: Detailed guidance through all SDD phases
- **Code Examples**: Practical examples with real commands
- **Constitutional Compliance**: Ensure adherence to SDD principles
- **Best Practices**: Industry-standard approaches and patterns

### 🎯 Interactive Prompt Generator
- **Variable Substitution**: Dynamic prompt generation with user input
- **Template Library**: Pre-built templates for specifications and implementation plans
- **Copy-to-Clipboard**: Easy integration with your workflow
- **Customizable**: Adapt templates to your specific needs

### 🎓 Interactive Tutorials
- **Beginner to Advanced**: Progressive learning modules
- **Hands-on Exercises**: Practical application of concepts
- **Self-Paced Learning**: Learn at your own speed
- **Quick Start Exercises**: Immediate application of knowledge

### 📝 Templates & Examples
- **Feature Specification Templates**: Ready-to-use specification formats
- **Implementation Plan Templates**: Comprehensive planning templates
- **Constitutional Checklists**: Ensure compliance with SDD principles
- **Code Snippets**: Practical examples for immediate use

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- VS Code with SpecKit extension (optional but recommended)
- PowerShell or bash shell for CLI operations

### Installation

1. **Using SpecKit CLI (Recommended)**
   ```bash
   uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>
   ```

2. **Clone the repository** (for UI development)
   ```bash
   git clone <repository-url>
   cd spec-kit-ui/spec-kit-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5174` (or the URL shown in the terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📚 How to Use

### Navigation
The application is organized into five main sections accessible via the navigation bar:

1. **Overview**: Learn about SDD principles and methodology
2. **Step-by-Step Guide**: Detailed implementation guidance
3. **Prompt Generator**: Create customized prompts for your projects
4. **Interactive Tutorials**: Hands-on learning modules
5. **Templates**: Ready-to-use templates and examples

### VS Code Integration
SpecKit provides seamless integration with VS Code through slash commands:

- **`/specify`**: Create comprehensive feature specifications
- **`/plan`**: Generate detailed implementation plans
- **`/tasks`**: Create executable task lists
- **`/constitution`**: Manage project governance and principles

### Multi-Agent Support
SpecKit works with your preferred AI assistant:
- **GitHub Copilot**: Native integration in VS Code
- **Claude Code**: Full support for Claude-based development
- **Gemini CLI**: Google AI assistant compatibility
- **Cursor**: Multi-model AI editor support

### Using the Prompt Generator

1. **Select a Template**: Choose between Feature Specification or Implementation Plan
2. **Fill Variables**: Enter your specific requirements in the form fields
3. **Generate Prompt**: Click the generate button to create your customized prompt
4. **Copy to Clipboard**: Use the copy button for easy integration

### Following the Step-by-Step Guide

1. **Start with Phase 1**: Setup and Configuration
2. **Progress Sequentially**: Follow each phase in order
3. **Complete the Exercises**: Use the interactive elements to reinforce learning
4. **Track Progress**: Monitor your completion percentage

### Working with Templates

1. **Browse Templates**: Explore the available template types
2. **Copy Templates**: Use the copy button to add to your clipboard
3. **Customize**: Adapt templates to your specific project needs
4. **Apply**: Implement the templates in your SDD workflow

## 🎯 Learning Path

### Beginner
1. Start with the **Overview** section to understand SDD concepts
2. Complete the **Getting Started with SDD** tutorial
3. Practice with the **Quick Start Exercise**

### Intermediate
1. Follow the **Step-by-Step Guide** for a complete project
2. Use the **Prompt Generator** for your own projects
3. Explore different template types

### Advanced
1. Complete all **Interactive Tutorials**
2. Customize templates for complex projects
3. Implement full SDD workflow in your organization

## 🔧 Technology Stack

- **Frontend**: React 19 with JSX
- **Build Tool**: Vite for fast development and building
- **Styling**: Custom CSS with modern design principles
- **State Management**: React Hooks (useState, useEffect)
- **Icons**: Native emoji icons for universal compatibility
- **Multi-Agent Support**: Works with Copilot, Claude Code, Gemini CLI, and Cursor
- **Cross-Platform**: Native support for both PowerShell and bash environments

## 📋 SDD Methodology Overview

Spec-Driven Development (SDD) inverts the traditional software development workflow by making specifications the primary artifact and code the generated output. The methodology consists of:

### Core Principles
- **Specifications as the Lingua Franca**: Specifications are the primary artifact
- **Executable Specifications**: Precise, complete, and unambiguous requirements
- **Continuous Refinement**: Ongoing validation and improvement
- **Research-Driven Context**: Informed technical decision-making
- **Bidirectional Feedback**: Production insights inform future specifications

### Key Commands
- **`/specify`**: Create comprehensive feature specifications
- **`/plan`**: Generate detailed implementation plans
- **`/tasks`**: Create executable task lists

### Constitutional Compliance
The methodology is governed by a nine-article constitution ensuring:
- Library-First development
- CLI interface accessibility
- Test-First implementation
- Simplicity and anti-abstraction principles
- Integration-first testing

## 🤝 Contributing

This toolkit is designed to support the Spec-Driven Development community. To contribute:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## 📄 License

This project is part of the Spec-Driven Development documentation and toolkit.

## 🆘 Support

For questions or issues:
- Refer to the main SDD documentation
- Check the interactive tutorials in the application
- Review the step-by-step guidance section

## 🔄 Updates

The application is regularly updated with:
- New tutorial content
- Additional prompt templates
- Enhanced user experience features
- Latest SDD methodology improvements

---

**Built with ❤️ for the Spec-Driven Development community**
