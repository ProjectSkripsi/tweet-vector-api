'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Natural = require('natural');
const id_baseword_json_1 = __importDefault(require("./db/id_baseword.json"));
function Stemming(text) {
    const word = Natural.StemmerId.stem(text);
    if (word === text && !id_baseword_json_1.default.includes(word)) {
        return Natural.PorterStemmer.stem(text);
    }
    else
        return word;
}
exports.Stemming = Stemming;
