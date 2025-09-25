# CLAUDE.md

This file provides guidance for AI assistants when working with code in this repository.

## Project Overview

This repository contains both documentation and a React UI implementation for **Spec-Driven Development (SDD)**, a methodology that inverts the traditional software development workflow. Instead of specifications serving code, code serves specifications.

**Repository Structure:**
- `spec-driven.md` - Complete methodology documentation
- `spec-kit-ui/` - React-based web interface for learning and implementing SDD
- The UI provides interactive prompt generators, tutorials, and templates for SDD workflows

## Key Concepts

### Core Principles

- **Specifications as the Lingua Franca**: Specifications are the primary artifact, code is the expression
- **Executable Specifications**: Precise, complete, and unambiguous enough to generate working systems
- **Continuous Refinement**: Consistency validation happens continuously, not as one-time gates
- **Research-Driven Context**: Research agents gather technical context throughout the process
- **Bidirectional Feedback**: Production reality informs specification evolution

### The Constitutional Foundation

The methodology is governed by a **Nine-Article Constitution** (`memory/constitution.md`) that ensures architectural discipline:

1. **Library-First Principle**: Every feature must begin as a standalone library
2. **CLI Interface Mandate**: All functionality must be accessible via command-line interfaces
3. **Test-First Imperative**: No implementation code before tests (non-negotiable)
4. **Integration-First Testing**: Use realistic environments over mocks
5. **Simplicity and Anti-Abstraction**: Start simple, add complexity only when proven necessary

### Core Commands

The methodology provides three powerful commands:

1. **`/specify`**: Transforms feature descriptions into structured specifications with automatic repository management
2. **`/plan`**: Creates comprehensive implementation plans from feature specifications
3. **`/tasks`**: Generates executable task lists from implementation plans

## Working with This Repository

This repository contains both SDD methodology documentation and a React UI implementation:

### Documentation Work
- The main artifact is `spec-driven.md` which contains the complete methodology
- Use this as a reference for understanding SDD principles and implementation approaches
- The documentation serves as a template for implementing SDD in other projects

### React UI Development
- The UI is in the `spec-kit-ui/` subdirectory
- **Development**: `cd spec-kit-ui && npm run dev`
- **Build**: `cd spec-kit-ui && npm run build`
- **Lint**: `cd spec-kit-ui && npm run lint`
- The UI provides interactive prompt generators for SDD workflows

### Important Notes
- **Never reference "claude" in commits or PRs**
- Focus on the SDD methodology and user benefits
- Maintain the educational and practical value of the UI components

## Template Structure

The methodology relies on structured templates that:

- **Prevent Premature Implementation**: Focus on WHAT users need, not HOW to implement
- **Force Explicit Uncertainty Markers**: Use `[NEEDS CLARIFICATION]` for ambiguities
- **Enforce Constitutional Compliance**: Phase gates check architectural principles
- **Maintain Hierarchical Detail**: Keep high-level plans readable, extract complexity to separate files

### Recent Template Optimizations
The React UI prompt generators have been optimized for efficiency and effectiveness:

- **Specification Template**: Reduced from 43 to 8 variables (-81% reduction)
- **Implementation Plan Template**: Reduced from 19 to 7 variables (-63% reduction)
- **Clarification Template**: Reduced from 17 to 7 variables (-59% reduction)

These optimizations focus on natural language expression over rigid forms, reducing cognitive load while improving prompt quality.

## Architecture Focus

SDD is designed to produce:

- **Modular Code**: Every feature starts as a standalone library
- **Testable Systems**: Test-first development with integration-first testing
- **Maintainable Solutions**: Clear separation of concerns and minimal abstraction
- **Observable Components**: Everything accessible through CLI interfaces

## When Working with SDD Projects

Remember that SDD projects follow a specific workflow:

1. **Specification First**: Create comprehensive feature specifications using `/specify`
2. **Implementation Planning**: Generate detailed technical plans using `/plan`
3. **Task Generation**: Create executable task lists using `/tasks`
4. **Constitutional Compliance**: All work must pass the constitutional gates
5. **Continuous Evolution**: Specifications evolve based on production feedback