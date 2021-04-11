'use strict';
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = __importStar(require("path"));
function Stopword(text) {
    const idStopword = fs_1.readFileSync(path.join(__dirname, 'db/id-stopword.txt'), 'utf8').split('\n');
    const enStopword = fs_1.readFileSync(path.join(__dirname, 'db/en-stopword.txt'), 'utf8').split('\n');
    const stopwordDictionary = [...idStopword, ...enStopword];
    const words = text.filter(value => {
        if (!stopwordDictionary.includes(value)) {
            return value;
        }
    });
    return words;
}
exports.Stopword = Stopword;
