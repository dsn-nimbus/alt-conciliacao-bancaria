import xmlParser from 'pixl-xml'

function parseOfx(arquivoOfx:File, conta?:any, encode?:string):Promise<Ofx> {
    return new Promise((resolve, reject) => {
        if (!arquivoOfx) {
            return reject('Arquivo não informado.')
        }

        var fileReader = new FileReader()
        fileReader.onload = function(event:Event) {
            let target:any = event.target // TS hack

            // Charsets suportados: UTF-8 e ANSI
            if (encode === undefined) {
                for (var i in target.result) {
                    // Caso o código seja este, 
                    // faz o parse do arquivo de forma diferente:
                    // utilizando windows-1252
                    if (target.result.charCodeAt(i) == 65533) {
                        parseOfx(arquivoOfx, conta, 'windows-1252')
                    }
                }
            }
            
            return resolve(new Ofx(target.result, conta))
        }

        fileReader.readAsText(arquivoOfx, encode)
        encode = undefined
    })
}

class Ofx {
    public dadosBanco:any = {}
    public ofxLancamentos:OfxLancamento[] = []
    public dataInicial:Date = new Date()
    public dataFinal:Date = new Date()    
    public conta:any = undefined
    public arquivoCompletoJSON:any = {}

    constructor(arquivoOfxString:string, conta:any, objOfx?:Partial<Ofx>) {
        this.conta = conta

        if (!!objOfx) {
            Object.assign(this, objOfx)
        }

        if (typeof arquivoOfxString === "string") {
            this._parseXML2JSON(arquivoOfxString)
            this._preencheModeloComBaseNoArquivo()
        }

        this._preencheLancamentosComContaPassada()
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

    private _parseXML2JSON(arquivoStr:string):void {
        if (!arquivoStr || arquivoStr.length === 0) {
            throw new Error("O arquivo não possui uma estrutura OFX válida")
        }

        this.arquivoCompletoJSON = xmlParser.parse(this._normalizarArquivo(arquivoStr).xml)
    }

    private _preencheModeloComBaseNoArquivo():void {
        try {
            if (!this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn) {
                throw new Error("Arquivo inválido.")
            }

            var dataIni = this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.dtstart
            var dataFim = this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.dtend
            var lancamentos = []

            this._parseData('dataInicial', dataIni)
            this._parseData('dataFinal', dataFim)

            if (Array.isArray(this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn)) {
                this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.forEach((ln:any) => {
                    var ofxLancamento = new OfxLancamento(ln)
                    ofxLancamento.bankid = this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.bankacctfrom.bankid
                    lancamentos.push(ofxLancamento)
                })
            } else {
                this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.conta = this.conta
                this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.bankid = this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.bankacctfrom.bankid
                lancamentos.push(new OfxLancamento(this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn))
            }

            this.ofxLancamentos = lancamentos
            this.dadosBanco = this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.bankacctfrom
        } catch (e) {
            throw new Error("O arquivo não possui uma estrutura OFX válida")
        }
    }

    private _parseData(campo:keyof Ofx, texto:string):void {
        var data = new Date(texto.substr(0, 4) + "-" + texto.substr(4, 2) + "-" + texto.substr(6, 2))
        this[campo] = new Date(data.getTime() + (data.getTimezoneOffset() * 60 * 1000))
    }

    private _normalizarArquivo(ofxStr:string):any {
        var data:{[key:string]:any} = {}
        var ofxRes = ofxStr.split('<OFX>', 2)
        var ofx = '<OFX>' + ofxRes[1]

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

        return data
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
        let data = new Date(texto.substr(0, 4) + "-" + texto.substr(4, 2) + "-" + texto.substr(6, 2))
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
}