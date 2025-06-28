import { HackMDAccount } from '../src/index.js';

async function simpleDemo() {
  console.log('HackMD API Proxy - Simple Demo\n');
  
  try {
    // Create account instance
    const account = new HackMDAccount();
    
    // List documents
    console.log('Your HackMD Documents:');
    console.log('======================\n');
    const documents = await account.getDocuments();
    console.log(documents);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('\nMake sure you have set HACKMD_API_TOKEN in your .env file');
  }
}

simpleDemo();