import {contextBridge, ipcRenderer} from 'electron'

contextBridge.exposeInMainWorld('api', {
    nome: 'Aplicação Desktop',
    versaoNode: () => { return `NODE - ${process.versions.node}`},
    versaoElectron: () => { return `ELECTRON - ${process.versions.electron}`},
    
     criarJanela: () => { ipcRenderer.send('criar-janela') },
     enviarMsg: (msg) => ipcRenderer.send('envia-msg',msg),
     receberMsg: (msg) => ipcRenderer.on('devolver-msg', msg),
     salvahistorico: (arg) => ipcRenderer.send('salvar-historico', arg)

   
})
