$(document).ready(function() {

    var htmlGiorno = $('#calendar-template').html();
    var templateGiorno = Handlebars.compile(htmlGiorno);

    // Stampare il mese di Gennaio 2018
    // Tramite click stampare il mese successivo

    var dataIniziale = moment('2018-01-01');
    stampaGiorniMese(dataIniziale); // Inizializzazione Calendario
    stampaFestivi(dataIniziale);

    $('.mese-succ').click(function() {
        if (dataIniziale.month() != 11) {
            dataIniziale.add(1, 'month');
            stampaGiorniMese(dataIniziale);
            stampaFestivi(dataIniziale);
        } else{
            alert("Il calendario comprende solo l'anno 2018");
        }
    });
    $('.mese-prec').click(function() {
        if (dataIniziale.month() != 0) {
            dataIniziale.subtract(1, 'month');
            stampaGiorniMese(dataIniziale);
            stampaFestivi(dataIniziale);
        } else{
            alert("Il calendario comprende solo l'anno 2018");
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
                    $('#calendar li[data-day="' + dataFestivo + '"]').addClass('festivo').append(' - ' + nomeFestivo);
                }
            },
            error: function(err) {
                alert("Errore AJAX");
            }
        });
    }

    function stampaGiorniMese(meseDaStampare) {
        $('#calendar').empty();
        var standardDay = meseDaStampare.clone();
        var giorniMese = meseDaStampare.daysInMonth();
        var nomeMese = meseDaStampare.format('MMMM');
        $('#nome-mese').text(nomeMese); // Aggiorniamo il nome del mese in top calendar
        for (var i = 1; i <= giorniMese; i++) {
            // $('#calendar').append('<li>' + i + ' ' + nomeMese + '</li>');
            var giornoDaInserire = {
                day: i + ' ' + nomeMese,
                dataDay: standardDay.format('YYYY-MM-DD')
            }
            var templateFinale = templateGiorno(giornoDaInserire); // Stiamo popolando il template con i dati dell'oggetto
            $('#calendar').append(templateFinale);
            standardDay.add(1, 'day');
        }
    }

});
