'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Stemming_1 = require("./Stemming");
const Stopword_1 = require("./Stopword");
const Tokenize_1 = require("./Tokenize");
function CountVectorized(text) {
    let TextQuery = [];
    let TextToken = [];
    TextQuery = text.map((data) => {
        return data;
    });
    TextToken = TextQuery.map((data) => {
        return Tokenize_1.Tokenize(data);
    });
    let StopwordDocuments = [];
    StopwordDocuments = TextToken.map((data) => {
        return Stopword_1.Stopword(data);
    });
    let StemmedDocuments = [];
    StemmedDocuments = StopwordDocuments.map((stopwordByDocs) => {
        return stopwordByDocs.map((stopwordByWord) => {
            return Stemming_1.Stemming(stopwordByWord);
        });
    });
    const documents = [];
    for (const stemDocsByIndex of StemmedDocuments) {
        for (const stemDocsByWords of stemDocsByIndex) {
            if (documents.length === 0) {
                documents.push(stemDocsByWords);
            }
            else {
                let isFoundinDocuments = false;
                for (const docs of documents) {
                    if (stemDocsByWords === docs) {
                        isFoundinDocuments = true;
                    }
                }
                if (!isFoundinDocuments) {
                    documents.push(stemDocsByWords);
                }
            }
        }
    }
    const CountVectorizedDocuments = [];
    for (const stemDocsByIndex of StemmedDocuments) {
        const TemporaryCountVectorizedDocumens = [];
        for (const docs of documents) {
            const document = {
                [docs]: 0
            };
            for (const stemDocsByWords of stemDocsByIndex) {
                if (stemDocsByWords === docs) {
                    document[Object.keys(document)[0]] += 1;
                }
            }
            TemporaryCountVectorizedDocumens.push(document);
        }
        CountVectorizedDocuments.push(TemporaryCountVectorizedDocumens);
    }
    return CountVectorizedDocuments;
}
exports.CountVectorized = CountVectorized;
