const expect = require('expect')
const fs = require('fs')
const {parseOfx, ofxToJSON} = require('../src/index')

const PATH_OFX_UTF8_BASE = __dirname + '/__arquivos_ofx__/utf8-base.ofx'
const PATH_OFX_UTF8_DIFERENTES_VALORES = __dirname + '/__arquivos_ofx__/utf8-diferentes-valores.ofx'
const PATH_OFX_UTF8_PEQUENO = __dirname + '/__arquivos_ofx__/utf8-pequeno.ofx'

describe('alt-conciliacao-bancaria', () => {
    describe('parseOfx', () => {
        describe('utf8-base', () => {
            it('deve rejeitar o parse, arquivo não informado', async () => {
                const arquivo = undefined
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_BASE)

                try {
                    await parseOfx(arquivo, fileReader)
                    expect(false).toBe(true)
                } catch(e) {
                    expect(e.message).toEqual('Arquivo não informado.')
                }
            })

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
                    expect(ofx.conta).toBeUndefined()
                } catch (e) {
                    throw e
                }
            })
        })        

        describe('utf8-pequeno', () => {
            it('deve rejeitar o parse, arquivo não informado', async () => {
                const arquivo = undefined
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_DIFERENTES_VALORES)

                try {
                    await parseOfx(arquivo, fileReader)
                    expect(false).toBe(true)
                } catch(e) {
                    expect(e.message).toEqual('Arquivo não informado.')
                }
            })

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
                    expect(ofx.conta).toBeUndefined()
                } catch (e) {
                    throw e
                }
            })
        })        

        describe('utf8-diferentes-valores', () => {
            it('deve rejeitar o parse, arquivo não informado', async () => {
                const arquivo = undefined
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_DIFERENTES_VALORES)

                try {
                    await parseOfx(arquivo, fileReader)
                    expect(false).toBe(true)
                } catch(e) {
                    expect(e.message).toEqual('Arquivo não informado.')
                }
            })

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
                    expect(ofx.conta).toBeUndefined()
                } catch (e) {
                    throw e
                }
            })
        })        
    })

    describe('ofxToJSON', () => {
        describe('utf8-base', () => {
           it('deve rejeitar o parse, arquivo não informado', async () => {
                const arquivo = undefined
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_BASE)

                try {
                    await ofxToJSON(arquivo, fileReader)
                    expect(false).toBe(true)
                } catch(e) {
                    expect(e.message).toEqual('Arquivo não informado.')
                }
            }) 

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
                    expect(typeof ofxJSON.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn).toBe('object')
                    expect(ofxJSON.bankmsgsrsv1.stmttrnrs.stmtrs.banktranlist.stmttrn.length).toBe(97)
                } catch (e) {
                    throw e
                }
            })
        })

        describe('utf8-pequeno', () => {
            it('deve rejeitar o parse, arquivo não informado', async () => {
                const arquivo = undefined
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_PEQUENO)

                try {
                    await ofxToJSON(arquivo, fileReader)
                    expect(false).toBe(true)
                } catch(e) {
                    expect(e.message).toEqual('Arquivo não informado.')
                }
            })

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
            it('deve rejeitar o parse, arquivo não informado', async () => {
                const arquivo = undefined
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_DIFERENTES_VALORES)

                try {
                    await parseOfx(arquivo, fileReader)
                    expect(false).toBe(true)
                } catch(e) {
                    expect(e.message).toEqual('Arquivo não informado.')
                }
            }) 

            it('deve resolver o conteúdo do arquivo retornando um OfxJSON - sem opções', async () => {
                const arquivo = {}
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_DIFERENTES_VALORES)

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
