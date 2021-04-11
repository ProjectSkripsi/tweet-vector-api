'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class Tfidf {
    constructor(val, idfVector = []) {
        this.data = val;
        this.idfVector = idfVector;
        this.weightVectorized = [];
        this.weight();
    }
    weight() {
        const DocumentsFrequency = [];
        for (const [indexX, dataX] of this.data.entries()) {
            let indexY = 0;
            for (const dataY of dataX) {
                if (DocumentsFrequency.length < dataX.length) {
                    if (dataY[Object.keys(dataY)[0]] !== 0) {
                        DocumentsFrequency.push({
                            [Object.keys(dataY)[0]]: 1
                        });
                    }
                    else {
                        DocumentsFrequency.push({
                            [Object.keys(dataY)[0]]: 0
                        });
                    }
                }
                else {
                    if (dataY[Object.keys(dataY)[0]] !== 0) {
                        DocumentsFrequency[indexY][Object.keys(dataY)[0]] += 1;
                    }
                }
                indexY += 1;
            }
        }
        if (this.idfVector.length === 0) {
            this.idfVector = DocumentsFrequency.map(value => {
                return {
                    [Object.keys(value)[0]]: (Math.log2(this.data.length / value[Object.keys(value)[0]]) + 1)
                };
            });
        }
        for (const dataX of this.data) {
            const tmpWeightVector = [];
            let tmpIdf = 0;
            for (const [indexY, dataY] of dataX.entries()) {
                tmpIdf = 0;
                tmpWeightVector.push({
                    [Object.keys(dataY)[0]]: dataY[Object.keys(dataY)[0]] * this.idfVector[indexY][Object.keys(this.idfVector[indexY])[0]]
                });
            }
            this.weightVectorized.push(tmpWeightVector);
        }
    }
    getIdfVectorized() {
        return this.idfVector;
    }
    getWeightVectorized() {
        return this.weightVectorized;
    }
    sum() {
        const TotalTFIDF = [];
        for (const idfX of this.weightVectorized) {
            let sum = 0;
            for (const idfY of idfX) {
                sum += idfY[Object.keys(idfY)[0]];
            }
            TotalTFIDF.push(sum);
        }
        return TotalTFIDF;
    }
}
exports.Tfidf = Tfidf;
