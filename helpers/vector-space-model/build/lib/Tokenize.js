'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const natural_1 = require("natural");
function urlRemoval(text) {
    const pattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g;
    return text.replace(pattern, "");
}
function singleCharacterRemoval(text) {
    const pattern = /(^| ).( |$)/g;
    return text.replace(pattern, "");
}
function charactersInBracketsRemoval(text) {
    const pattern = / *\([^)]*\) */g;
    return text.replace(pattern, "");
}
function characterRemoval(text) {
    const pattern = /[^a-zA-Z0-9 ]/g;
    return text.replace(pattern, "");
}
function numberRemoval(text) {
    const pattern = /\d/g;
    return text.replace(pattern, "");
}
function Tokenize(text) {
    const tokenizer = new natural_1.WordTokenizer();
    const textToLower = text.toLowerCase();
    return tokenizer.tokenize(charactersInBracketsRemoval(numberRemoval(singleCharacterRemoval(characterRemoval(urlRemoval(textToLower))))));
}
exports.Tokenize = Tokenize;
;
