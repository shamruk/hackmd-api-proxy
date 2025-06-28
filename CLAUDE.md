# Claude Context for HackMD API Proxy

This document provides context and guidelines for Claude when working with the HackMD API Proxy project.

## Project Overview

This is a simplified proxy for the HackMD API, designed specifically for LLM consumption. 

## Key Design Principles

1. **Markdown-first responses** - All API responses return markdown instead of JSON
2. **Minimal API surface** - Only essential methods are exposed
3. **Zero configuration** - Automatically loads token from `.env`
4. **Simple parameters** - Methods use simple string parameters

## Architecture

### Core Classes

1. **HackMDConnection** (Private)
   - Handles low-level API communication
   - Manages Bearer token authentication
   - Base URL: `https://api.hackmd.io/v1/`

2. **HackMDAccount** (Public)
   - Main entry point for the API
   - Methods: `documentFromUrl()`, `getDocuments()`, `createDocument()`
   - Automatically loads token from environment

3. **HackMDDocument** (Public)
   - Represents a single document
   - Methods: `getContent()`, `setContent()`
   - Properties: `id`, `title`, `metadata`

## Common Tasks

### Working with Documents

```javascript
// Always start by creating an account instance
const account = new HackMDAccount();

// List documents
const docs = await account.getDocuments();

// Create document
const doc = await account.createDocument('Title', '# Content');

// Work with URLs
const doc = await account.documentFromUrl('https://hackmd.io/...');
```

## Important Implementation Details

1. **Authentication**: Uses Bearer token from `HACKMD_API_TOKEN` environment variable
2. **Error Handling**: All errors are wrapped with meaningful messages
3. **URL Parsing**: Supports multiple HackMD URL formats (direct, user, published)
4. **API Version**: Uses `X-HackMD-API-Version: 1.0.0` header

## Testing

- Tests are in `tests/` directory
- Run with `npm test`
- Uses Jest with ES modules configuration

## Development Guidelines

1. Maintain markdown-formatted responses
2. Keep the API surface minimal
3. Use private methods (with `#`) for internal operations
4. Follow existing code patterns and conventions
5. Update tests when adding new functionality

## Project Structure

```
hackmd-api-proxy/
├── src/               # Source code
├── tests/            # Test files
├── demos/            # Demo scripts
├── hackmd-proxy.js   # CLI tool
└── README.md         # Full documentation
```

For complete API reference and usage examples, refer to [README.md](README.md).