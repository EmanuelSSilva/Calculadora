import { app, BrowserWindow, nativeTheme, ipcMain, Menu } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import { type } from 'os';

let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

let janela = null; // Variável para armazenar a janela

function criarJanela() {
  nativeTheme.themeSource = 'light';
  janela = new BrowserWindow({
    width: 800,
    height: 800,
    title: 'Calculadora',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
      setZoomFactor: 1.0 //deixando o zoom em 100%
    }
  });
  janela.removeMenu();
  janela.loadFile(path.join(__dirname, 'index.html'));
  janela.webContents.on('did-finish-load', () => { //evento disparado quando a janela termina de carregar
    janela.webContents.setZoomFactor(1.0);
  });

 // const menu = Menu.buildFromTemplate(template); //criando o menu a partir do template


  Menu.setApplicationMenu(Menu.buildFromTemplate(template)) //definindo o menu da aplicação

  janela.webContents.on('context-menu', () => { Menu.popup({ window: janela }); }); //adicionando o menu de contexto (botão direito do mouse)
}

function criarJanelaSobre() {
  nativeTheme.themeSource = 'light';
  janela = new BrowserWindow({
    width: 400,
    height: 400,
    title: 'criarJanelaSobre',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      devTools: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
      
    }
  });
  janela.removeMenu();
  janela.loadFile(path.join(__dirname, 'Sobre.html'));
    
  
}

const template = [
  {
    label: 'Arquivo',
    submenu: [
      { label: 'Novo', click: () => { criarJanela() } },
      { type: 'separator' },
      { role: 'quit' }]
  }, {
    label: 'Exibir',
    submenu: [
      {
        label: 'Aparencia',
        submenu: [
          { type: 'separator' },
          { role: 'resetzoom' },
          //{accelerator: 'Control+=', role: 'zoomin'},
          { role: 'zoomin' },
          //{accelerator: 'Control-', role: 'zoomout'},
          { role: 'zoomout' },
          { label: 'Tema',
          submenu: [{
            label: 'Mudar Tema', type: 'radio', checked: true, click: () => {
              if (nativeTheme.themeSource === 'dark') {
                nativeTheme.themeSource = 'light'
              } else {
                nativeTheme.themeSource = 'dark'
              }
            }
          }]
        }
        ]
      }]
  }, {
    label: 'Ferramenta',
    submenu: [
      { 
        label: 'Desenvolvedor',
        submenu: [
          { role: 'toggledevtools' }
        ]
      },
    ]
  },{
    label: 'Ajuda',
    submenu: [
      {
          label: 'Sobre',
  click: () => { criarJanelaSobre() 
   
        }
      }
    ]
  }
]

app.whenReady().then(criarJanela);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('mudar-tema', () => { //recebe o evento do renderer para mudar o tema
  if (nativeTheme.themeSource === 'dark') {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
})


ipcMain.on('criar-janela', () => { //recebe o evento do renderer para criar uma nova janela
  criarJanela()
})
let historicoCalculadora = [] //array para armazenar o histórico de operações da calculadora
ipcMain.on('salvar-historico', (event, arg) => { //recebe o evento do renderer para salvar o histórico
  historicoCalculadora.push(arg) //adiciona o novo item ao array
  console.log('mensagem do render', historicoCalculadora)
  event.reply('devolver-msg', historicoCalculadora) //envia o array atualizado de volta para o renderer
})
