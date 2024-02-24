const { Firestore, Timestamp } = require('@google-cloud/firestore');
const fs = require('fs');

function initializeFirestore(projectId, serviceAccountKeyPath) {
    const options = {};
    if (projectId) options.projectId = projectId;
    if (serviceAccountKeyPath) {
        options.credentials = JSON.parse(fs.readFileSync(serviceAccountKeyPath, 'utf8'));
    }
    return new Firestore(options);
}

// Helper function to standardize data formats
function standardizeFormat(value) {
    if (value instanceof Timestamp) {
        // Convert Firestore Timestamp to ISO 8601 date string
        return value.toDate().toISOString();
    }
    return value;
}

async function fetchCollectionData(collectionRef, db, collectionGroups) {
    let collectionData = { "$type": "collection" }; // Indicate this object is a collection
    const snapshot = await collectionRef.get();
    for (const doc of snapshot.docs) {
        let docData = doc.data();

        // Apply standardizeFormat to each property of docData
        for (const key in docData) {
            docData[key] = standardizeFormat(docData[key]);
        }

        const subcollections = await doc.ref.listCollections();
        for (const subcollection of subcollections) {
            collectionGroups.add(subcollection.id);
            const subcollectionData = await fetchCollectionData(db.collection(`${doc.ref.path}/${subcollection.id}`), db, collectionGroups);
            // Apply standardizeFormat recursively for subcollection data
            for (const key in subcollectionData) {
                if (subcollectionData.hasOwnProperty(key) && key !== "$type") {
                    subcollectionData[key] = standardizeFormat(subcollectionData[key]);
                }
            }
            docData[subcollection.id] = subcollectionData; // Assign subcollection data
        }

        collectionData[doc.id] = docData; // Assign document data
    }
    return collectionData;
}

async function exportFirestoreData({ projectId, serviceAccountKeyPath, fileName }) {
    const db = initializeFirestore(projectId, serviceAccountKeyPath);
    const allCollections = await db.listCollections();
    const exportData = {};
    let collectionGroups = new Set();

    for (const collection of allCollections) {
        const collectionData = await fetchCollectionData(collection, db, collectionGroups);
        exportData[collection.id] = collectionData;
    }

    fs.writeFileSync(fileName, JSON.stringify(exportData, null, 2));
    console.log(`Export complete. Data saved to ${fileName}`);
}

module.exports = { execute: exportFirestoreData };