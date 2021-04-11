export declare class Tfidf {
    private data;
    private idfVector;
    private weightVectorized;
    constructor(val: any[][], idfVector?: any[]);
    private weight;
    getIdfVectorized(): any[][];
    getWeightVectorized(): any[][];
    sum(): number[];
}
