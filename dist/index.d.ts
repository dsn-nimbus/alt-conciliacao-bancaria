declare function parseOfx(arquivoOfx: File, conta?: any, encode?: string): Promise<Ofx>;
declare class Ofx {
    dadosBanco: any;
    ofxLancamentos: OfxLancamento[];
    dataInicial: Date;
    dataFinal: Date;
    conta: any;
    arquivoCompletoJSON: any;
    constructor(arquivoOfxString: string, conta: any, objOfx?: Partial<Ofx>);
    temConta(): boolean;
    temLancamentos(): boolean;
    private _preencheLancamentosComContaPassada;
    private _fileToOfx;
    private _parseData;
    private _normalizarArquivo;
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
declare const _default: {
    parseOfx: typeof parseOfx;
};
export default _default;
