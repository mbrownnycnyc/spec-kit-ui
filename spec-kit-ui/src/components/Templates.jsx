import React from 'react'
import '../App.css'

const Templates = () => {
  return (
    <div className="content-section active">
      <div className="card">
        <h3>SDD Templates and Examples</h3>
        <p>Ready-to-use templates for your Spec-Driven Development workflow.</p>
      </div>
                </div>
      <div className="card">
        <h4>UI Changes Based on Constitution</h4>
        <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🤔 Why This Template Matters</h4>
          <p style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, color: '#2d3748' }}>This template provides a systematic approach to redesigning your UI based on design inspirations while maintaining constitutional compliance. By leveraging AI assistance to analyze design patterns and generate comprehensive prompts, you ensure that UI changes are both aesthetically pleasing and aligned with your project's governance principles.</p>
        </div>
        <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#ec4899', marginBottom: '1rem' }}>🔄 When to Use This Template</h4>
          <p style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, color: '#2d3748' }}>Use this template when you need to:</p>
          <ul style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: '0.5rem 0', color: '#2d3748' }}>
            <li><strong>Redesign existing UI:</strong> Update the visual appearance while maintaining functionality</li>
            <li><strong>Apply design systems:</strong> Implement new design patterns or branding guidelines</li>
            <li><strong>Improve user experience:</strong> Enhance usability based on modern design principles</li>
            <li><strong>Maintain compliance:</strong> Ensure UI changes adhere to constitutional principles</li>
            <li><strong>Leverage AI assistance:</strong> Use AI to analyze design patterns and generate implementation guidance</li>
          </ul>
        </div>
        <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>🎯 What to Do Next</h4>
          <ol style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }} className="text-dark">
            <li>Generate reference images using nano banana, mobbin, or other design inspiration sources</li>
            <li>Choose your preferred AI assistant (Grok, Gemini, ChatGPT, etc.)</li>
            <li>Copy the template below and attach both your constitution.md and the generated images</li>
            <li>Use the generated prompt to direct your coding agent (Claude Code with Sonnet-4) for implementation</li>
            <li>Ensure all changes maintain constitutional compliance throughout the process</li>
          </ol>
        </div>
        <div className="example-code">{`# UI Redesign Prompt Template

## Context
I need to redesign the UI described in the attached constitution.md file based on the reference images I've provided. The goal is to create a comprehensive prompt that will direct a coding agent (Claude Code with Sonnet-4) to implement these UI changes while maintaining constitutional compliance.

## Reference Images Analysis
Please analyze each attached image and provide:

### Visual Design Elements
- **Color Palette**: Extract primary, secondary, and accent colors with hex codes
- **Typography**: Identify font families, sizes, weights, and hierarchy
- **Layout Structure**: Describe grid systems, spacing, and component arrangements
- **Component Design**: Detail button styles, card designs, form elements, and navigation patterns
- **Visual Hierarchy**: Explain how attention is guided through the interface

### Design Patterns
- **Interaction Models**: Describe hover states, transitions, and micro-interactions
- **Information Architecture**: Explain how content is organized and presented
- **User Flow Patterns**: Detail navigation paths and user journey elements
- **Responsive Behavior**: Note adaptive layouts for different screen sizes

### Aesthetic and Vibe
- **Overall Mood**: Describe the emotional tone and personality (e.g., modern, playful, professional)
- **Design Language**: Characterize the visual style (e.g., minimalist, bold, elegant)
- **Brand Alignment**: Explain how the design supports brand identity
- **User Experience**: Detail the intended user feeling and interaction quality

## Constitutional Compliance Requirements
Review the attached constitution.md and ensure the redesign adheres to:

### Technical Constraints
- **Technology Stack**: Must use [specify from constitution]
- **Performance Requirements**: Must meet [specify from constitution]
- **Accessibility Standards**: Must comply with [specify from constitution]

### Development Principles
- **Library-First Approach**: UI components must be implementable as standalone libraries
- **CLI Accessibility**: All functionality must remain accessible via command-line interfaces
- **Test-First Implementation**: Changes must include comprehensive testing strategies
- **Integration-First Testing**: Must use realistic environments over mocks

### Quality Standards
- **Code Quality**: Must meet [specify from constitution]
- **Documentation Standards**: Must follow [specify from constitution]
- **Security Requirements**: Must comply with [specify from constitution]

## Implementation Prompt Generation
Based on your analysis, generate a comprehensive prompt that includes:

### 1. Technical Implementation Instructions
\`\`\`
I need you to redesign the UI components in [project_name] to match the visual style and interaction patterns shown in the reference images.

**Color System Implementation:**
- Primary colors: [extracted hex codes]
- Secondary colors: [extracted hex codes]
- Accent colors: [extracted hex codes]
- Neutral palette: [extracted hex codes]
- Apply these colors to: buttons, backgrounds, text, borders, and interactive elements

**Typography System:**
- Headings: [font family, sizes, weights]
- Body text: [font family, sizes, weights]
- Use the CSS custom properties approach for maintainability
- Ensure proper contrast ratios for accessibility

**Component Redesign Requirements:**
- Buttons: [describe button styles, states, and interactions]
- Cards: [describe card layouts, shadows, and spacing]
- Forms: [describe form element styles and validation states]
- Navigation: [describe navigation patterns and responsive behavior]
- Layout: [describe grid system and responsive breakpoints]

**Implementation Approach:**
1. Update the CSS/custom properties file with the new design system
2. Redesign each component to match the reference aesthetics
3. Ensure all interactions and transitions are smooth and intuitive
4. Maintain existing functionality while improving visual design
5. Test across different screen sizes and devices
\`\`\`

### 2. Constitutional Compliance Check
\`\`\`
Before implementing, verify that all changes comply with the constitution:

**Article I - Library-First Principle:**
- [ ] Each UI component can be packaged as a standalone library
- [ ] Clear separation between presentation and business logic
- [ ] Minimal external dependencies

**Article II - CLI Interface Mandate:**
- [ ] All functionality remains accessible via CLI
- [ ] No loss of text-based interface capabilities
- [ ] JSON format support maintained

**Article III - Test-First Imperative:**
- [ ] Tests updated before component changes
- [ ] Visual regression tests included
- [ ] Accessibility tests added for new patterns

**Articles VII-IX - Quality Principles:**
- [ ] Implementation maintains simplicity (≤3 projects)
- [ ] No unnecessary abstraction layers added
- [ ] Integration-first testing approach maintained
\`\`\`

### 3. Success Metrics
\`\`\`
The redesign is successful when:
- Visual design matches the reference images within 95% accuracy
- All existing functionality remains intact
- Performance metrics meet or exceed current benchmarks
- Accessibility scores improve or maintain compliance
- User satisfaction with the new design increases
- Constitutional compliance is maintained throughout
\`\`\`

## Deliverables
Please provide this as a single, comprehensive prompt that I can use with Claude Code (Sonnet-4) to implement the UI redesign while maintaining constitutional compliance.`}</div>
        <button className="btn" onClick={() => {
          const templateText = `# UI Redesign Prompt Template

## Context
I need to redesign the UI described in the attached constitution.md file based on the reference images I've provided. The goal is to create a comprehensive prompt that will direct a coding agent (Claude Code with Sonnet-4) to implement these UI changes while maintaining constitutional compliance.

## Reference Images Analysis
Please analyze each attached image and provide:

### Visual Design Elements
- **Color Palette**: Extract primary, secondary, and accent colors with hex codes
- **Typography**: Identify font families, sizes, weights, and hierarchy
- **Layout Structure**: Describe grid systems, spacing, and component arrangements
- **Component Design**: Detail button styles, card designs, form elements, and navigation patterns
- **Visual Hierarchy**: Explain how attention is guided through the interface

### Design Patterns
- **Interaction Models**: Describe hover states, transitions, and micro-interactions
- **Information Architecture**: Explain how content is organized and presented
- **User Flow Patterns**: Detail navigation paths and user journey elements
- **Responsive Behavior**: Note adaptive layouts for different screen sizes

### Aesthetic and Vibe
- **Overall Mood**: Describe the emotional tone and personality (e.g., modern, playful, professional)
- **Design Language**: Characterize the visual style (e.g., minimalist, bold, elegant)
- **Brand Alignment**: Explain how the design supports brand identity
- **User Experience**: Detail the intended user feeling and interaction quality

## Constitutional Compliance Requirements
Review the attached constitution.md and ensure the redesign adheres to:

### Technical Constraints
- **Technology Stack**: Must use [specify from constitution]
- **Performance Requirements**: Must meet [specify from constitution]
- **Accessibility Standards**: Must comply with [specify from constitution]

### Development Principles
- **Library-First Approach**: UI components must be implementable as standalone libraries
- **CLI Accessibility**: All functionality must remain accessible via command-line interfaces
- **Test-First Implementation**: Changes must include comprehensive testing strategies
- **Integration-First Testing**: Must use realistic environments over mocks

### Quality Standards
- **Code Quality**: Must meet [specify from constitution]
- **Documentation Standards**: Must follow [specify from constitution]
- **Security Requirements**: Must comply with [specify from constitution]

## Implementation Prompt Generation
Based on your analysis, generate a comprehensive prompt that includes:

### 1. Technical Implementation Instructions
\`\`\`
I need you to redesign the UI components in [project_name] to match the visual style and interaction patterns shown in the reference images.

**Color System Implementation:**
- Primary colors: [extracted hex codes]
- Secondary colors: [extracted hex codes]
- Accent colors: [extracted hex codes]
- Neutral palette: [extracted hex codes]
- Apply these colors to: buttons, backgrounds, text, borders, and interactive elements

**Typography System:**
- Headings: [font family, sizes, weights]
- Body text: [font family, sizes, weights]
- Use the CSS custom properties approach for maintainability
- Ensure proper contrast ratios for accessibility

**Component Redesign Requirements:**
- Buttons: [describe button styles, states, and interactions]
- Cards: [describe card layouts, shadows, and spacing]
- Forms: [describe form element styles and validation states]
- Navigation: [describe navigation patterns and responsive behavior]
- Layout: [describe grid system and responsive breakpoints]

**Implementation Approach:**
1. Update the CSS/custom properties file with the new design system
2. Redesign each component to match the reference aesthetics
3. Ensure all interactions and transitions are smooth and intuitive
4. Maintain existing functionality while improving visual design
5. Test across different screen sizes and devices
\`\`\`

### 2. Constitutional Compliance Check
\`\`\`
Before implementing, verify that all changes comply with the constitution:

**Article I - Library-First Principle:**
- [ ] Each UI component can be packaged as a standalone library
- [ ] Clear separation between presentation and business logic
- [ ] Minimal external dependencies

**Article II - CLI Interface Mandate:**
- [ ] All functionality remains accessible via CLI
- [ ] No loss of text-based interface capabilities
- [ ] JSON format support maintained

**Article III - Test-First Imperative:**
- [ ] Tests updated before component changes
- [ ] Visual regression tests included
- [ ] Accessibility tests added for new patterns

**Articles VII-IX - Quality Principles:**
- [ ] Implementation maintains simplicity (≤3 projects)
- [ ] No unnecessary abstraction layers added
- [ ] Integration-first testing approach maintained
\`\`\`

### 3. Success Metrics
\`\`\`
The redesign is successful when:
- Visual design matches the reference images within 95% accuracy
- All existing functionality remains intact
- Performance metrics meet or exceed current benchmarks
- Accessibility scores improve or maintain compliance
- User satisfaction with the new design increases
- Constitutional compliance is maintained throughout
\`\`\`

## Deliverables
Please provide this as a single, comprehensive prompt that I can use with Claude Code (Sonnet-4) to implement the UI redesign while maintaining constitutional compliance.`;
          navigator.clipboard.writeText(templateText);
        }}>Copy Template</button>
      </div>

      <div className="card">
        <h4>Building Claude Agents Based on Project Specifications</h4>
        <div style={{ background: 'rgba(72, 187, 120, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#48bb78', marginBottom: '1rem' }}>🤔 Why This Template Matters</h4>
          <p style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, color: '#2d3748' }}>This template helps you generate project-specific Claude agents that understand your codebase, constitution, and implementation requirements. By leveraging your existing specifications and available MCP tools, you can create targeted agents for common development tasks.</p>
        </div>
        <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#ec4899', marginBottom: '1rem' }}>🔄 When to Use This Template</h4>
          <p style={{ textAlign: 'left', lineHeight: '1.8', margin: 0, color: '#2d3748' }}>Use this template when you need to:</p>
          <ul style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: '0.5rem 0', color: '#2d3748' }}>
            <li><strong>Automate repetitive tasks:</strong> Create agents for testing, documentation, or code reviews</li>
            <li><strong>Improve team efficiency:</strong> Build agents that understand your project's specific patterns</li>
            <li><strong>Leverage MCP tools:</strong> Utilize available tools for context-aware automation</li>
            <li><strong>Scale development processes:</strong> Extend your team's capabilities with specialized agents</li>
            <li><strong>Maintain consistency:</strong> Ensure agents follow your constitutional principles</li>
          </ul>
        </div>
        <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
          <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>🎯 What to Do Next</h4>
          <ol style={{ textAlign: 'left', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }} className="text-dark">
            <li>Copy the template below and execute it with Claude Code</li>
            <li>Review the generated agent descriptions for relevance</li>
            <li>Use the output with the <code>/agents</code> command to build your agents</li>
            <li>Test agents on small tasks before full deployment</li>
            <li>Refine agents based on project evolution and team feedback</li>
          </ol>
        </div>

        <div className="example-code">{`Inspect the project constitution, implementation-plan and specs, and produce a prompt to command claude code to generate five of the most relevant agents for this project. They should be short descriptions to utilize the Claude Code Agent build process rather than full out markdown files. Take a look at the MCP tools available as well.

Primary purpose: The agents should control context usage for the main thread by handling specialized tasks independently.

Focus on agents that will:
- Automate repetitive development tasks while minimizing main thread context
- Enforce constitutional compliance through dedicated oversight
- Improve code quality and testing with focused analysis
- Streamline documentation and review processes efficiently
- Leverage available MCP tools for specialized operations

The output should be concise agent descriptions ready for use with /agents command.`}</div>

        <button className="btn" onClick={() => {
          const templateText = `Inspect the project constitution, implementation-plan and specs, and produce a prompt to command claude code to generate five of the most relevant agents for this project. They should be short descriptions to utilize the Claude Code Agent build process rather than full out markdown files. Take a look at the MCP tools available as well.

Primary purpose: The agents should control context usage for the main thread by handling specialized tasks independently.

Focus on agents that will:
- Automate repetitive development tasks while minimizing main thread context
- Enforce constitutional compliance through dedicated oversight
- Improve code quality and testing with focused analysis
- Streamline documentation and review processes efficiently
- Leverage available MCP tools for specialized operations

The output should be concise agent descriptions ready for use with /agents command.`;
          navigator.clipboard.writeText(templateText);
        }}>Copy Template</button>
      </div>
    </div>
  )
}

export default Templates