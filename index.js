#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Define supported operations in a string array
const supportedOperations = ['import', 'export'];

// Helper function to extract the value of a command line argument
function getFlagValue(flag) {
  const prefix = `${flag}=`;
  const arg = process.argv.find(arg => arg.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

// Extracts non-flag arguments (e.g., file name and operation)
function getNonFlagArguments() {
  return process.argv.slice(2).filter(arg => !arg.startsWith('--'));
}

// Validates and extracts necessary command line arguments
function parseCommandLineArguments() {
  const nonFlagArgs = getNonFlagArguments();
  const operation = nonFlagArgs.find(arg => supportedOperations.includes(arg));
  const fileName = nonFlagArgs.find(arg => arg !== operation);

  if (!operation || !fileName) {
    console.error(`Usage: node index.js <file-name.json> <${supportedOperations.join('|')}> --project=<project-id> --service-account-key=<path-to-service-account-key.json>`);
    process.exit(1);
  }

  const projectId = getFlagValue('--project');
  const serviceAccountKeyPath = getFlagValue('--service-account-key');

  if (!projectId || !serviceAccountKeyPath) {
    console.error('The --project and --service-account-key flags are required.');
    process.exit(1);
  }

  return { operation, projectId, serviceAccountKeyPath, fileName };
}

async function main() {
  const { operation, projectId, serviceAccountKeyPath, fileName } = parseCommandLineArguments();

  // Dynamically require the module based on the operation argument
  const modulePath = `./${operation}.js`;

  // Require the selected module and execute it
  try {
    const module = require(modulePath);
    await module.execute({ projectId, serviceAccountKeyPath, fileName });
  } catch (error) {
    console.error(`Failed to execute "${operation}" operation:`, error);
  }
}

main().catch(console.error);
