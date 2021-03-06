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
export declare function parseOfx(arquivoOfx: File, reader: OfxFileReader, opcoes?: OfxOpcoesParse): Promise<Ofx>;
export declare function ofxToJSON(arquivoOfx: File, reader: OfxFileReader, opcoes?: OfxOpcoesToJSON): Promise<any>;
declare class Ofx {
    dadosBanco: any;
    ofxLancamentos: OfxLancamento[];
    dataInicial: Date;
    dataFinal: Date;
    conta: any;
    constructor(arquivoOfxString: string, conta: any, objOfx?: Partial<Ofx>);
    temConta(): boolean;
    temLancamentos(): boolean;
    private _preencheLancamentosComContaPassada;
    private _parseXML2jSON;
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
export {};
