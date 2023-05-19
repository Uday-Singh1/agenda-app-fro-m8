class AgendaApp {
    api;    //in de geheugen wordt de "api" aangemaakt.
    switcher;    //in de geheugen wordt de "switcher" aangemaakt.
    month = 0;   //in de geheugen wordt de "month" aangemaakt de maand is standaard "0" dus je geeft aan dat je de eerste object wilt dus de eerste maand "Januari".
    constructor() { //hier maak je een construtor voor de class agendApp aan.
        this.api = new API();   // hier wordt een nieuwe API aangemaakt.
        this.switcher = new Switcher(this); //hoer maak je een nieuwe switcher aan.
        this.api.getData().then(result => {   // het terug geven (return) is nodig omdat je het hier gelijk wilt weer wilt gebruiken .
            this.switcher.loadAgenda(result[this.month]);   // hier wordt de geswitchde maand en de dagen er van getoont, dus  je laad de agenda en de resultaat er van is de maand en doormiddle van de classen onder toont het ook de dag
        });

        //als ik hier iets zet gebeurt het direct nadat de "API" is aangemaakt.
    }
    switchMonths = (sign) => {   //hier maak je een functie aan voor de knopen zodat je kan schakelen tussen de maanden en dagen
        switch (sign) {
            case "+":   // + voor optellen
                this.month = this.month + 1; //hier verhoogt het de maand met 1  maand dus van januari naar feb  en van december naar januari etc.

                break;  //zonder de break kan je niet naar de volgene maand 
            
            case "-": // - voor aftrekken
                this.month = this.month - 1;    //hier keert het terug naar de vorige maand dus als ik op februari ben dan trekt het een nummer af van de 12 maanden dus dan wordt het de  maand voor de tweede maand (februari) naar de eerste maand januari en dat geld ook voor het overschakelen naar een jaar er voor dus van de eerste naar de 12 maand

                break;  
        }

        if (this.month === 12) {    // normaal zijn er 12 maanden
            this.month = 0; //0 is 1
        }
        if (this.month < 0) { //als de maand groter is dan 0 dan toont het 11 maanden omdat 0 = 1
            this.month = 11; //11 maanden uitleg is in de regel er boven
        }

        this.switcher.loadAgenda(this.api.dataFromAPI[this.month]); // hier laadt de switcher de agenda, haalt de data van de api op en daarna de maand er van
    }
}

class API {
    dataFromAPI = [];   //dit is een lege array/lijst dat dus zo wordt aangevuld met data.

    async getData() {   // de async is asynchroon en bevat een await functie dus je wacht totdat je de json hebt gefetched dan ga je verder
        await fetch("../data/data.json").then(response => {     // in de achtergrond gaat het de data (maanden en dagen) uit de json bestand halen .
            return response.json();     //hier pakt het de echte data uit.
        }).then(data => {   //het pakt de json en returned het en de then zet de datafrom api en pakt dan de maanden uit de data.json
            this.dataFromAPI = data.months; //en daarna wordt de data  geplaatst in de this.datafromapi hier pakt het alleen de maanden er uit , dus eigenlijk open je data en daarna pak je months uit de data .
        });
        return this.dataFromAPI;    //hier geeft hij het dan weer terug en dat is nodig omdat je het op regel 8-10 met de result weer direct wilt gebruiken.
    }
}

class Agenda {
    renderer;
    header;
    month;
    htmlElement;
    agendaApp;

    constructor(data, agendaApp) {
        this.agendaApp = agendaApp; //hier wordt de agendaAPP opgeslagen.
        this.htmlElement = document.createElement("article");   //hier maak je een article aan.
        this.htmlElement.classList.add("agenda");   //hier geef je de article een classlist agenda.
        this.data = data;   //hier krijg je de maand binnen.
        this.renderer = new Renderer(); //hier zet je een nieuwe renderer aan die in de "utilities/Renderer.js" staat.
        this.renderer.render("body", this.htmlElement);  //hier rendered het de htmlElement in de body dus de Article.
        this.header = new Header(this, data.name, this.agendaApp);  //hier maak je een nieuwe header aan en dan loopt de constructor van de header.
        this.month = new Month(this, data.days);    //hier worden de maanden aangemaakt met hun dagen.
    }

    render(placeToRender, whatToRender) {    //hier geef je aan waar en wat er moet worden gerenderd
        this.renderer.render(placeToRender, whatToRender);  //hier voor je die render uit
    }
}



class Header {
    nameOfMonth;    //naam van de maand
    htmlElement;    //html element is  de header
    agenda; //moet worden aangegeven zodat je later de agenda kan opslaan om verbinding terug te geven
    leftButton; //knoppen
    rightButton;    //knoppen
    agendaApp;  //de gehele app

    constructor(agenda, nameOfMonth, agendaApp) {
        this.agenda = agenda; //hier slaat hij de agenda op van waar die vandaan kwam zodat het weer de verbinding terug geeft 
        this.agendaApp = agendaApp; //dit is eigenlijk een verbinding met de agenda app
        this.nameOfMonth = nameOfMonth; //hier is de verbinding met de naam van de maand 
        this.htmlElement = document.createElement("header");    // hier maak je de bovenkant waar je de maand naam en knoppen ziet 
        this.htmlElement.classList.add("agenda__header");   // hier maak je een classen aan voor je header dat je in de scss styled
        this.text = document.createElement("h2");   //hier maak je de h2 element waar de naam van de maand wordt getoond bijvoorbeeld Januari, (de maand wordt opgehaald via json)
        this.agenda.render(".agenda", this.htmlElement); // als je 2 agenda classes hebt pakt het de eerste 
        // this.agenda.render etc. rendered de agenda zelf,  je geeft de .agenda class van de css aan voor de styling en positioning  en de  this.htmlelement is de header in dit geval, dus je rendered de header met de styling er aan toegevoegd, vandaar dat het dus ook in een class Header zit.

        this.leftButton = new Button("previous", "<", "agenda--left", this, this.agendaApp);  //de button heeft een bepaalde type
        this.agenda.render(".agenda__header", this.text);   // hier render je de  naam van de maand, en voeg je de styling ook aan toe, het moet tussen de previous en next knop worden gezet omdat je anders de positioning van de drie dingen door elkaar haalt
        this.rightButton = new Button("next", ">", "agenda--right", this, this.agendaApp);
        this.text.innerText = this.nameOfMonth; //de text dat de naam van de maand genereert dus de h2

    }

    render(placeToRender, whatToRender) {   //placTorender = waar je iets wilt renderen en WhatToRender is wat je wilt renderen
        this.agenda.render(placeToRender, whatToRender);    //hier render je de agenda 
    }
}

class Button {
    htmlElement;  //de html elment voor de buttons
    innerText;  //de text voor de knoppen dus de <>
    extraClass; //property van de button class
    Switcher;   //de switcher voor de knoppen
    header; //de header
    agendaApp;  //de gehele app
    type;   //de type voor de knoppen

    constructor(type, innerText, extraClass, header, agendaApp) {
        this.type = type;   //de type geeft de type van de knop aan
        this.agendaApp = agendaApp; //dit is eigenlijk  een verbinding met de agenda app
        this.htmlElement = document.createElement("button");    //hier maak je de buttons aan
        this.htmlElement.classList.add("agenda__button");   //hier voeg je een style classen toe voor de buttons
        this.extraClass = extraClass;   //De extraClass is  een property van de Button-class, Het wordt gebruikt om een extra CSS Class toe te voegen aan de "HTML-element" van de buttons.
        this.htmlElement.classList.add(this.extraClass);
        this.innerText = innerText; //de innertText is de <>
        this.htmlElement.innerText = this.innerText; //hier geef je aan dat de button wordt getoond als <>

        //this.Switcher = new Switcher(this.extraClass);

        this.header = header; //dit geeft aan dat de buttons in de header  wordt gerenderd
        this.render();  //hier renderen de ebuttons hun zelf weer

        this.htmlElement.onclick = this.buttonClicked;  //de clickelement zodat je er op kan drukken
    }

    buttonClicked = () => { //hier worden de functionaliteiten van de knoppen aangegeven zodat ze heen en terug kunnen dus previous en next als je er op drukt
        if (this.type === "previous") { //de terug knop zodat je terug kan gaan naar de maand er voor 
            this.agendaApp.switchMonths("-");    //hier word er afgetrokken op welke maand je zit dus als je op februari bent en drukt op het pijltje naar links dan gaat het naar januari
            return; // zonder deze return is het niet mogelijk om terug te drukken, je drukt wel maar het gaat nogsteeds de huidige maand laten zien
        }
        this.agendaApp.switchMonths("+");   //hier word er opgeteld op welke maand je zit dus als je op januari bent en drukt op het pijltje naar rechts dan gaat het naar februari

    }

    render() {
        this.header.render("header", this.htmlElement); // hier render je de header
    }
}

class Switcher {
    agendaApp;
    agenda;
    cleaner;
    constructor(agendaApp) {    //je geeft de agendaapp mee in de constructor
        this.agendaApp = agendaApp;     //krijgt de hele app mee 
        this.cleaner = new Cleaner();   //hier maakt het dus een nieuwe cleaner aan dat dus in de "utilities/cleaner.js" staat
    }

    loadAgenda = (data) => {        //de data is de maand
        this.cleaner.clean("body"); //eerst gaat het de body even cleanen
        this.agenda = new Agenda(data, this.agendaApp);  //hier maak je een neiuwe agenda aan met de zelfde data dus "Januari" en je geeft de agenda app mee
    }

}

class Month {
    days = [];  //hier worden alle dagen aan toegevoegd
    agenda;
    numberOfDays;
    htmlElement;
    constructor(agenda, numberOfDays) { //hier krijgt hij de aantal dagen zoals 28 31 etc.
        this.htmlElement = document.createElement("ul");    //hier maak je de uls die de aantalal dagen toont aan
        this.htmlElement.classList.add("agenda__month");    //hier style je de ul
        this.numberOfDays = numberOfDays;
        this.agenda = agenda;    //hier slaat hij de agenda op van waar die vandaan kwam zodat het weer de verbinding terug geeft
        this.agenda.render(".agenda", this.htmlElement);    //hier render je eerst de hele agenda, in de agenda moet je de hele maand renderen, dat is dus de ul (dagen)
        for (let i = 1; i <= numberOfDays; i++) {    //hier maakt het de aantal van de dagen aan.
            this.days.push(new Day(this, i));       //ik maak hier elke keer een nieuwe dag aan.
        }
    }

    renderDays(placeToRender, whatToRender) {   ///placetorender = waar wil ik het renderen whatTorender = what wil ik renderen.
        this.agenda.render(placeToRender, whatToRender);    //hier worden de aantal dagen per maand gerenderd en vervolgens rendered het de hele maand in de agenda met de data van de class day.
    }
}

class Day {
    month;
    htmlElement;
    dayNumber;

    constructor(month, dayNumber) {
        this.dayNumber = dayNumber;
        this.htmlElement = document.createElement("li");    //hier wordt een dag gemaakt dus een li in een ul, eigenlijk li's
        this.htmlElement.classList.add("agenda__day");  //hier is de styling er voor 
        this.htmlElement.innerText = this.dayNumber;    //hier geef je aan dat je de nummer van de aantal dagen wilt zien dus bijvoorbeeld 30 31
        this.month = month; //hier geef je de maand aan 
        this.month.renderDays(".agenda__month", this.htmlElement);  //hier zeg je dat de dagen moeten gerenderd in de maand 
    }
}