export default class HackMDDocument {
  #connection;
  #documentId;
  #documentData;

  constructor(connection, documentId, documentData) {
    this.#connection = connection;
    this.#documentId = documentId;
    this.#documentData = documentData;
  }

  async getContent() {
    // Fetch the latest document data to get current content
    const response = await this.#connection.get(`/notes/${this.#documentId}`);
    
    // Update cached data
    this.#documentData = response;
    
    // Return content as markdown
    return response.content || '';
  }

  async setContent(content) {
    // Update the document content
    await this.#connection.patch(`/notes/${this.#documentId}`, {
      content: content
    });
    
    // Fetch the updated document data
    const updatedData = await this.#connection.get(`/notes/${this.#documentId}`);
    this.#documentData = updatedData;
    
    // Return success message in markdown
    return `## Document Updated\n\n` +
           `- **Title**: ${updatedData.title || 'Untitled'}\n` +
           `- **ID**: ${updatedData.id}\n` +
           `- **Last modified**: ${new Date(updatedData.lastChangedAt).toLocaleString()}\n` +
           `- **Length**: ${content.length} characters`;
  }

  get id() {
    return this.#documentId;
  }

  get title() {
    return this.#documentData.title || 'Untitled';
  }

  get metadata() {
    // Return formatted metadata as markdown
    const data = this.#documentData;
    return `## Document Metadata\n\n` +
           `- **Title**: ${data.title || 'Untitled'}\n` +
           `- **ID**: ${data.id}\n` +
           `- **Created**: ${new Date(data.createdAt).toLocaleString()}\n` +
           `- **Last modified**: ${new Date(data.lastChangedAt).toLocaleString()}\n` +
           `- **Tags**: ${data.tags ? data.tags.join(', ') : 'none'}\n` +
           `- **Read permission**: ${data.readPermission}\n` +
           `- **Write permission**: ${data.writePermission}\n` +
           (data.publishLink ? `- **Published at**: ${data.publishLink}\n` : '');
  }
}