const axios = require('axios');

const COD_EMISSORA = 1337;
const api = `https://epg-api.video.globo.com/programmes/${COD_EMISSORA}`;


const consultarProgramacaoDia = async (date) => {
    const url = `${api}?date=${date}`;
    const response = await axios.get(url);

    const entries = response.data.programme.entries;

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

    return programacao
}

module.exports = { consultarProgramacaoDia }