const axios = require('axios');
const sqlite3 = require('sqlite3');
const fs = require('fs');

const COD_EMISSORA = 1337;
const api = `https://epg-api.video.globo.com/programmes/${COD_EMISSORA}?date=2020-07-09`;

const DB_DIRECTORY = './db';
const DB_FILE = 'data.db';
const DB_URL = `${DB_DIRECTORY}/${DB_FILE}`;

const script = async () => {
    // Consumir API RPC
    const response = await axios.get(api);

    const date = response.data.programme.date;
    const entries = response.data.programme.entries;

    // Iterar a array de entries
    const programacao = entries.map((entrie) => {

        // Criar um objeto com a forma amigavel da programação
        const programa = {
            id: entrie.media_id,
            titulo: entrie.title,
            descricao: entrie.description,
            horaInicio: entrie.start_time,
            horaFim: entrie.end_time,
            logoURL: entrie.custom_info.Graficos.LogoURL,
            posterURL: entrie.custom_info.Graficos.PosterURL,
            imagemURL: entrie.custom_info.Graficos.ImagemURL,
        }

        return programa;
    });


    // Persistir em um db
    if (!fs.existsSync(DB_DIRECTORY)) fs.mkdirSync(DB_DIRECTORY);
    let dbExists = fs.existsSync(DB_URL);

    let dbFlags = sqlite3.OPEN_READWRITE;
    if (!dbExists) dbFlags = sqlite3.OPEN_CREATE | dbFlags;

    const db = new sqlite3.Database(DB_URL, dbFlags);

    if (!dbExists) {
        db.run('CREATE TABLE programacao(id INTEGER,titulo TEXT,descricao TEXT,horaInicio INTEGER,horaFim INTEGER,logoURL TEXT,posterURL TEXT,imagemURL TEXT)');
    }


    programacao.map((programa) => {
        const sql = 'INSERT INTO programacao(id,titulo,descricao,horaInicio,horaFim,logoURL,posterURL,imagemURL) VALUES (?,?,?,?,?,?,?,?)';

        db.run(sql, Object.values(programa), (err) => {
            if (err) {
                return console.error(err.message);
            }
        })
    })

}

script()