'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tfidf_1 = require("./tfidf");
const CountVectorized_1 = require("./CountVectorized");
class VSM extends tfidf_1.Tfidf {
    constructor(documents, idfVector = []) {
        const Vectorized = CountVectorized_1.CountVectorized(documents);
        super(Vectorized, idfVector);
        this.idfPowWeight = [];
        this.dimension();
    }
    getIdfVectorized() {
        return super.getIdfVectorized();
    }
    getWeightVectorized() {
        return super.getWeightVectorized();
    }
    getPowWeightVectorized() {
        return this.idfPowWeight;
    }
    dimension() {
        const idfWeight = this.getWeightVectorized();
        let powTfidf = idfWeight.map((x, indexX) => {
            let idx;
            idx = x.map((y, indexY) => {
                return {
                    [Object.keys(y)[0]]: y[Object.keys(y)[0]] ** 2
                };
            });
            return idx;
        });
        this.idfPowWeight = powTfidf;
        powTfidf = [];
    }
}
exports.VSM = VSM;
