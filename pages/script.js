let request = new XMLHttpRequest();

var api = 'http://localhost:8080/programacao';

var date = moment();

function carregarProgramacao(programacao){

    $('#programeeAccordion').html('');

    $.each(programacao.programacao, function (index, programa){

        var badge = "";
        var horaInicio = moment.unix(programa.horaInicio);
        var horaFim = moment.unix(programa.horaFim);
        if(moment().isBetween(horaInicio, horaFim)){
            badge = " <span class=\"badge badge-danger\">ON AIR</span>"
        }

        var card = "<div class=\"card\"><div class=\"card-header\" id=\"headingTwo\"><h5 class=\"mb-0\"><button class=\"btn btn-link collapsed\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapse"+index+"\" aria-expanded=\"false\" aria-controls=\"collapse"+index+"\">"+
                "<img src=\""+programa.logoURL+"\" class=\"rounded img-fluid\" >"+
                "<span class=\"program-info\">"+
                moment.unix(programa.horaInicio).format('HH:mm')+ " - "+
                programa.titulo +
                badge+
                "</span>"+
            "</button></h5></div><div id=\"collapse"+index+"\" class=\"collapse\" aria-labelledby=\"headingTwo\" data-parent=\"#programeeAccordion\"><div class=\"card-body\">"+
            "<div class=\"jumbotron jumbotron-fluid program-description\" >"+
                "<div class=\"container\">"+
                    "<h1 class=\"display-4\">"+programa.titulo+"</h1>"+
                    "<p class=\"lead\">"+programa.descricao+"</p>"+
                "</div>"+
                "<img src=\""+programa.imagemURL+"\">"+
            "</div>"+
          "</div></div></div>";

        $('#programeeAccordion').append(card);
    });
}

function consultaProgramacao(){
    var url = `${api}?date=${date.format("YYYY-MM-DD")}`;
    $.ajax({url: url})
    .done(function(data){
        $('.data-atual').html("<h1>"+moment(date).format("ddd DD MMMM")+"</h1>")
        carregarProgramacao(data);
    })
}
$( document ).ready(function() {
    $("#previous").click(function(){
        date = date.subtract(1, 'days');
        consultaProgramacao();
    });

    $("#next").click(function(){
        date = date.add(1, 'days');
        consultaProgramacao();
    });


    consultaProgramacao()
});
