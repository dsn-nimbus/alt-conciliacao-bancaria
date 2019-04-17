declare type encodeType = undefined | string;
interface OfxFileReader {
    onload(evento: Event): void;
    readAsText(arquivo: File, encode: encodeType): void;
}
interface OfxOpcoesParse {
    conta?: any;
    encode?: encodeType;
}
interface OfxOpcoesToJSON {
    encode?: encodeType;
}
declare function parseOfxFn(arquivoOfx: File, reader: OfxFileReader, opcoes?: OfxOpcoesParse): Promise<Ofx>;
declare function ofxToJSONFn(arquivoOfx: File, reader: OfxFileReader, opcoes?: OfxOpcoesToJSON): Promise<any>;
declare class Ofx {
    dadosBanco: any;
    ofxLancamentos: OfxLancamento[];
    dataInicial: Date;
    dataFinal: Date;
    conta: any;
    constructor(arquivoOfxString: string, conta: any, objOfx?: Partial<Ofx>);
    static fromFileToJSON(arquivoOfxString: string): any;
    temConta(): boolean;
    temLancamentos(): boolean;
    private _preencheLancamentosComContaPassada;
    private _parseXML2JSON;
    private _preencheModeloComBaseNoArquivo;
    private _parseData;
}
declare class OfxLancamento {
    fitid: string;
    name: string;
    trnamt: string;
    data: string | Date | undefined;
    valor: number | undefined;
    dtposted: string;
    checknum: string;
    refnum: string;
    memo: string;
    bankid: string;
    conta: any;
    constructor(lancamento: any);
    setConta(c: any): void;
    temConta(): boolean;
    _parseData(texto: string): void;
    _parseValorToFloatComDoisDigitos(): void;
    _normalizaNomeLancamento(): void;
    _normalizaRefChecknum(): void;
}
export declare const parseOfx: typeof parseOfxFn;
export declare const ofxToJSON: typeof ofxToJSONFn;
export {};
