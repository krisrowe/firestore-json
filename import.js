const { Firestore } = require('@google-cloud/firestore');
const fs = require('fs');

// Function to initialize Firestore with optional project and service account key
function initializeFirestore(projectId, serviceAccountKeyPath) {
    const options = {};
    if (projectId) options.projectId = projectId;
    if (serviceAccountKeyPath) {
        options.credentials = JSON.parse(fs.readFileSync(serviceAccountKeyPath, 'utf8'));
    }
    return new Firestore(options);
}

async function addDocsToCollection(collectionData, targetCollection, db) {
    for (const docId in collectionData) {
        if (docId === "$type") continue; // Skip the $type property

        const docData = collectionData[docId];
        const docRef = targetCollection.doc(docId);

        let documentData = { ...docData };
        delete documentData["$type"]; // Remove the $type property if it exists on document level

        // Process nested collections if any
        for (const key in documentData) {
            if (documentData[key] && documentData[key]["$type"] === "collection") {
                await addDocsToCollection(documentData[key], docRef.collection(key), db);
                delete documentData[key]; // Remove the nested collection data from the document data
            }
        }

        await docRef.set(documentData); // Add or update the document in Firestore
    }
}

async function processCollections(jsonData, db) {
    for (const [collectionName, collectionData] of Object.entries(jsonData)) {
        // Verify if it's a collection before proceeding
        if (collectionData["$type"] !== "collection") continue;

        const targetCollection = db.collection(collectionName);
        await addDocsToCollection(collectionData, targetCollection, db);
    }
}

// Updated to be called from index.js, accepting project and service account key as parameters
async function execute({ fileName, projectId, serviceAccountKeyPath }) {
    const db = initializeFirestore(projectId, serviceAccountKeyPath);
    try {
        const fileContent = fs.readFileSync(fileName, 'utf8');
        const jsonData = JSON.parse(fileContent);

        await processCollections(jsonData, db);

        console.log('Data loading complete.');
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

// Export the execute function for use by index.js
module.exports = { execute };