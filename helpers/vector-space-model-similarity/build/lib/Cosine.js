"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Cosine(queries, documents) {
    const documentsSum = documents.map((document) => {
        let idx = 0;
        for (const word of document) {
            idx += word[Object.keys(word)[0]];
        }
        return idx;
    });
    let queriesSum = 0;
    for (const query of queries) {
        queriesSum += query[Object.keys(query)[0]];
    }
    const documentsSqrt = documentsSum.map(value => {
        return Math.sqrt(value);
    });
    const queriesSqrt = Math.sqrt(queriesSum);
    const queriesMultiDocuments = [];
    for (const document of documents) {
        const queryidf = [];
        const tmpWordDocument = [];
        for (const wordDocument of document) {
            const docidf = [];
            for (const query of queries) {
                if (Object.keys(wordDocument)[0] === Object.keys(query)[0]) {
                    tmpWordDocument.push({
                        [Object.keys(wordDocument)[0]]: wordDocument[Object.keys(wordDocument)[0]] * query[Object.keys(query)[0]]
                    });
                }
            }
            queryidf.push(docidf);
        }
        queriesMultiDocuments.push(tmpWordDocument);
    }
    const queriesMultiDocumentsSum = queriesMultiDocuments.map((document) => {
        let idx = 0;
        for (const word of document) {
            idx += word[Object.keys(word)[0]];
        }
        return idx;
    });
    const queriesMultiDocumentsSqrt = queriesMultiDocumentsSum.map((value, index) => {
        return (value / (queriesSqrt * documentsSqrt[index]));
    });
    return queriesMultiDocumentsSqrt;
}
exports.Cosine = Cosine;
