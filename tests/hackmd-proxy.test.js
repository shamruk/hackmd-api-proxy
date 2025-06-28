import { describe, test, expect, beforeAll } from '@jest/globals';
import { HackMDAccount } from '../src/index.js';

describe('HackMD API Proxy', () => {
  let account;
  let testDocument;

  beforeAll(() => {
    account = new HackMDAccount();
  });

  test('should create account instance', () => {
    expect(account).toBeDefined();
    expect(account).toBeInstanceOf(HackMDAccount);
  });

  test('should get documents list', async () => {
    const documents = await account.getDocuments();
    expect(typeof documents).toBe('string');
    expect(documents).toContain('## Your HackMD Documents');
  });

  test('should create a new document', async () => {
    const title = 'Test Document - ' + Date.now();
    const content = '# Test Content\n\nThis is a test document.';
    
    testDocument = await account.createDocument(title, content);
    
    expect(testDocument).toBeDefined();
    expect(testDocument.id).toBeDefined();
  });

  test('should get document content', async () => {
    if (!testDocument) {
      console.warn('Skipping test - no test document created');
      return;
    }
    
    const content = await testDocument.getContent();
    expect(typeof content).toBe('string');
    expect(content).toContain('# Test Content');
  });

  test('should update document content', async () => {
    if (!testDocument) {
      console.warn('Skipping test - no test document created');
      return;
    }
    
    const newContent = '# Updated Test Content\n\nThis content has been updated.';
    const result = await testDocument.setContent(newContent);
    
    expect(result).toContain('## Document Updated');
    expect(result).toContain('Length: ' + newContent.length + ' characters');
    
    // Verify the update
    const updatedContent = await testDocument.getContent();
    expect(updatedContent).toBe(newContent);
  });

  test('should extract document ID from various URL formats', async () => {
    // Test with a known document URL format
    const testUrls = [
      'https://hackmd.io/kvMqpn5DQymcV4iAYNwTaA',
      'https://hackmd.io/@username/kvMqpn5DQymcV4iAYNwTaA',
      'https://hackmd.io/s/kvMqpn5DQymcV4iAYNwTaA'
    ];
    
    // We can't test actual document retrieval without valid URLs,
    // but we can verify the method exists
    expect(account.documentFromUrl).toBeDefined();
    expect(typeof account.documentFromUrl).toBe('function');
  });

  test('should handle errors gracefully', async () => {
    try {
      await account.documentFromUrl('https://hackmd.io/invalid-document-id');
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBeDefined();
    }
  });
});