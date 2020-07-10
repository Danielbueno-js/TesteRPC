const express = require('express');
const cors = require('cors');

const app = express();
const db = require('./db');
const service = require('./service');

app.use(cors());

app.use('/', express.static('pages'));

app.get('/programacao', async (req, res) => {
    const { date } = req.query;
    // Consultar data no bd

    // Abrir a conexao com o banco
    const database = db.openDatabase();
    // Consultar o dia pra ver se tem o dia que a gente quer
    const dia = await db.selectDia(database, date);

    //Se houver o dia no banco
    if (dia.length > 0) {
        const programacao = await db.selectProgramacaoDia(database, date);

        //retorna a programacao do dia
        res.send({date, programacao});
    } else {
        //Senão consulta na API
        const programacao = await service.consultarProgramacaoDia(date);

        //Salva no banco
        db.insertDia(database, date);

        programacao.map((programa) => db.insertPrograma(database, programa));

        //Retorna a programacao do dia
        return res.send({date, programacao});
    }

    // Fecha conexao com o banco
    database.close();
})

app.listen(8080, () => { console.log('Listening on port 8080'); });