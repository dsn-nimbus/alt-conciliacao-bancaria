var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};!function(factory){if("object"==typeof module&&"object"==typeof module.exports){var v=factory(require,exports);void 0!==v&&(module.exports=v)}else"function"==typeof define&&define.amd&&define(["require","exports","pixl-xml"],factory)}(function(require,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var pixl_xml_1=__importDefault(require("pixl-xml")),CODIGO_CHAR_ANSI=65533,ENCODE_WINDOW_1252="windows-1252";function ofxstr2Json(ofxStr){if(!ofxStr||0===ofxStr.length)throw new Error("O arquivo não possui uma estrutura OFX válida");return pixl_xml_1.default.parse(function(ofxStr){var data={},ofxRes=ofxStr.split("<OFX>",2),ofx="<OFX>"+ofxRes[1];return data.headerString=ofxRes[0].split(/\r|\n/),data.xml=ofx.replace(/>\s+</g,"><").replace(/\s+</g,"<").replace(/>\s+/g,">").replace(/<([A-Z0-9_]*)+\.+([A-Z0-9_]*)>([^<]+)(<\/\1\.\2>)?/g,"<$1$2>$3").replace(/<(\w+?)>([^<]+)/g,"<$1>$2</<added>$1>").replace(/<\/<added>(\w+?)>(<\/\1>)?/g,"</$1>").replace(/<(\/?[a-zA-Z]*)\b.*?>/g,function(x){return x.toLowerCase()}),data.xml}(ofxStr))}var Ofx=function(){function Ofx(arquivoOfxString,conta,objOfx){if(this.dadosBanco={},this.ofxLancamentos=[],this.dataInicial=new Date,this.dataFinal=new Date,this.conta=void 0,this.conta=conta,objOfx&&Object.assign(this,objOfx),"string"==typeof arquivoOfxString){var arquivoCompletoJSON=this._parseXML2JSON(arquivoOfxString);this._preencheModeloComBaseNoArquivo(arquivoCompletoJSON)}this._preencheLancamentosComContaPassada()}return Ofx.fromFileToJSON=function(arquivoOfxString){return ofxstr2Json(arquivoOfxString)},Ofx.prototype.temConta=function(){return!!this.conta},Ofx.prototype.temLancamentos=function(){return 0<this.ofxLancamentos.length},Ofx.prototype._preencheLancamentosComContaPassada=function(){var _this=this;this.conta&&this.ofxLancamentos.forEach(function(ln){ln.setConta(_this.conta)})},Ofx.prototype._parseXML2JSON=function(arquivoOfxString){return ofxstr2Json(arquivoOfxString)},Ofx.prototype._preencheModeloComBaseNoArquivo=function(arquivoCompletoJSON){try{if(!arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn)throw new Error("Arquivo inválido.");var dataIni=arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.dtstart,dataFim=arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.dtend,lancamentos=[];this._parseData("dataInicial",dataIni),this._parseData("dataFinal",dataFim),Array.isArray(arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn)?arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.forEach(function(ln){var ofxLancamento=new OfxLancamento(ln);ofxLancamento.bankid=arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.bankacctfrom.bankid,lancamentos.push(ofxLancamento)}):(arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.conta=this.conta,arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.bankid=arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.bankacctfrom.bankid,lancamentos.push(new OfxLancamento(arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn))),this.ofxLancamentos=lancamentos,this.dadosBanco=arquivoCompletoJSON.ofx.bankmsgsrsv1.stmttrnrs.stmtrs.bankacctfrom}catch(e){throw new Error("O arquivo não possui uma estrutura OFX válida")}},Ofx.prototype._parseData=function(campo,texto){var data=new Date(texto.substr(0,4)+"-"+texto.substr(4,2)+"-"+texto.substr(6,2));this[campo]=new Date(data.getTime()+60*data.getTimezoneOffset()*1e3)},Ofx}(),OfxLancamento=function(){function OfxLancamento(lancamento){this.fitid="",this.name="",this.trnamt="",this.data=void 0,this.valor=void 0,this.dtposted="",this.checknum="",this.refnum="",this.memo="",this.bankid="",this.conta=void 0,Object.assign(this,lancamento),this._parseData(this.dtposted?this.dtposted:this.data.split("-").join("")),this._parseValorToFloatComDoisDigitos(),this._normalizaNomeLancamento(),this._normalizaRefChecknum()}return OfxLancamento.prototype.setConta=function(c){this.conta=c},OfxLancamento.prototype.temConta=function(){return!!this.conta},OfxLancamento.prototype._parseData=function(texto){var data=new Date(texto.substr(0,4)+"-"+texto.substr(4,2)+"-"+texto.substr(6,2));this.data=new Date(data.getTime()+60*data.getTimezoneOffset()*1e3)},OfxLancamento.prototype._parseValorToFloatComDoisDigitos=function(){if(!this.valor){var valorStr=this.trnamt;valorStr=","===valorStr.charAt(valorStr.length-3)?valorStr.replace(/\./g,"").replace(",","."):valorStr,this.valor=Math.round(100*parseFloat(valorStr))/100}},OfxLancamento.prototype._normalizaNomeLancamento=function(){this.memo=this.memo||this.name},OfxLancamento.prototype._normalizaRefChecknum=function(){this.refnum=this.refnum||this.checknum,this.checknum=this.checknum||this.refnum},OfxLancamento}();exports.default={parseOfx:function parseOfx(arquivoOfx,conta,encode){return new Promise(function(resolve,reject){if(!arquivoOfx)return reject("Arquivo não informado.");var fileReader=new FileReader;fileReader.onload=function(event){var target=event.target;if(void 0===encode)for(var i in target.result)target.result.charCodeAt(i)==CODIGO_CHAR_ANSI&&parseOfx(arquivoOfx,conta,ENCODE_WINDOW_1252);try{return resolve(new Ofx(target.result,conta))}catch(e){return reject(e)}},fileReader.readAsText(arquivoOfx,encode),encode=void 0})},ofxToJSON:function ofxToJSON(arquivoOfx,encode){return new Promise(function(resolve,reject){if(!arquivoOfx)return reject("Arquivo não informado.");var fileReader=new FileReader;fileReader.onload=function(event){var target=event.target;if(void 0===encode)for(var i in target.result)target.result.charCodeAt(i)==CODIGO_CHAR_ANSI&&ofxToJSON(arquivoOfx,ENCODE_WINDOW_1252);try{return resolve(Ofx.fromFileToJSON(target.result))}catch(e){return reject(e)}},fileReader.readAsText(arquivoOfx,encode),encode=void 0})}}});