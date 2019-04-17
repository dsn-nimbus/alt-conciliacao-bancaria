const expect = require('expect')
const fs = require('fs')
const {parseOfx, ofxToJSON} = require('../src/index')

const PATH_OFX_UTF8_BASE = __dirname + '/__arquivos_ofx__/utf8-base.ofx'
const PATH_OFX_UTF8_DIFERENTES_VALORES = __dirname + '/__arquivos_ofx__/utf8-diferentes-valores.ofx'
const PATH_OFX_UTF8_PEQUENO = __dirname + '/__arquivos_ofx__/utf8-pequeno.ofx'

describe('alt-conciliacao-bancaria', () => {
    describe('parseOfx', () => {
        describe('utf8-base', () => {
            it('deve resolver o conteúdo do arquivo retornando uma instância de Ofx - sem opções', async () => {
                const arquivo = {}
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_BASE)

                try {
                    const ofx = await parseOfx(arquivo, fileReader)
                    expect(ofx).toBeDefined()
                    expect(typeof ofx).toBe('object')
                    expect(ofx.dadosBanco).toBeDefined()
                    expect(ofx.ofxLancamentos.length).toBe(97)
                    expect(ofx.dataInicial).toBeInstanceOf(Date)
                    expect(ofx.dataFinal).toBeInstanceOf(Date)
                } catch (e) {
                    throw e
                }
            })
        })        

        describe('utf8-pequeno', () => {
            it('deve resolver o conteúdo do arquivo retornando uma instância de Ofx - sem opções', async () => {
                const arquivo = {}
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_PEQUENO)

                try {
                    const ofx = await parseOfx(arquivo, fileReader)
                    expect(ofx).toBeDefined()
                    expect(typeof ofx).toBe('object')
                    expect(ofx.dadosBanco).toBeDefined()
                    expect(ofx.ofxLancamentos.length).toBe(1)
                    expect(ofx.dataInicial).toBeInstanceOf(Date)
                    expect(ofx.dataFinal).toBeInstanceOf(Date)
                } catch (e) {
                    throw e
                }
            })
        })        

        describe('utf8-diferentes-valores', () => {
            it('deve resolver o conteúdo do arquivo retornando uma instância de Ofx - sem opções', async () => {
                const arquivo = {}
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_DIFERENTES_VALORES)

                try {
                    const ofx = await parseOfx(arquivo, fileReader)
                    expect(ofx).toBeDefined()
                    expect(typeof ofx).toBe('object')
                    expect(ofx.dadosBanco).toBeDefined()
                    expect(ofx.ofxLancamentos.length).toBe(97)
                    expect(ofx.dataInicial).toBeInstanceOf(Date)
                    expect(ofx.dataFinal).toBeInstanceOf(Date)
                } catch (e) {
                    throw e
                }
            })
        })        
    })

    describe('ofxToJSON', () => {
        describe('utf8-base', () => {
            it('deve resolver o conteúdo do arquivo retornando um OfxJSON - sem opções', async () => {
                const arquivo = {}
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_BASE)

                try {
                    const ofxJSON = await ofxToJSON(arquivo, fileReader)
                    expect(ofxJSON).toBeDefined()
                    expect(typeof ofxJSON).toBe('object')
                    expect(ofxJSON.signonmsgsrsv1).toBeDefined()
                    expect(typeof ofxJSON.signonmsgsrsv1).toBe('object')
                    expect(ofxJSON.bankmsgsrsv1).toBeDefined()
                    expect(typeof ofxJSON.bankmsgsrsv1).toBe('object')
                    expect(ofxJSON.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn).toBeDefined()
                    expect(ofxJSON.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.length).toBe(97)
                } catch (e) {
                    throw e
                }
            })
        })

        describe('utf8-pequeno', () => {
            it('deve resolver o conteúdo do arquivo retornando um OfxJSON - sem opções', async () => {
                const arquivo = {}
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_PEQUENO)

                try {
                    const ofxJSON = await ofxToJSON(arquivo, fileReader)
                    expect(ofxJSON).toBeDefined()
                    expect(typeof ofxJSON).toBe('object')
                    expect(ofxJSON.signonmsgsrsv1).toBeDefined()
                    expect(typeof ofxJSON.signonmsgsrsv1).toBe('object')
                    expect(ofxJSON.bankmsgsrsv1).toBeDefined()
                    expect(typeof ofxJSON.bankmsgsrsv1).toBe('object')
                    expect(ofxJSON.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn).toBeDefined()
                    expect(typeof ofxJSON.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn).toBe('object')
                    expect(ofxJSON.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.length).toBe(undefined)
                } catch (e) {
                    throw e
                }
            })
        })

        describe('utf8-diferentes-valores', () => {
            it('deve resolver o conteúdo do arquivo retornando um OfxJSON - sem opções', async () => {
                const arquivo = {}
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_BASE)

                try {
                    const ofxJSON = await ofxToJSON(arquivo, fileReader)
                    expect(ofxJSON).toBeDefined()
                    expect(typeof ofxJSON).toBe('object')
                    expect(ofxJSON.signonmsgsrsv1).toBeDefined()
                    expect(typeof ofxJSON.signonmsgsrsv1).toBe('object')
                    expect(ofxJSON.bankmsgsrsv1).toBeDefined()
                    expect(typeof ofxJSON.bankmsgsrsv1).toBe('object')
                    expect(ofxJSON.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn).toBeDefined()
                    expect(ofxJSON.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.length).toBe(97)
                } catch (e) {
                    throw e
                }
            })
        })
    })
})

function criaOfxFileReader(caminho) {
    return {
        readAsText(arquivo, encode) {
            this.onload({
                target: {
                    result: fs.readFileSync(caminho).toString(),
                },
            })
        },
        onload(evento) {
            return Promise.resolve(evento.target.result)
        }
    }
}
