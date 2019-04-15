(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function parseOfx(arquivoOfx, conta, encode) {
        return new Promise(function (resolve, reject) {
            if (!arquivoOfx) {
                return reject('Arquivo não informado.');
            }
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                var target = event.target; // TS hack
                // Charsets suportados: UTF-8 e ANSI
                if (encode === undefined) {
                    for (var i in target.result) {
                        // Caso o código seja este, 
                        // faz o parse do arquivo de forma diferente:
                        // utilizando windows-1252
                        if (target.result.charCodeAt(i) == 65533) {
                            parseOfx(arquivoOfx, conta, 'windows-1252');
                        }
                    }
                }
                return resolve(new Ofx(target.result, conta));
            };
            fileReader.readAsText(arquivoOfx, encode);
            encode = undefined;
        });
    }
    var Ofx = /** @class */ (function () {
        function Ofx(arquivoOfxString, conta, objOfx) {
            this.dadosBanco = {};
            this.ofxLancamentos = [];
            this.dataInicial = new Date();
            this.dataFinal = new Date();
            this.conta = undefined;
            this.arquivoCompletoJSON = {};
            this.conta = conta;
            if (!!objOfx) {
                Object.assign(this, objOfx);
            }
            if (typeof (arquivoOfxString) === "string") {
                this._fileToOfx(arquivoOfxString);
            }
            this._preencheLancamentosComContaPassada();
        }
        Ofx.prototype.temConta = function () {
            return !!this.conta;
        };
        Ofx.prototype.temLancamentos = function () {
            return this.ofxLancamentos.length > 0;
        };
        Ofx.prototype._preencheLancamentosComContaPassada = function () {
            var _this = this;
            if (!this.conta) {
                return;
            }
            this.ofxLancamentos.forEach(function (ln) {
                ln.setConta(_this.conta);
            });
        };
        Ofx.prototype._fileToOfx = function (arquivoStr) {
            var _this = this;
            if (!arquivoStr || arquivoStr.length === 0) {
                throw new Error("O arquivo não possui uma estrutura OFX válida");
            }
            // "abdmob/x2js": "^1.2.0",
            this.arquivoCompletoJSON = new X2JS().xml_str2json(this._normalizarArquivo(arquivoStr).xml);
            try {
                if (!this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn) {
                    throw new Error("Arquivo inválido.");
                }
                var dataIni = this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.dtstart;
                var dataFim = this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.dtend;
                var lancamentos = [];
                this._parseData('dataInicial', dataIni);
                this._parseData('dataFinal', dataFim);
                if (Array.isArray(this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn)) {
                    this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.forEach(function (ln) {
                        var ofxLancamento = new OfxLancamento(ln);
                        ofxLancamento.bankid = _this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.bankacctfrom.bankid;
                        lancamentos.push(ofxLancamento);
                    });
                }
                else {
                    //TODO (eric.dsn.shop) O ERP4ME precisa desta atribuição, outros sistemas talvez não precisem
                    this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.conta = this.conta;
                    this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.bankid = this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.bankacctfrom.bankid;
                    lancamentos.push(new OfxLancamento(this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn));
                }
                this.ofxLancamentos = lancamentos;
                this.dadosBanco = this.arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.bankacctfrom;
            }
            catch (e) {
                throw new Error("O arquivo não possui uma estrutura OFX válida");
            }
        };
        Ofx.prototype._parseData = function (campo, texto) {
            var data = new Date(texto.substr(0, 4) + "-" + texto.substr(4, 2) + "-" + texto.substr(6, 2));
            this[campo] = new Date(data.getTime() + (data.getTimezoneOffset() * 60 * 1000));
        };
        Ofx.prototype._normalizarArquivo = function (ofxStr) {
            var data = {};
            var ofxRes = ofxStr.split('<OFX>', 2);
            var ofx = '<OFX>' + ofxRes[1];
            data.headerString = ofxRes[0].split(/\r|\n/);
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
                .replace(/<(\/?[a-zA-Z]*)\b.*?>/g, function (x) { return x.toLowerCase(); });
            return data;
        };
        return Ofx;
    }());
    var OfxLancamento = /** @class */ (function () {
        function OfxLancamento(lancamento) {
            this.fitid = '';
            this.name = '';
            this.trnamt = '';
            this.data = undefined;
            this.valor = undefined;
            this.dtposted = '';
            this.checknum = '';
            this.refnum = '';
            this.memo = '';
            this.bankid = '';
            this.conta = undefined;
            Object.assign(this, lancamento);
            this._parseData(!!this.dtposted ? this.dtposted : this.data.split("-").join(""));
            this._parseValorToFloatComDoisDigitos();
            this._normalizaNomeLancamento();
            this._normalizaRefChecknum();
        }
        OfxLancamento.prototype.setConta = function (c) {
            this.conta = c;
        };
        OfxLancamento.prototype.temConta = function () {
            return !!this.conta;
        };
        OfxLancamento.prototype._parseData = function (texto) {
            var data = new Date(texto.substr(0, 4) + "-" + texto.substr(4, 2) + "-" + texto.substr(6, 2));
            this.data = new Date(data.getTime() + (data.getTimezoneOffset() * 60 * 1000));
        };
        OfxLancamento.prototype._parseValorToFloatComDoisDigitos = function () {
            if (!this.valor) {
                var valorStr = this.trnamt;
                valorStr = (valorStr.charAt(valorStr.length - 3) === ",") ? valorStr.replace(/\./g, "").replace(",", ".") : valorStr;
                this.valor = (Math.round((parseFloat(valorStr) * 100)) / 100);
            }
        };
        OfxLancamento.prototype._normalizaNomeLancamento = function () {
            this.memo = this.memo || this.name;
        };
        OfxLancamento.prototype._normalizaRefChecknum = function () {
            this.refnum = this.refnum || this.checknum;
            this.checknum = this.checknum || this.refnum;
        };
        return OfxLancamento;
    }());
    exports.default = {
        parseOfx: parseOfx,
    };
});
