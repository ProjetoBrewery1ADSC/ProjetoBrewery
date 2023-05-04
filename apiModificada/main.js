// não altere!
const serialport = require('serialport');
const express = require('express');
const mysql = require('mysql2');
const sql = require('mssql');

// não altere!
const SERIAL_BAUD_RATE = 9600;
const SERVIDOR_PORTA = 3300;

// configure a linha abaixo caso queira que os dados capturados sejam inseridos no banco de dados.
// false -> nao insere
// true -> insere
const HABILITAR_OPERACAO_INSERIR = true;

// altere o valor da variável AMBIENTE para o valor desejado:
// API conectada ao banco de dados remoto, SQL Server -> 'producao'
// API conectada ao banco de dados local, MySQL Workbench - 'desenvolvimento'
const AMBIENTE = 'desenvolvimento';

const serial = async (
    valorTempMaceracao,
        valorTempMalteacao1,
        valorTempMalteacao2,
        valorTempMalteacao3,
        valorTempMoagem,
        valorTempBrassagem1,
        valorTempBrassagem2,
        valorTempBrassagem3,
        valorTempFervura,
        valorTempResfriamento1, 
        valorTempResfriamento2, 
        valorTempResfriamento3, 
        valorTempFiltragem, 
        valorTempPasteurizacao, 
        valorTempTunelPast, 
    
) => {
    let poolBancoDados = ''

    if (AMBIENTE == 'desenvolvimento') {
        poolBancoDados = mysql.createPool(
            {
                // altere!
                // CREDENCIAIS DO BANCO LOCAL - MYSQL WORKBENCH
                host: 'localhost',
                user: 'evelyn',
                password: 'sptech',
                database: 'Brewery'
            }
        ).promise();
    } else if (AMBIENTE == 'producao') {
        console.log('Projeto rodando inserindo dados em nuvem. Configure as credenciais abaixo.');
    } else {
        throw new Error('Ambiente não configurado. Verifique o arquivo "main.js" e tente novamente.');
    }


    const portas = await serialport.SerialPort.list();
    const portaArduino = portas.find((porta) => porta.vendorId == 2341 && porta.productId == 43);
    if (!portaArduino) {
        throw new Error('O arduino não foi encontrado em nenhuma porta serial');
    }
    const arduino = new serialport.SerialPort(
        {
            path: portaArduino.path,
            baudRate: SERIAL_BAUD_RATE
        }
    );
    arduino.on('open', () => {
        console.log(`A leitura do arduino foi iniciada na porta ${portaArduino.path} utilizando Baud Rate de ${SERIAL_BAUD_RATE}`);
    });
    arduino.pipe(new serialport.ReadlineParser({ delimiter: '\r\n' })).on('data', async (data) => {
        //console.log(data);
        const valores = data.split(';');

        const  valor_temperatura_maceracao = parseFloat(valores[0]);

        const  valor_temperatura_malteacao1 = parseFloat(valores[1]);
        const  valor_temperatura_malteacao2 = parseFloat(valores[2]);
        const  valor_temperatura_malteacao3 = parseFloat(valores[3]);

        const  valor_temperatura_moagem = parseFloat(valores[4]);

        const  valor_temperatura_brassagem1 = parseFloat(valores[5]);
        const  valor_temperatura_brassagem2 = parseFloat(valores[6]);
        const  valor_temperatura_brassagem3 = parseFloat(valores[7]);

        const  valor_temperatura_fervura = parseFloat(valores[8]);

        const  valor_temperatura_resfriamento1 = parseFloat(valores[9]);
        const  valor_temperatura_resfriamento2 = parseFloat(valores[10]);
        const  valor_temperatura_resfriamento3 = parseFloat(valores[11]);

        const  valor_temperatura_filtragem= parseFloat(valores[12]);
        const  valor_temperatura_pasteurizacao_rapida = parseFloat(valores[13]);
        const  valor_temperatura_tunel_pasteurizacao = parseFloat(valores[14]);


        valorTempMaceracao.push(valor_temperatura_maceracao);

        valorTempMalteacao1.push(valor_temperatura_malteacao1);
        valorTempMalteacao2.push(valor_temperatura_malteacao2);
        valorTempMalteacao3.push(valor_temperatura_malteacao3);

        valorTempMoagem.push(valor_temperatura_moagem);

        valorTempBrassagem1.push(valor_temperatura_brassagem1);
        valorTempBrassagem2.push(valor_temperatura_brassagem2);
        valorTempBrassagem3.push(valor_temperatura_brassagem3);

        valorTempFervura.push(valor_temperatura_fervura);

        valorTempResfriamento1.push(valor_temperatura_resfriamento1);
        valorTempResfriamento2.push(valor_temperatura_resfriamento2);
        valorTempResfriamento3.push(valor_temperatura_resfriamento3);

        valorTempFiltragem.push(valor_temperatura_filtragem);
        valorTempPasteurizacao.push(valor_temperatura_pasteurizacao_rapida);
        valorTempTunelPast.push(valor_temperatura_tunel_pasteurizacao);
        

        if (HABILITAR_OPERACAO_INSERIR) {
            if (AMBIENTE == 'producao') {
                // altere!
                // Este insert irá inserir os dados na tabela "medida"
                // -> altere nome da tabela e colunas se necessário
                // Este insert irá inserir dados de fk_aquario id=1 (fixo no comando do insert abaixo)
                // >> Importante! você deve ter o aquario de id 1 cadastrado.
                sqlquery = `INSERT INTO captura (temp) VALUES (${lm35Temperatura})`;

                // CREDENCIAIS DO BANCO REMOTO - SQL SERVER
                // Importante! você deve ter criado o usuário abaixo com os comandos presentes no arquivo
                // "script-criacao-usuario-sqlserver.sql", presente neste diretório.
                const connStr = "Server=servidor-acquatec.database.windows.net;Database=bd-acquatec;User Id=usuarioParaAPIArduino_datawriter;Password=#Gf_senhaParaAPI;";

                function inserirComando(conn, sqlquery) {
                    conn.query(sqlquery);
                    console.log("valores inseridos no banco: " + ", " + lm35Temperatura)
                }

                sql.connect(connStr)
                    .then(conn => inserirComando(conn, sqlquery))
                    .catch(err => console.log("erro! " + err));

            } else if (AMBIENTE == 'desenvolvimento') {

                // altere!
                // Este insert irá inserir os dados na tabela "medida"
                // -> altere nome da tabela e colunas se necessário
                // Este insert irá inserir dados de fk_aquario id=1 (fixo no comando do insert abaixo)
                // >> você deve ter o aquario de id 1 cadastrado.
                await poolBancoDados.execute(
                    'INSERT INTO captura (temperatura,fkProcesso) VALUES ( (?, 1), (?, 2), (?, 3), (?, 4), (?, 5), (?, 6), (?, 7), (?, 8), (?, 9), (?, 10), (?, 11), (?, 12), (?, 13), (?, 14), (?, 15))',

                    [valor_temperatura_maceracao, 
                        valor_temperatura_malteacao1, valor_temperatura_malteacao2, valor_temperatura_malteacao3,valor_temperatura_moagem, 
                        valor_temperatura_brassagem1,  valor_temperatura_brassagem2,  valor_temperatura_brassagem3, 
                        valor_temperatura_fervura, 
                        valor_temperatura_resfriamento1, valor_temperatura_resfriamento2,valor_temperatura_resfriamento3, 
                        valor_temperatura_filtragem, valor_temperatura_pasteurizacao_rapida,valor_temperatura_tunel_pasteurizacao]
                );
                console.log("valores inseridos no banco: " + ", " + valor_temperatura_maceracao+ ", "+ 
                valor_temperatura_malteacao1+ ", "+ valor_temperatura_malteacao2+ ", "+ valor_temperatura_malteacao3+ ", "+valor_temperatura_moagem+ ", "+ 
                valor_temperatura_brassagem1+ ", "+  valor_temperatura_brassagem2+ ", "+  valor_temperatura_brassagem3+ ", "+ 
                valor_temperatura_fervura+ ", "+ 
                valor_temperatura_resfriamento1+ ", "+ valor_temperatura_resfriamento2+ ", "+valor_temperatura_resfriamento3+ ", "+ 
                valor_temperatura_filtragem+ ", "+ valor_temperatura_pasteurizacao_rapida+ ", "+valor_temperatura_tunel_pasteurizacao)

            } else {
                throw new Error('Ambiente não configurado. Verifique o arquivo "main.js" e tente novamente.');
            }
        }
    });
    arduino.on('error', (mensagem) => {
        console.error(`Erro no arduino (Mensagem: ${mensagem}`)
    });
}


// não altere!
const servidor = (
    valorTempMaceracao,
    valorTempMalteacao1,
    valorTempMalteacao2,
    valorTempMalteacao3,
    valorTempMoagem,
    valorTempBrassagem1,
    valorTempBrassagem2,
    valorTempBrassagem3,
    valorTempFervura,
    valorTempResfriamento1, 
    valorTempResfriamento2, 
    valorTempResfriamento3, 
    valorTempFiltragem, 
    valorTempPasteurizacao, 
    valorTempTunelPast,

) => {
    const app = express();
    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        next();
    });
    app.listen(SERVIDOR_PORTA, () => {
        console.log(`API executada com sucesso na porta ${SERVIDOR_PORTA}`);
    });

}

(async () => {
       
        const valorTempMaceracao = [];

        const valorTempMalteacao1 = [];
        const valorTempMalteacao2 = [];
        const valorTempMalteacao3 = [];

        const valorTempMoagem = [];

        const valorTempBrassagem1 = [];
        const valorTempBrassagem2 = [];
        const valorTempBrassagem3 = [];

        const valorTempFervura = [];

        const valorTempResfriamento1 = []; 
        const valorTempResfriamento2 = []; 
        const valorTempResfriamento3 = []; 
        
        const valorTempFiltragem = []; 
        const valorTempPasteurizacao = []; 
        const valorTempTunelPast = [];

    await serial(
        valorTempMaceracao,
        valorTempMalteacao1,
        valorTempMalteacao2,
        valorTempMalteacao3,
        valorTempMoagem,
        valorTempBrassagem1,
        valorTempBrassagem2,
        valorTempBrassagem3,
        valorTempFervura,
        valorTempResfriamento1, 
        valorTempResfriamento2, 
        valorTempResfriamento3, 
        valorTempFiltragem, 
        valorTempPasteurizacao, 
        valorTempTunelPast
        
    );
    servidor(
        valorTempMaceracao,
        valorTempMalteacao1,
        valorTempMalteacao2,
        valorTempMalteacao3,
        valorTempMoagem,
        valorTempBrassagem1,
        valorTempBrassagem2,
        valorTempBrassagem3,
        valorTempFervura,
        valorTempResfriamento1, 
        valorTempResfriamento2, 
        valorTempResfriamento3, 
        valorTempFiltragem, 
        valorTempPasteurizacao, 
        valorTempTunelPast
    );
})();
