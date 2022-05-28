//Externos
const chalk = require('chalk')
const inquirer = require('inquirer')

//Internos
const fs = require('fs')
const { parse } = require('path')

operation()

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: [
                'Criar Conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair',
            ],
        },
        
    ])
    .then((answer) => {

        const action = answer['action']

        if(action === 'Criar Conta') {
            createAccount()
        } else if(action === 'Depositar') {
            deposit()
        } else if(action === 'Consultar Saldo') {

        } else if(action === 'Sacar') {

        } else if (action === 'Sair') {
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
            process.exit()
        }

    })
    .catch((err) => console.log(err))
}

//Create an Account
function createAccount() {
    console.log(chalk.bgGreen.black('Seja Bem vindo(a) ao Banco Account!!'))
    console.log(chalk.green('Defina a opção de sua conta a seguir'))

    buildAccount()
}

function buildAccount() {

    inquirer.prompt([
    {
        name: 'accountName',
        message: 'Digite um nome para sua conta: '
    },
]).then(answer => {
    const accountName = answer['accountName']

    console.info(accountName)

    if(!fs.existsSync('accounts')) {
        fs.mkdirSync('accounts')
    }

    if(fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta ja existe, escolha outro nome!'))
        buildAccount()
        return
    }

    fs.writeFileSync(`accounts/${accountName}.json`,
     '{"balance": 0}',
     function(err) {
         console.log(err)
     },
    )

    console.log(clalk.bgGreen.black('Parabens, sua conta foi criada com sucesso!!'))

    operation()

}).catch(err => console.log(err))

}

// add an amount to user account
function deposit() {

    inquirer.prompt([
    {
        name: 'accountName',
        message: 'Qual o nome da sua conta? '
    },
]).then((answer) => {

    const accountName = answer['accountName']

//check account
    if(!checkAccount(accountName)) {
        return deposit()
    }

    inquirer.prompt([
        {
            name: 'amount',
            message: 'Quanto você quer depositar? '
        },
    ]).then((answer) => {
        const amount = answer['amount']

        //add amount
        addAmount(accountName, amount)
        operation()
    }).catch(err => console.log(err))

}).catch(err => console.log(err))
}

// verify account
function checkAccount(accountName) {

    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outra conta ou crie uma nova!'))
        return false
    }

    return true
}

function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro tente novamente mais tarde!'))
    }
    
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi depositado R$ ${amount} na sua conta do Banco Account!`))
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
}