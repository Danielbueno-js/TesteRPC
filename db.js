const sqlite3 = require('sqlite3');
const fs = require('fs');
const moment = require('moment');

const DB_DIRECTORY = './db';
const DB_FILE = 'data.db';
const DB_URL = `${DB_DIRECTORY}/${DB_FILE}`;

const openDatabase = () => {
    const createDiasSQL = fs.readFileSync('./scripts/CREATE_DIAS.sql').toString();
    const createProgramacaoSQL = fs.readFileSync('./scripts/CREATE_PROGRAMACAO.sql').toString();

    if (!fs.existsSync(DB_DIRECTORY)) fs.mkdirSync(DB_DIRECTORY);
    let dbExists = fs.existsSync(DB_URL);

    let dbFlags = sqlite3.OPEN_READWRITE;
    if (!dbExists) dbFlags = sqlite3.OPEN_CREATE | dbFlags;

    const db = new sqlite3.Database(DB_URL, dbFlags);

    if (!dbExists) {
        db.run(createProgramacaoSQL);
        db.run(createDiasSQL);
    }

    return db;
};

const insertPrograma = (db, programa) => {
    const insertProgramaSQL = fs.readFileSync('./scripts/INSERT_PROGRAMA.sql').toString();    

    return db.run(insertProgramaSQL, Object.values(programa))
}

const selectProgramacaoDia = (db, date) => {
    const timestampInicioDia = moment(date, 'YYYY-MM-DD').startOf('day').format('x') / 1000;
    const timestampFinalDia = moment(date, 'YYYY-MM-DD').endOf('day').format('x') / 1000;
    const selectSQL = fs.readFileSync('./scripts/SELECT_PROGRAMACAO.sql').toString();

    console.log(timestampInicioDia, timestampFinalDia)

    return new Promise((resolve, reject) => {
        db.all(selectSQL,  [timestampInicioDia, timestampFinalDia], (err, rows)=>{
            if(err) reject(err);
            resolve(rows);
        })
    });
} 

const insertDia = (db, date) =>{
    const insertSQL = fs.readFileSync('./scripts/INSERT_DIA.sql').toString();

    return db.run(insertSQL, [date])
}

const selectDia = (db, date) => {
    const selectSQL = fs.readFileSync('./scripts/SELECT_DIA.sql').toString();

    return new Promise((resolve, reject) => {
        db.all(selectSQL, [date], (err, rows)=>{
            if(err) reject(err);
            resolve(rows);
        })
    });
}

module.exports = { openDatabase, insertPrograma, selectProgramacaoDia, insertDia, selectDia };