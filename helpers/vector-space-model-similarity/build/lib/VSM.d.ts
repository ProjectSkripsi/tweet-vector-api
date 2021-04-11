import { Tfidf } from './tfidf';
export declare class VSM extends Tfidf {
    private idfPowWeight;
    constructor(documents: string[], idfVector?: any[]);
    getIdfVectorized(): any[];
    getWeightVectorized(): any[][];
    getPowWeightVectorized(): any[][];
    private dimension;
}
