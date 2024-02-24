# firestore-json

A Node.js application for importing and exporting JSON data to and from Firebase (Firestore), supporting Google Cloud Platform (GCP) projects.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js installed on your machine
- Cloned the repository to your local machine

### Installing

```bash
npm install
```

### Configuration

Before you begin using the application, ensure you have your Firebase project configured and your Google Cloud Platform project ID ready.

## Usage

This application supports importing and exporting JSON data to Firebase. Here are the commands to use each functionality:

### Importing Data

To import data from a JSON file into your Firestore datbase, use the following command:

```bash
npm start import [file-name.json] --project=[my-gcp-project-id]
```

Replace `[file-name.json]` with the path to your JSON file and `[my-gcp-project-id]` with your actual GCP project ID.

### Exporting Data

To export data to a JSON file from your Firestore database, use the following command:

```bash
npm start import [file-name.json] --project=[my-gcp-project-id]
```

Replace `[file-name.json]` with the desired outfile file path/name and `[my-gcp-project-id]` with your actual GCP project ID.