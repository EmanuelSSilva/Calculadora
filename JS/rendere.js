const textoanterior = document.querySelector("#anterior"); //mostra a operação anterior
const textoAtual = document.querySelector("#atual");//mostra a operação atual
const buttons = document.querySelectorAll("#buttons-container button");//pega todos os botões

class Calculator {
    constructor(textoanterior, textoAtual) {
        this.textoanterior = textoanterior
        this.textoAtual = textoAtual
        this.operandoAgora = ""    }
    
    //Adicionar dígito na tela da calculadora
    addDigit(digit) {
        //Checar se já existe um ponto decimal se sim não adicionar outro
        if(digit === "." && this.textoAtual.innerText.includes(".")) {
            return
        }
        this.operandoAgora = digit
        this.updateScreen()
    }   
     processOperation(operando) {

        //checar se o valor atual está vazio
        if(this.textoAtual.innerText === "" && operando !== "C") {
            if(this.textoanterior.innerText !== "") {
                this.changeOperation(operando)
            }
            return
        }

        let operacaodovalor
        const anterior = +this.textoanterior.innerText.split(" ")[0]
        const atual = +this.textoAtual.innerText

        switch(operando) {
            case "+":
                operacaodovalor = anterior + atual
                this.updateScreen(operando, operacaodovalor, atual, anterior)
                break
            case "-":
                operacaodovalor = anterior - atual
                this.updateScreen(operando, operacaodovalor, atual, anterior)
                break
            case "/":
                operacaodovalor = anterior / atual
                this.updateScreen(operando, operacaodovalor, atual, anterior)
                break
            case "*":
                operacaodovalor = anterior * atual
                this.updateScreen(operando, operacaodovalor, atual, anterior)
                break
            case "DEL":
                this.deletUltimoNumero()
                break
            case "CE":
                this.limpezaDoVisor()
                break
            case "C":
                this.limpezaDoEtualEAnterior()
                break
            case "=":
                window.api.salvahistorico(`${this.textoanterior.textContent} ${this.textoAtual.textContent}`)
                this.resultaDaOpercao()
                break
                default:
                return
        }
    }

    updateScreen(
        operando = null, 
        resultado = null, 
        atual = null, 
        anterior = null
    ) 
    {
            console.log(operando, resultado, atual, anterior)
            if(resultado === null) {
        this.textoAtual.innerText += this.operandoAgora
    } else {
        //checar se o if é zero
        if (anterior === 0) {
            resultado = atual
        }

        this.textoanterior.innerText = `${resultado} ${operando}`
        this.textoAtual.innerText = ""


}
    }

    changeOperation(operacao) { 
        const mathOperations = ["*", "/", "+", "-"]
        if(!mathOperations.includes(operacao)) {
            return
        }

        this.textoanterior.innerText = this.textoanterior.innerText.slice(0, -1) + operacao
   }


    deletUltimoNumero() {
    this.textoAtual.innerText = this.textoAtual.innerText.slice(0, -1)
     }
     //limpeza do visor
     limpezaDoVisor(){
        this.textoAtual.innerText = ""
     }
    //LImpeza de todo visor
     limpezaDoEtualEAnterior(){
        this.textoAtual.innerText = ""
        this.textoanterior.innerText = ""
     }

     //resultado da operação
     resultaDaOpercao() {
        let operacao = this.textoanterior.innerText.split(" ")[1]
        this.processOperation(operacao)
        return 
    
}
    criarJanela() {
        window.api.criarJanela()
}

}

    

const calc = new Calculator (textoanterior, textoAtual)

buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const value = e.target.innerText
        console.log(value)
            
            if(+value >= 0 || value === ".") {
                calc.addDigit(value)
            }else {
                calc.processOperation(value)
            }
    })
})


document.getElementById('historico').addEventListener('click', () => { 
    window.api.receberMsg((event, arg) => { document.getElementById('msg').innerHTML = `${arg} <br>`})
})