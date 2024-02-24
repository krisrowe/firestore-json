# firestore-json

Super simple importing and exporting of JSON data to and from Firebase (Firestore).

Doubles as either a command-line tool or a resuable node.js package/library for use in your own applications.

# Example JSON File

```json
{
  "books": {
    "$type": "collection",
    "book42": {
      "title": "The Life and Times of a Software Engineer",
      "author": "Cody Bytes",
      "genre": "Non-fiction",
      "reviews": {
        "$type": "collection",
        "review1": {
          "author": "I.M. Reading",
          "rating": 5,
          "comment": "A thrilling saga of coffee, code, and bugs. A must-read for anyone who's ever wondered why their program works on the second run."
        }
      }
    },
    "book007": {
      "title": "Debugging: The Hard Way",
      "author": "Try N. Catch",
      "genre": "Horror",
      "reviews": {
        "$type": "collection",
        "review2": {
          "author": "Anne Algorithm",
          "rating": 4,
          "comment": "Frighteningly accurate depiction of a programmer's descent into madness. I couldn't put it down, mostly because I was afraid it would crash if I did."
        }
      }
    }
  }
}
```

# Prerequisites

- Node.js installed on your machine

# Use without cloning this repo locally

Below are example commmands that can be run from anywhere that node.js is installed to import and export data to/from Firestore. 

Command-line parameters explained:
* **--project** specifies the GCP project ID
* **--service-account-key** specifies the local file name, or path and file name, for the json key file of a service account in the GCP project that has access to the Firestore database

## Import

```bash
npx @kdrowe/firestore-json import -- my-data.json --project=$PROJECT_ID --service-account-key=key.json
```

## Export

```bash
npx @kdrowe/firestore-json export -- my-data.json --project=$PROJECT_ID --service-account-key=key.json
```

# Installed Usage

## Install Locally

Clone this repo, then run the following command:

```bash
npm install
```

## Importing Data

To import data from a JSON file into your Firestore datbase, use the following command:

```bash
npm start import -- [file-name.json] --project=[my-gcp-project-id] --service-account-key=key.json
```

Replace `[file-name.json]` with the path to your JSON file and `[my-gcp-project-id]` with your actual GCP project ID.

## Exporting Data

To export data to a JSON file from your Firestore database, use the following command:

```bash
npm start import -- [file-name.json] --project=[my-gcp-project-id] --service-account-key=key.json
```

Replace `[file-name.json]` with the desired outfile file path/name and `[my-gcp-project-id]` with your actual GCP project ID.

# Use it in Your Own Node.js Application

First, ensure you've installed `firestore-json` in your project:

```bash
npm install @kdrowe/firestore-json
```

## Example: Importing JSON Data to Firestore

```javascript
const firestoreJson = require('@kdrowe/firestore-json');

// Configuration for importing
const importConfig = {
  fileName: 'path/to/your/input.json', // Path to the JSON file you want to import
  projectId: 'your-gcp-project-id', // Your GCP Project ID
  serviceAccountKeyPath: 'path/to/your/serviceAccountKey.json' // Path to your Firebase service account key file
};

// Execute the import
firestoreJson.import.execute(importConfig)
  .then(() => console.log('Import successful'))
  .catch((error) => console.error('Import failed', error));
```

## Example: Exporting Firestore Data to JSON

```javascript
const firestoreJson = require('@kdrowe/firestore-json');

// Configuration for exporting
const exportConfig = {
  projectId: 'your-gcp-project-id', // Your GCP Project ID
  serviceAccountKeyPath: 'path/to/your/serviceAccountKey.json', // Path to your Firebase service account key file
  fileName: 'path/to/your/output.json' // Path where you want to save the exported JSON
};

// Execute the export
firestoreJson.export.execute(exportConfig)
  .then(() => console.log('Export successful'))
  .catch((error) => console.error('Export failed', error));
```