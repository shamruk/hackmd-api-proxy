import { HackMDAccount } from '../src/index.js';

async function demo() {
  console.log('HackMD API Proxy Demo\n====================\n');
  
  try {
    // Create account instance (token loaded from .env)
    const account = new HackMDAccount();
    console.log('✓ Connected to HackMD API\n');
    
    // List all documents
    console.log('Fetching your documents...\n');
    const documents = await account.getDocuments();
    console.log(documents);
    
    // Create a new document
    console.log('\nCreating a new document...\n');
    const documentTitle = 'Demo Document - ' + new Date().toLocaleString();
    const newDoc = await account.createDocument(
      documentTitle,
      '# Hello from HackMD API Proxy!\n\n' +
      'This document was created using the HackMD API proxy.\n\n' +
      '## Features\n' +
      '- Simple API interface\n' +
      '- Markdown-formatted responses\n' +
      '- Easy document management\n\n' +
      'Created at: ' + new Date().toISOString()
    );
    console.log('✓ Document created successfully!');
    console.log('Document ID:', newDoc.id);
    console.log('Document Title:', documentTitle);
    
    // Get document content
    console.log('\nFetching document content...\n');
    const content = await newDoc.getContent();
    console.log('Content:\n', content);
    
    // Update document content
    console.log('\nUpdating document content...\n');
    const updateResult = await newDoc.setContent(
      content + '\n\n## Updated Section\n\nThis section was added via the API at ' + new Date().toISOString()
    );
    console.log(updateResult);
    
    // Show document metadata
    console.log('\nDocument metadata:');
    console.log(newDoc.metadata);
    
    // Demonstrate documentFromUrl (if you have a HackMD URL)
    // Uncomment and replace with your own HackMD document URL to test
    /*
    console.log('\nFetching document from URL...\n');
    const urlDoc = await account.documentFromUrl('https://hackmd.io/YOUR_DOCUMENT_ID');
    console.log('Document from URL:', urlDoc.title);
    const urlContent = await urlDoc.getContent();
    console.log('First 200 characters:', urlContent.substring(0, 200) + '...');
    */
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('\nMake sure you have set HACKMD_API_TOKEN in your .env file');
  }
}

// Run the demo
demo();