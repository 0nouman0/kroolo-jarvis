# Contributing to Poligap

Thank you for your interest in contributing to Poligap! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Test your changes thoroughly
7. Commit and push your changes
8. Create a Pull Request

## 🏗️ Development Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Git
- Supabase account (for backend testing)
- Google Gemini API key (for AI features)

### Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in your environment variables
3. Run `npm run dev` to start the development server

## 📝 Code Style Guidelines

### JavaScript/React
- Use ES6+ features
- Follow React functional components pattern
- Use hooks for state management
- Keep components small and focused
- Use meaningful variable and function names

### CSS/Tailwind
- Use Tailwind CSS utility classes
- Follow the established design system
- Maintain responsive design principles
- Keep custom CSS minimal

### File Organization
- Components in `/src/components/`
- Utilities in `/src/lib/`
- Contexts in `/src/contexts/`
- Hooks in `/src/hooks/`
- Styles in `/src/styles/`

## 🧪 Testing

### Before Submitting
- Test all functionality manually
- Ensure responsive design works on mobile
- Check console for errors
- Verify all links and navigation work
- Test file upload and processing
- Validate form submissions

### Test Cases
- User authentication flow
- Document upload and analysis
- Policy generation
- Export functionality
- Profile management
- Analytics dashboard

## 📋 Pull Request Process

1. **Title**: Use clear, descriptive titles
   - `feat: add user profile export functionality`
   - `fix: resolve PDF parsing issue with large files`
   - `docs: update installation instructions`

2. **Description**: Include:
   - What changes were made
   - Why the changes were necessary
   - Any breaking changes
   - Screenshots for UI changes
   - Testing instructions

3. **Review**: 
   - Code will be reviewed by maintainers
   - Address any feedback promptly
   - Ensure CI checks pass

## 🐛 Bug Reports

When reporting bugs, please include:
- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Browser/environment** information
- **Console errors** if any

## 💡 Feature Requests

For feature requests:
- Check existing issues first
- Provide clear use case and rationale
- Include mockups or examples if applicable
- Consider implementation complexity

## 🎨 UI/UX Guidelines

### Design Principles
- Clean, professional appearance
- Intuitive navigation
- Responsive design (mobile-first)
- Accessibility compliance
- Consistent color scheme and typography

### Component Standards
- Reusable components
- Props validation
- Error states handling
- Loading states
- Empty states

## 🔄 Commit Guidelines

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(auth): add social login with Google
fix(upload): resolve file size validation issue
docs(readme): update installation instructions
style(components): format code with prettier
```

## 🔐 Security

- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Follow secure coding practices
- Report security vulnerabilities privately

## 📚 Documentation

- Update README.md for new features
- Add comments for complex logic
- Document API changes
- Include examples for new components

## 🏷️ Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to docs
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `priority:high`: High priority items

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Keep discussions focused and productive

## 📞 Getting Help

- Join our discussions in issues
- Ask questions in Pull Requests
- Review existing documentation
- Check the README for common solutions

## 🙏 Recognition

Contributors will be recognized in:
- README acknowledgments
- Release notes
- Project documentation

Thank you for contributing to Poligap! 🎉
