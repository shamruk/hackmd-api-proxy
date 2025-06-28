#!/usr/bin/env node

import { HackMDAccount } from './src/index.js';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
HackMD API Proxy CLI

Usage:
  hackmd-proxy list                    List all documents
  hackmd-proxy create <title>          Create a new document
  hackmd-proxy get <url>               Read document content from URL (alias for read)
  hackmd-proxy update <url>            Update document content from URL (reads from stdin)
  hackmd-proxy demo                    Run the demo
  hackmd-proxy --help                  Show this help message

Examples:
  hackmd-proxy list
  hackmd-proxy create "My New Document"
  hackmd-proxy read https://hackmd.io/abc123
  hackmd-proxy get https://hackmd.io/abc123
  echo "# New content" | hackmd-proxy update https://hackmd.io/abc123
`);
    return;
  }

  try {
    const account = new HackMDAccount();
    const command = args[0];

    switch (command) {
      case 'list':
        const documents = await account.getDocuments();
        console.log(documents);
        break;

      case 'create':
        if (args.length < 2) {
          console.error('Error: Please provide a title for the document');
          process.exit(1);
        }
        const title = args.slice(1).join(' ');
        const newDoc = await account.createDocument(title, `# ${title}\n\nCreated via HackMD API Proxy`);
        console.log(`Document created successfully!`);
        console.log(`ID: ${newDoc.id}`);
        console.log(`Title: ${newDoc.title}`);
        break;

      case 'get':
        if (args.length < 2) {
          console.error('Error: Please provide a document URL');
          process.exit(1);
        }
        const readDoc = await account.documentFromUrl(args[1]);
        const content = await readDoc.getContent();
        console.log(content);
        break;

      case 'update':
        if (args.length < 2) {
          console.error('Error: Please provide a document URL');
          process.exit(1);
        }
        
        // Read content from stdin
        let newContent = '';
        process.stdin.setEncoding('utf8');
        
        for await (const chunk of process.stdin) {
          newContent += chunk;
        }
        
        if (!newContent.trim()) {
          console.error('Error: No content provided via stdin');
          process.exit(1);
        }
        
        const updateDoc = await account.documentFromUrl(args[1]);
        const result = await updateDoc.setContent(newContent);
        console.log(result);
        break;

      case 'demo':
        await import('./demos/demo.js');
        break;

      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();