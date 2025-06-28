# HackMD API Proxy

A simplified proxy for HackMD API, designed for LLM (Large Language Model) consumption. This proxy provides a clean, minimal interface to interact with HackMD documents, returning responses in markdown format instead of JSON.

## Features

- **Simple API** - Only essential methods exposed
- **Markdown responses** - All responses formatted as markdown for better LLM readability
- **Zero configuration** - Automatically loads API token from environment
- **URL parsing** - Extract document IDs from HackMD URLs
- **Document management** - Create, read, update documents

## Installation

### Install dependencies
`npm install`

## Getting Your API Token

1. Go to [HackMD](https://hackmd.io)
2. Navigate to Settings → API
3. Click "Create API token"
4. Copy the token and add it to your `.env` file

## Usage

### Basic Example

```javascript
import { HackMDAccount } from 'hackmd-api-proxy';

// Create account instance (token loaded from .env)
const account = new HackMDAccount();

// Get all documents
const documents = await account.getDocuments();
console.log(documents);

// Create a new document
const newDoc = await account.createDocument(
  'My Document Title',
  '# Hello World\n\nThis is my document content.'
);

// Get document content
const content = await newDoc.getContent();

// Update document content
await newDoc.setContent('# Updated Content\n\nNew content here.');
```

### Working with URLs

```javascript
// Get document from HackMD URL
const doc = await account.documentFromUrl('https://hackmd.io/abc123def456');

// Read content
const content = await doc.getContent();

// Update content
await doc.setContent('# New Content');
```

## API Reference

### HackMDAccount

The main class for interacting with HackMD.

#### Constructor
```javascript
new HackMDAccount()
```
Creates a new account instance. Automatically loads `HACKMD_API_TOKEN` from environment.

#### Methods

##### `getDocuments()`
Returns a markdown-formatted list of all documents in your account.

##### `createDocument(title, content)`
Creates a new document with the specified title and content.
- `title` (string): Document title
- `content` (string): Document content in markdown
- Returns: `HackMDDocument` instance

##### `documentFromUrl(url)`
Creates a document instance from a HackMD URL.
- `url` (string): HackMD document URL
- Returns: `HackMDDocument` instance

### HackMDDocument

Represents a HackMD document.

#### Properties

##### `id`
The document ID.

##### `title`
The document title.

##### `metadata`
Returns formatted document metadata as markdown.

#### Methods

##### `getContent()`
Fetches and returns the current document content.

##### `setContent(content)`
Updates the document content.
- `content` (string): New content in markdown
- Returns: Success message with update details

## Running the Demo

```bash
npm run demo
# or
node demos/demo.js
```

The demo script will:
1. Connect to HackMD API
2. List your documents
3. Create a new document
4. Read and update its content
5. Display document metadata

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HACKMD_API_TOKEN` | Your HackMD API token | Yes |

## Design Philosophy

This proxy is designed specifically for LLM consumption:

1. **Markdown over JSON**: All responses are formatted as human-readable markdown
2. **Minimal API surface**: Only essential operations exposed
3. **Simple parameters**: Methods use simple string parameters instead of complex objects
4. **Error clarity**: Meaningful error messages for debugging

## License

MIT