$(document).ready(function() {

    var htmlGiorno = $('#calendar-template').html();
    var templateGiorno = Handlebars.compile(htmlGiorno);

    // var htmlSlittamento = $('#slittamento-template').html();
    // var templateSlittamento = Handlebars.compile(htmlSlittamento);



    // Stampare il mese di Gennaio 2018
    // Tramite click stampare il mese successivo

    var dataIniziale = moment('2018-01-01');
    var limiteIniziale = moment('2018-01-01');
    var limiteFinale = moment('2018-12-01');
    stampaGiorniMese(dataIniziale); // Inizializzazione Calendario
    stampaFestivi(dataIniziale);

    $('.mese-succ').click(function() {
        $('.mese-prec').prop('disabled', false);
        dataIniziale.add(1, 'month');
        stampaGiorniMese(dataIniziale);
        stampaFestivi(dataIniziale);
        if (dataIniziale.isSameOrAfter(limiteFinale)) {
            $(".mese-succ").prop("disabled", true);
        }
    });

    $('.mese-prec').click(function() {
        $('.mese-succ').prop('disabled', false);
        if (dataIniziale.isSameOrBefore(limiteIniziale)) {
            alert("Hai prbvato ad hackerarmi!");

        } else {
            dataIniziale.subtract(1, 'month');
            stampaGiorniMese(dataIniziale);
            stampaFestivi(dataIniziale);
            if (dataIniziale.isSameOrBefore(limiteIniziale)) {
                $(".mese-prec").prop("disabled", true);
            }
        }
    });

    function stampaFestivi(variabileMeseCorrente) {
        $.ajax({
            url: 'https://flynn.boolean.careers/exercises/api/holidays',
            method: 'GET',
            data: {
                year: variabileMeseCorrente.year(),
                month: variabileMeseCorrente.month()
            },
            success: function(data) {
                var giorniFestivi = data.response;
                for (var i = 0; i < giorniFestivi.length; i++) {
                    var giornoFestivo = giorniFestivi[i];
                    var nomeFestivo = giornoFestivo.name;
                    var dataFestivo = giornoFestivo.date;
                    $('#calendar div[data-day="' + dataFestivo + '"]').addClass('festivo').append("<p>"+nomeFestivo+"</p>");
                }
            },
            error: function(err) {
                alert("Errore AJAX");
            }
        });
    }

    function stampaGiorniMese(meseDaStampare) {
        $('#calendar').empty();

        var firstWeekDay = moment(meseDaStampare).isoWeekday();
        var slittamentoInizioMese = firstWeekDay - 1;

        var standardDay = meseDaStampare.clone();
        var giorniMese = meseDaStampare.daysInMonth();
        var nomeMese = meseDaStampare.format('MMMM');
        $('#nome-mese').text(nomeMese); // Aggiorniamo il nome del mese in top calendar
        for (var i = 1; i <= giorniMese; i++) {
            var giornoDaInserire = {
                day: i,
                dataDay: standardDay.format('YYYY-MM-DD')
            }
            var templateFinale = templateGiorno(giornoDaInserire); // Stiamo popolando il template con i dati dell'oggetto
            $('#calendar').append(templateFinale);
            standardDay.add(1, 'day');
        }
        for (var i = 0; i < slittamentoInizioMese; i++) {
            $("#calendar").prepend('<div class="day-blank"></div>');
            console.log("aggiunto")
        }


    }
});
