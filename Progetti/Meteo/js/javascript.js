// Variabili
const bottone_cerca = document.getElementById('bottone_cerca');
const input_cerca = document.getElementById('input_cerca');
const svg_paese = document.querySelector('div#dati_generali svg');
const paragrafo_paese = document.querySelector('div#dati_generali p:nth-child(1)');
let font_paragrafo_paese;
let nome_paese;
let nome_nazione;
const paragrafo_nazione = document.querySelector('div#dati_generali p:nth-child(2)');
const paragrafo_data = document.querySelector('div#dati_generali p:nth-child(3)');
const selettore_giorno = document.querySelector('div#selettore_giorno');
const selettore_giorno_bottoni = document.querySelectorAll('div#selettore_giorno button');
const selettore_0 = document.querySelector('div#selettore_giorno button:nth-child(1)');
const selettore_1 = document.querySelector('div#selettore_giorno button:nth-child(2)');
const selettore_2 = document.querySelector('div#selettore_giorno button:nth-child(3)');
const data = new Date();
let domani = new Date();
domani.setDate(data.getDate() + 1);
const giorni_settimana = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
selettore_0.textContent = 'Oggi';
selettore_1.textContent = `${giorni_settimana[domani.getDay()]} ${domani.getDate()}`;
domani = String(domani.getDate());
if (domani.length == 1) {
    domani = '0' + domani;
}
let dopodomani = new Date();
dopodomani.setDate(data.getDate() + 2);
selettore_2.textContent = `${giorni_settimana[dopodomani.getDay()]} ${dopodomani.getDate()}`;
dopodomani = String(dopodomani.getDate());
if (dopodomani.length == 1) {
    dopodomani = '0' + dopodomani;
}
let giorno = String(data.getDate());
if (giorno.length == 1) {
    giorno = '0' + giorno;
}
let mese = String(data.getMonth() + 1);
let mese_stagione = mese;
if (mese.length == 1) {
    mese = '0' + mese;
}
let tramonto;
let alba = 6;
let svg;
const anno = String(data.getFullYear());
let data_completa = `${giorno}/${mese}/${anno}`;
let data_selettore;
let giorno_scelto;
let paese;
let prima_lettera;
let paese_variabile;
let dati;
const ogg_traduci_città = {
    "Milano": "Milan",
    "Roma": "Rome",
    "Napoli": "Naples",
    "Firenze": "Florence",
    "Venezia": "Venice",
    "Torino": "Turin",
    "Genova": "Genoa",
};


// Assegnazione comandi
// Faccio vedere il body solo quando il caricamento è finito, per evitare il flickering/flash layout
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Attivo evento tocco su Safari per forzare la pseudo classe :active
document.addEventListener("touchstart", function() {}, true);

// Ricalcolo il font del paragrafo paese per ogni resize
window.addEventListener('resize', () => {
    ricalcola_font_paragrafo_paese();
});

// Inizia ricerca
bottone_cerca.addEventListener('click', () => {
    data_completa = `${giorno}/${mese}/${anno}`;
    ricerca(0, data_completa);
    document.querySelector('button.attivo').classList.remove('attivo');
    selettore_0.classList.add('attivo');
});
input_cerca.addEventListener('keydown', (event) => {
    if (event.key == 'Enter') {
        data_completa = `${giorno}/${mese}/${anno}`;
        ricerca(0, data_completa);
        document.querySelector('button.attivo').classList.remove('attivo');
        selettore_0.classList.add('attivo');
    }
});
input_cerca.addEventListener('input', () => {
    input_cerca.style.border = '2px solid black';
    input_cerca.placeholder = 'Cerca località';
});
document.querySelector('button#torna_su').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('button#torna_su').blur();
});

// Calcola dimensione font-size del paragrafo paese in modo dinamico
function ricalcola_font_paragrafo_paese() {
    paragrafo_paese.style.removeProperty("font-size");
    font_paragrafo_paese = Number(window.getComputedStyle(paragrafo_paese).fontSize.slice(0, -2));
    paragrafo_paese.style.fontSize = `${font_paragrafo_paese}px`;
    paragrafo_paese.textContent = nome_paese;
    let altezza_paragrafo_paese = parseFloat(window.getComputedStyle(paragrafo_paese).height);
    let line_height_paragrafo_paese = parseFloat(window.getComputedStyle(paragrafo_paese).lineHeight);
    let numero_cicli = 0;
    while (altezza_paragrafo_paese > line_height_paragrafo_paese) {
        font_paragrafo_paese -= 1;
        font_paragrafo_paese = font_paragrafo_paese < 16 ? 16 : font_paragrafo_paese;
        paragrafo_paese.style.fontSize = `${font_paragrafo_paese}px`;
        altezza_paragrafo_paese = parseFloat(window.getComputedStyle(paragrafo_paese).height);
        numero_cicli += 1;
        if (numero_cicli > 45) {
            break;
        }
    }
    paragrafo_nazione.textContent = nome_nazione;
    let font_paragrafo_nazione = parseFloat(window.getComputedStyle(paragrafo_paese).fontSize) - 10;
    font_paragrafo_nazione = font_paragrafo_nazione < 16 ? 16 : font_paragrafo_nazione;
    paragrafo_nazione.style.fontSize = `${font_paragrafo_nazione}px`;
    let altezza_header = parseFloat(window.getComputedStyle(document.querySelector('header')).height) + 0;
    document.getElementById('contenitore_madre').style.marginTop = `${altezza_header}px`;
}

// Funzione selettore giorni
for (const bottone of selettore_giorno_bottoni) {
    bottone.addEventListener('click', (event) => {
        // Prendo 0 1 2 in base al giorno per farlo corrispondere a forecastday, poi aggiorno i dati
        document.querySelector('button.attivo').classList.remove('attivo');
        event.target.classList.add('attivo');
        if (event.target.classList.contains('zero')) {
            giorno_scelto = '0';
            data_selettore = `${giorno}/${mese}/${anno}`;
        }

        else if (event.target.classList.contains('uno')) {
            giorno_scelto = '1';
            data_selettore = `${domani}/${mese}/${anno}`
        }

        else {
            giorno_scelto = '2';
            data_selettore = `${dopodomani}/${mese}/${anno}`
        }

        // Dopo aver stabilito il giorno, modifico i dati
        // Prendo l'orario
        const location = dati.location.tz_id;
        const fuso_orario = new Intl.DateTimeFormat('it-IT', {
            timeZone: location,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(new Date()).slice(0, 5);
        let ora = fuso_orario.slice(0, 2);
        if (ora.startsWith('0')) {
            ora = ora.slice(1);
        }

        // Aggiornamento dei dati nel DOM, prima dati generali
        paragrafo_data.textContent = `Previsioni per oggi, ${data_selettore}`;

        // Aggiornamento di tutte le fasce orarie
        let ora_fascia = Number(ora);
        if (giorno_scelto != 0) {
            ora_fascia = 0;
        }

        // Rimuovo le fascie orarie precedenti rimaste nel DOM
        document.querySelectorAll("div.fascia_oraria, hr").forEach(elemento => elemento.remove());

        // Creo le fasce orarie in modo dinamico, ma ancora non hanno i dati dentro
        for (let i = 0; i < 24 - ora_fascia; i++) {
            const div_fascia_oraria = document.createElement('div');
            div_fascia_oraria.classList.add('fascia_oraria');

            const div_ora_e_condizioni = document.createElement('div');
            div_ora_e_condizioni.classList.add('ora_e_condizioni');
            const p_ora = document.createElement('p');
            const p_ora2 = document.createElement('p');
            div_ora_e_condizioni.append(p_ora, p_ora2);

            const div_svg_e_gradi = document.createElement('div');
            div_svg_e_gradi.classList.add('svg_e_gradi');
            const svg_gradi = document.createElement('svg');
            const p_gradi = document.createElement('p');
            div_svg_e_gradi.append(svg_gradi, p_gradi);

            const div_quantita_e_vento = document.createElement('div');
            div_quantita_e_vento.classList.add('quantita_e_vento');
            const div_pioggia = document.createElement('div');
            div_pioggia.classList.add('pioggia');
            const svg_pioggia = document.createElement('svg');
            const p_pioggia = document.createElement('p');
            div_pioggia.append(svg_pioggia, p_pioggia);
            const div_vento = document.createElement('div');
            div_vento.classList.add('vento');
            const svg_vento = document.createElement('svg');
            const p_vento = document.createElement('p');
            div_vento.append(svg_vento, p_vento);
            div_quantita_e_vento.append(div_pioggia, div_vento);

            div_fascia_oraria.append(div_ora_e_condizioni, div_svg_e_gradi, div_quantita_e_vento);
            const hr = document.createElement('hr');

            document.getElementById('meteo_attuale').append(div_fascia_oraria, hr);
        }

        // Ciclo ed aggiornamento di tutte le fascie orarie
        const div_da_usare = Array.from(document.querySelectorAll('div.fascia_oraria'));
        div_da_usare.forEach((div) => {
            const codice = dati.forecast.forecastday[giorno_scelto].hour[ora_fascia].condition.code;

            // Prendo la condizione
            const dati_codice = lista_condizioni.find(oggetto => oggetto.code == codice);
            const condizione = dati_codice.languages.day_text;
            const stato = dati_codice.languages.condizione;

            // Stabilisco l'ora media del tramonto in base all'orario e stagione
            if (mese >= 4 && mese <= 9) { // Primavera - estate
                tramonto = 20;
            }
            else { // Autunno inverno
                tramonto = 18;
            }

            // Prendo la temperatura
            const temperatura = dati.forecast.forecastday[giorno_scelto].hour[ora_fascia].temp_c + '°';

            // Prendo quantità di pioggia, se c'è
            const mm_pioggia = dati.forecast.forecastday[giorno_scelto].hour[ora_fascia].precip_mm;
            const qnt_pioggia = Number(mm_pioggia) == 0 ? 'Assenti' : `${mm_pioggia}mm`;

            // Prendo velocità vento in km/h
            const vento = dati.forecast.forecastday[giorno_scelto].hour[ora_fascia].wind_kph + ' km/h'

            div.querySelector('div.ora_e_condizioni p:nth-child(1)').textContent = String(ora_fascia).length == 1 ? '0' + String(ora_fascia) + ':00' : String(ora_fascia) + ':00';

            // Fascia notturna
            if (ora_fascia >= tramonto || ora_fascia < alba) {
                if (stato == "Sole" || stato == "Nuvoloso") {
                    svg = stati_svg["Nebbia"];
                }

                else {
                    svg = stati_svg[stato];
                }
            }

            // Fascia diurna
            else {
                svg = stati_svg[stato];
            }

            div.querySelector('div.ora_e_condizioni p:nth-child(2)').textContent = condizione;
            div.querySelector('div.svg_e_gradi svg:nth-child(1)').outerHTML = svg;
            div.querySelector('div.svg_e_gradi p:nth-of-type(1)').textContent = temperatura;

            div.querySelector('div.quantita_e_vento div.pioggia svg:nth-of-type(1)').outerHTML = stati_svg["Goccia"];
            div.querySelector('div.quantita_e_vento div.pioggia p:nth-of-type(1)').textContent = qnt_pioggia;
            div.querySelector('div.quantita_e_vento div.vento svg:nth-of-type(1)').outerHTML = stati_svg["Vento"];
            div.querySelector('div.quantita_e_vento div.vento p:nth-of-type(1)').textContent = vento;

            div.nextElementSibling.style.display = 'block';
            ora_fascia += 1
        });
    })
};


// Funzione ricerca principale meteo
function ricerca(giorno_scelto, data_aggiornata) {
    // Raccolta del paese ed aggiustamenti
    try {
        paese = input_cerca.value;
        paese = paese.trim();
        prima_lettera = paese.at(0).toUpperCase();
        paese = prima_lettera + paese.slice(1);
        input_cerca.value = paese;
        paese_variabile = paese;
        input_cerca.blur();

        // Conversione per città italiane importanti
        if (paese in ogg_traduci_città) {
            paese = ogg_traduci_città[paese];
        }
        dati_meteo();
    }
    catch (error) {
        input_cerca.style.border = '2px solid #ff0000';
        input_cerca.placeholder = 'Inserisci una paese!';
    }


    async function dati_meteo() {
        // Previsione meteo ed aggiornamento DOM
        try {
            // Variabili locali
            const giorni = 3;
            const url_traduzione = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(paese)}&langpair=it|en`;

            // Traduci dall'italiano all'inglese, fetch
            const risposta_traduzione = await fetch(url_traduzione);
            const dati_traduzione = await risposta_traduzione.json();
            const parola_tradotta = dati_traduzione.responseData.translatedText;

            // Richiesta princiaple dei dati meteo, fetch
            const url = `/api/meteo?q=${parola_tradotta}&days=${giorni}`;
            const risposta = await fetch(url);
            dati = await risposta.json();

            if (Object.keys(dati)[0] === "error") {
                throw new Error("errore nella richiesta")
            }

            // Dati generali
            document.getElementById('torna_portfolio').style.opacity = '1';
            nome_paese = paese_variabile;
            nome_nazione = dati.location.country;
            if (nome_nazione == 'Italy') {
                nome_nazione = 'Italia';
            }
            svg_paese.style.opacity = '1';

            // Dati ora per ora
            // Prendo l'orario
            const location = dati.location.tz_id;
            const fuso_orario = new Intl.DateTimeFormat('it-IT', {
                timeZone: location,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).format(new Date()).slice(0, 5);
            let ora = fuso_orario.slice(0, 2);
            if (ora.startsWith('0')) {
                ora = ora.slice(1);
            }


            // Aggiornamento dei dati nel DOM, prima dati generali
            ricalcola_font_paragrafo_paese();
            paragrafo_data.textContent = `Previsioni per oggi, ${data_aggiornata}`;

            // Aggiornamento di tutte le fasce orarie
            let ora_fascia = Number(ora);
            if (giorno_scelto != 0) {
                ora_fascia = 0;
            }

            // Rimuovo le fascie orarie precedenti rimaste nel DOM
            document.querySelectorAll("div.fascia_oraria, hr").forEach(elemento => elemento.remove());

            // Creo le fasce orarie in modo dinamico, ma ancora non hanno i dati dentro
            for (let i = 0; i < 24 - ora_fascia; i++) {
                const div_fascia_oraria = document.createElement('div');
                div_fascia_oraria.classList.add('fascia_oraria');

                const div_ora_e_condizioni = document.createElement('div');
                div_ora_e_condizioni.classList.add('ora_e_condizioni');
                const p_ora = document.createElement('p');
                const p_ora2 = document.createElement('p');
                div_ora_e_condizioni.append(p_ora, p_ora2);

                const div_svg_e_gradi = document.createElement('div');
                div_svg_e_gradi.classList.add('svg_e_gradi');
                const svg_gradi = document.createElement('svg');
                const p_gradi = document.createElement('p');
                div_svg_e_gradi.append(svg_gradi, p_gradi);

                const div_quantita_e_vento = document.createElement('div');
                div_quantita_e_vento.classList.add('quantita_e_vento');
                const div_pioggia = document.createElement('div');
                div_pioggia.classList.add('pioggia');
                const svg_pioggia = document.createElement('svg');
                const p_pioggia = document.createElement('p');
                div_pioggia.append(svg_pioggia, p_pioggia);
                const div_vento = document.createElement('div');
                div_vento.classList.add('vento');
                const svg_vento = document.createElement('svg');
                const p_vento = document.createElement('p');
                div_vento.append(svg_vento, p_vento);
                div_quantita_e_vento.append(div_pioggia, div_vento);

                div_fascia_oraria.append(div_ora_e_condizioni, div_svg_e_gradi, div_quantita_e_vento);
                const hr = document.createElement('hr');

                document.getElementById('meteo_attuale').append(div_fascia_oraria, hr);
            }

            // Ciclo ed aggiornamento di tutte le fascie orarie
            const div_da_usare = Array.from(document.querySelectorAll('div.fascia_oraria'));
            div_da_usare.forEach((div) => {
                const codice = dati.forecast.forecastday[giorno_scelto].hour[ora_fascia].condition.code;

                // Prendo la condizione
                const dati_codice = lista_condizioni.find(oggetto => oggetto.code == codice);
                const condizione = dati_codice.languages.day_text;
                const stato = dati_codice.languages.condizione;

                // Stabilisco l'ora media del tramonto in base all'orario e stagione
                if (mese >= 4 && mese <= 9) { // Primavera - estate
                    tramonto = 20;
                }
                else { // Autunno inverno
                    tramonto = 18;
                }

                // Prendo la temperatura
                const temperatura = dati.forecast.forecastday[giorno_scelto].hour[ora_fascia].temp_c + '°';

                // Prendo quantità di pioggia, se c'è
                const mm_pioggia = dati.forecast.forecastday[giorno_scelto].hour[ora_fascia].precip_mm;
                const qnt_pioggia = Number(mm_pioggia) == 0 ? 'Assenti' : `${mm_pioggia}mm`;

                // Prendo velocità vento in km/h
                const vento = dati.forecast.forecastday[giorno_scelto].hour[ora_fascia].wind_kph + ' km/h'

                div.querySelector('div.ora_e_condizioni p:nth-child(1)').textContent = String(ora_fascia).length == 1 ? '0' + String(ora_fascia) + ':00' : String(ora_fascia) + ':00';

                // Fascia notturna
                if (ora_fascia >= tramonto || ora_fascia < alba) {
                    if (stato == "Sole" || stato == "Nuvoloso") {
                        svg = stati_svg["Nebbia"];
                    }

                    else {
                        svg = stati_svg[stato];
                    }
                }

                // Fascia diurna
                else {
                    svg = stati_svg[stato];
                }

                div.querySelector('div.ora_e_condizioni p:nth-child(2)').textContent = condizione;
                div.querySelector('div.svg_e_gradi svg:nth-child(1)').outerHTML = svg;
                div.querySelector('div.svg_e_gradi p:nth-of-type(1)').textContent = temperatura;

                div.querySelector('div.quantita_e_vento div.pioggia svg:nth-of-type(1)').outerHTML = stati_svg["Goccia"];
                div.querySelector('div.quantita_e_vento div.pioggia p:nth-of-type(1)').textContent = qnt_pioggia;
                div.querySelector('div.quantita_e_vento div.vento svg:nth-of-type(1)').outerHTML = stati_svg["Vento"];
                div.querySelector('div.quantita_e_vento div.vento p:nth-of-type(1)').textContent = vento;

                div.nextElementSibling.style.display = 'block';
                ora_fascia += 1
            });

            // Nel CSS avevo nascosto degli elementi, qui li mostro
            selettore_giorno.style.display = 'flex';
            document.getElementById('torna_su').style.display = 'inline-block';
            document.querySelector('footer').style.display = 'block';
        }
        catch (errore) {
            input_cerca.style.border = '2px solid #ff0000';
            input_cerca.value = '';
            input_cerca.placeholder = 'Località non trovata!';
        }
    }
}

// Capitale d'italia come ricerca di default, in modo da presentare del contenuto
input_cerca.value = 'Roma';
ricerca(0, data_completa);