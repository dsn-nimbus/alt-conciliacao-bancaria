import xmlParser from 'pixl-xml'

const CODIGO_CHAR_ANSI = 65533
const ENCODE_WINDOW_1252 = 'windows-1252'

function parseOfx(arquivoOfx:File, conta?:any, encode?:string):Promise<Ofx> {
    return new Promise((resolve, reject) => {
        if (!arquivoOfx) {
            return reject('Arquivo não informado.')
        }

        const fileReader = new FileReader()
        fileReader.onload = function(event:Event) {
            let target:any = event.target // TS hack

            // Charsets suportados: UTF-8 e ANSI
            if (encode === undefined) {
                for (var i in target.result) {
                    // Caso o código seja este, 
                    // faz o parse do arquivo de forma diferente:
                    // utilizando windows-1252
                    if (target.result.charCodeAt(i) == CODIGO_CHAR_ANSI) {
                        parseOfx(arquivoOfx, conta, ENCODE_WINDOW_1252)
                    }
                }
            }
            
            try {
                return resolve(new Ofx(target.result, conta))
            } catch (e) {
                return reject(e)
            }
        }

        fileReader.readAsText(arquivoOfx, encode)
        encode = undefined
    })
}

function ofxToJSON(arquivoOfx:File, encode?:string):Promise<any> {
    return new Promise((resolve, reject) => {
        if (!arquivoOfx) {
            return reject('Arquivo não informado.')
        }

        const fileReader = new FileReader()
        fileReader.onload = function(event:Event) {
            let target:any = event.target // TS hack

            // Charsets suportados: UTF-8 e ANSI
            if (encode === undefined) {
                for (var i in target.result) {
                    // Caso o código seja este, 
                    // faz o parse do arquivo de forma diferente:
                    // utilizando windows-1252
                    if (target.result.charCodeAt(i) == CODIGO_CHAR_ANSI) {
                        ofxToJSON(arquivoOfx, ENCODE_WINDOW_1252)
                    }
                }
            }

            try {
                return resolve(Ofx.fromFileToJSON(target.result))
            } catch(e) {
                return reject(e)
            }
        }

        fileReader.readAsText(arquivoOfx, encode)
        encode = undefined
    })
}

function ofxstr2Json(ofxStr:string):any {
    if (!ofxStr || ofxStr.length === 0) {
        throw new Error("O arquivo não possui uma estrutura OFX válida")
    }

    return xmlParser.parse(normalizaOfxString(ofxStr))
}

function normalizaOfxString(ofxStr:string):string {
    let data:{[key:string]:any} = {}
    const ofxRes = ofxStr.split('<OFX>', 2)
    const ofx = '<OFX>' + ofxRes[1]

    data.headerString = ofxRes[0].split(/\r|\n/)
    data.xml = ofx
    // tirar espacos e quebra de linhas ENTRE as tags
    .replace(/>\s+</g, '><')
    // Remove espacos e quebra de linhas ANTES do conteudo das tags
    .replace(/\s+</g, '<')
    // Remove espacos e quebra de linhas DEPOIS do conteudo das tags
    .replace(/>\s+/g, '>')
    // Remove pontos nos nomes das tags de inicio e remove as tags finais com pontos
    .replace(/<([A-Z0-9_]*)+\.+([A-Z0-9_]*)>([^<]+)(<\/\1\.\2>)?/g, '<\$1\$2>\$3')
    // Adiciona as tags finais nos locais faltantes
    .replace(/<(\w+?)>([^<]+)/g, '<\$1>\$2</<added>\$1>')
    // Remove tags finais duplicadas
    .replace(/<\/<added>(\w+?)>(<\/\1>)?/g, '</\$1>')
    // tornar as tags minusculas
    .replace(/<(\/?[a-zA-Z]*)\b.*?>/g, x => x.toLowerCase())

    return data.xml
}

class Ofx {
    public dadosBanco:any = {}
    public ofxLancamentos:OfxLancamento[] = []
    public dataInicial:Date = new Date()
    public dataFinal:Date = new Date()    
    public conta:any = undefined

    constructor(arquivoOfxString:string, conta:any, objOfx?:Partial<Ofx>) {
        this.conta = conta

        if (!!objOfx) {
            Object.assign(this, objOfx)
        }

        if (typeof arquivoOfxString === "string") {
            const arquivoCompletoJSON = this._parseXML2JSON(arquivoOfxString)
            this._preencheModeloComBaseNoArquivo(arquivoCompletoJSON)
        }

        this._preencheLancamentosComContaPassada()
    }

    static fromFileToJSON(arquivoOfxString:string):any {
        return ofxstr2Json(arquivoOfxString)
    }

    temConta():boolean {
        return !!this.conta
    }

    temLancamentos():boolean {
        return this.ofxLancamentos.length > 0
    }

    private _preencheLancamentosComContaPassada() {
        if (!this.conta) {
            return
        }

        this.ofxLancamentos.forEach((ln) => {
            ln.setConta(this.conta)
        })
    }

    private _parseXML2JSON(arquivoOfxString:string):void {
        return ofxstr2Json(arquivoOfxString)
    }

    private _preencheModeloComBaseNoArquivo(arquivoCompletoJSON:any):void {
        try {
            if (!arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn) {
                throw new Error("Arquivo inválido.")
            }

            let dataIni = arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.dtstart
            let dataFim = arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.dtend
            let lancamentos = []

            this._parseData('dataInicial', dataIni)
            this._parseData('dataFinal', dataFim)

            if (Array.isArray(arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn)) {
                arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.forEach((ln:any) => {
                    const ofxLancamento = new OfxLancamento(ln)
                    ofxLancamento.bankid = arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.bankacctfrom.bankid
                    lancamentos.push(ofxLancamento)
                })
            } else {
                arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.conta = this.conta
                arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.bankid = arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.bankacctfrom.bankid
                lancamentos.push(new OfxLancamento(arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn))
            }

            this.ofxLancamentos = lancamentos
            this.dadosBanco = arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.bankacctfrom
        } catch (e) {
            throw new Error("O arquivo não possui uma estrutura OFX válida")
        }
    }

    private _parseData(campo:keyof Ofx, texto:string):void {
        const data = new Date(texto.substr(0, 4) + "-" + texto.substr(4, 2) + "-" + texto.substr(6, 2))
        this[campo] = new Date(data.getTime() + (data.getTimezoneOffset() * 60 * 1000))
    } 
}

class OfxLancamento {
    public fitid:string = ''
    public name:string = ''
    public trnamt:string = ''
    public data:string|Date|undefined = undefined
    public valor:number|undefined = undefined
    public dtposted:string = ''
    public checknum:string = ''
    public refnum:string = ''
    public memo:string = ''
    public bankid:string = ''
    public conta:any = undefined

    constructor(lancamento:any) {
        Object.assign(this, lancamento)

        this._parseData(!!this.dtposted ? this.dtposted : (this.data as string).split("-").join(""))
        this._parseValorToFloatComDoisDigitos()
        this._normalizaNomeLancamento()
        this._normalizaRefChecknum()
    }

    setConta(c:any):void {
        this.conta = c   
    }

    temConta():boolean {
        return !!this.conta
    }

    _parseData(texto:string):void {
        const data = new Date(texto.substr(0, 4) + "-" + texto.substr(4, 2) + "-" + texto.substr(6, 2))
        this.data = new Date(data.getTime() + (data.getTimezoneOffset() * 60 * 1000))
    }

    _parseValorToFloatComDoisDigitos():void {
        if (!this.valor) {
            let valorStr = this.trnamt
            valorStr = (valorStr.charAt(valorStr.length - 3) === ",") ? valorStr.replace(/\./g, "").replace(",", ".") : valorStr
            this.valor = (Math.round((parseFloat(valorStr) * 100)) / 100)
        }
    }

    _normalizaNomeLancamento():void {
        this.memo = this.memo || this.name
    }

    _normalizaRefChecknum():void {
        this.refnum = this.refnum || this.checknum
        this.checknum = this.checknum || this.refnum
    }
}

export default {
    parseOfx,
    ofxToJSON,
}