import dotenv from 'dotenv';
import HackMDConnection from './HackMDConnection.js';
import HackMDDocument from './HackMDDocument.js';

export class HackMDAccount {
  #connection;

  constructor() {
    dotenv.config();
    
    const apiToken = process.env.HACKMD_API_TOKEN;
    if (!apiToken) {
      throw new Error('HACKMD_API_TOKEN not found in environment variables');
    }
    
    this.#connection = new HackMDConnection(apiToken);
  }

  async documentFromUrl(url) {
    const documentId = this.#extractDocumentId(url);
    
    // Verify the document exists by fetching its data
    const noteData = await this.#connection.get(`/notes/${documentId}`);
    
    return new HackMDDocument(this.#connection, documentId, noteData);
  }

  async getDocuments() {
    const response = await this.#connection.get('/notes');
    
    // Format as markdown list
    const documents = response.map(note => 
      `- **${note.title || 'Untitled'}** (${note.id})\n` +
      `  - Created: ${new Date(note.createdAt).toLocaleDateString()}\n` +
      `  - Last modified: ${new Date(note.lastChangedAt).toLocaleDateString()}\n` +
      `  - Tags: ${note.tags ? note.tags.join(', ') : 'none'}\n` +
      (note.publishLink ? `  - Published at: ${note.publishLink}\n` : '')
    );
    
    return '## Your HackMD Documents\n\n' + documents.join('\n');
  }

  async createDocument(title, content) {
    const response = await this.#connection.post('/notes', {
      title: title,
      content: content,
      readPermission: 'owner',
      writePermission: 'owner'
    });
    
    return new HackMDDocument(this.#connection, response.id, response);
  }

  #extractDocumentId(url) {
    // HackMD URLs can have various formats:
    // https://hackmd.io/{noteId}
    // https://hackmd.io/{noteId}?view
    // https://hackmd.io/@{username}/{noteId}
    // https://hackmd.io/s/{noteId}
    
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Remove leading slash
    const pathParts = pathname.substring(1).split('/');
    
    let noteId;
    
    if (pathParts[0] === 's') {
      // Published note: /s/{noteId}
      noteId = pathParts[1];
    } else if (pathParts[0].startsWith('@')) {
      // User note: /@{username}/{noteId}
      noteId = pathParts[1];
    } else {
      // Direct note: /{noteId}
      noteId = pathParts[0];
    }
    
    if (!noteId) {
      throw new Error(`Could not extract document ID from URL: ${url}`);
    }
    
    // Remove any query parameters from the noteId
    noteId = noteId.split('?')[0];
    
    return noteId;
  }
}