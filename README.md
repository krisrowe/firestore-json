# firestore-json

A Node.js application for importing and exporting JSON data to and from Firebase (Firestore), supporting Google Cloud Platform (GCP) projects.

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