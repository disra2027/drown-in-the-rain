# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Next.js 15.4.5 project using the App Router architecture with TypeScript and Tailwind CSS v4.

## Essential Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Run ESLint

Note: No test framework is configured yet. When tests are added, update this section.

## Architecture

### Next.js App Router Structure
This project uses the modern App Router (not Pages Router):
- `app/` - All routes and layouts
- `app/layout.tsx` - Root layout with font configuration and metadata
- `app/page.tsx` - Home page component
- Server Components are the default (use `"use client"` directive for client components)

### Key Technical Decisions
- **Styling**: Tailwind CSS v4 with PostCSS (uses new @theme syntax)
- **Fonts**: Geist Sans & Geist Mono via `next/font/google`
- **TypeScript**: Strict mode enabled
- **Images**: Use `next/image` for optimization

### File Organization Pattern
When creating new features:
1. Routes go in `app/[route-name]/page.tsx`
2. Layouts for nested routes in `app/[route-name]/layout.tsx`
3. Client components should be marked with `"use client"` at the top
4. API routes go in `app/api/[route-name]/route.ts`

### CSS Variables and Theming
The project uses CSS custom properties for theming (defined in `app/globals.css`):
- Light/dark mode support via CSS variables
- Foreground/background color system
- Chart colors predefined (chart-1 through chart-5)