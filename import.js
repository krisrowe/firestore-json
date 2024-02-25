const { Firestore } = require('@google-cloud/firestore');
const fs = require('fs');

/**
 * Initializes Firestore with optional project and service account key.
 * @param {string} [projectId] - Google Cloud Project ID.
 * @param {string} [serviceAccountKeyPath] - Path to the service account key file.
 * @returns {Firestore} Firestore instance.
 */
function initializeFirestore(projectId, serviceAccountKeyPath) {
    const options = {};
    if (projectId) options.projectId = projectId;
    if (serviceAccountKeyPath) {
        options.credentials = JSON.parse(fs.readFileSync(serviceAccountKeyPath, 'utf8'));
    }
    return new Firestore(options);
}

/**
 * Adds documents to a Firestore collection.
 * @param {Object} collectionData - The data to add to the collection.
 * @param {FirebaseFirestore.CollectionReference} targetCollection - Reference to the target Firestore collection.
 * @param {Firestore} db - Firestore database instance.
 */
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

/**
 * Processes collections and adds them to Firestore.
 * @param {Object} jsonData - The data to process and add to Firestore.
 * @param {Firestore} db - Firestore database instance.
 */
async function processCollections(jsonData, db) {
    for (const [collectionName, collectionData] of Object.entries(jsonData)) {
        // Verify if it's a collection before proceeding
        if (collectionData["$type"] !== "collection") continue;

        const targetCollection = db.collection(collectionName);
        await addDocsToCollection(collectionData, targetCollection, db);
    }
}

/**
 * Executes the Firestore data loading process.
 * @param {Object} options - Execution options.
 * @param {string} [options.projectId] - Google Cloud Project ID.
 * @param {string} [options.serviceAccountKeyPath] - Optional path to the service account key file.
 * @param {string} [options.fileName] - Optional name of the JSON file to load. Defaults to undefined.
 * @param {Object} [options.data] - Optional data object to use directly. Defaults to undefined.
 */
async function execute({ projectId, serviceAccountKeyPath, fileName = undefined, data = undefined }) {
    const db = initializeFirestore(projectId, serviceAccountKeyPath);
    try {
        let jsonData;
        if (data) {
            jsonData = data; // Use directly passed data object if provided
        } else if (fileName) {
            // Load and parse JSON file if fileName is provided
            const fileContent = fs.readFileSync(fileName, 'utf8');
            jsonData = JSON.parse(fileContent);
        } else {
            throw new Error('No data or fileName provided');
        }

        await processCollections(jsonData, db);

        console.log('Data loading complete.');
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

module.exports = { execute };
