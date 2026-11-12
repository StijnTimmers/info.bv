// 1. Het Menu (uit tabblad 'Menu')
let menu = [
    { id: 1, categorie: "Broodje", naam: "Hamburger", prijs: 7.49 },
    { id: 2, categorie: "Drinken", naam: "Cola", prijs: 2.99 },
    { id: 3, categorie: "Snoep", naam: "Frutti", prijs: 0.99 }
];

// 2. Leerling-saldo's (uit tabblad 'Saldo')
let saldoLijst = {
    "234567": 0.00,
    "a678765": 10.00
};

// 3. Bestellingen & Logboek (uit tabbladen 'Data' en 'Log')
let bestellingen = [];
let logboek = [
    { timestamp: "2026-09-25 12:00:37", message: "Nieuwe gebruiker (234567) kreeg €0 starttegoed." }
];

// Hulpfunctie om acties op te slaan in het logboek
function voegLogToe(bericht) {
    const nu = new Date().toISOString().replace('T', ' ').substring(0, 19);
    logboek.push({ timestamp: nu, message: bericht });
}

// HOOFDFUNCTIE: Het bestelmenu aanpassen (toevoegen, wijzigen of verwijderen)
function pasMenuAan(actie, item) {
    if (actie === "toevoegen") {
        menu.push(item);
        voegLogToe(`Menu uitgebreid: ${item.naam} (${item.categorie}) voor €${item.prijs.toFixed(2)}.`);
    } 
    else if (actie === "wijzigen") {
        const index = menu.findIndex(product => product.id === item.id);
        if (index !== -1) {
            menu[index] = { ...menu[index], ...item };
            voegLogToe(`Menu aangepast: ${menu[index].naam} is nu €${menu[index].prijs.toFixed(2)}.`);
        }
    } 
    else if (actie === "verwijderen") {
        menu = menu.filter(product => product.id !== item.id);
        voegLogToe(`Product met ID ${item.id} verwijderd van het menu.`);
    }
    return menu;
}

// Extra functie uit jullie sheet: Een bestelling plaatsen en saldo afschrijven
function plaatsBestelling(leerlingnummer, productId) {
    const product = menu.find(p => p.id === productId);
    if (!product) return "Product bestaat niet.";

    if ((saldoLijst[leerlingnummer] || 0) >= product.prijs) {
        saldoLijst[leerlingnummer] -= product.prijs;
        bestellingen.push({
            timestamp: new Date().toISOString(),
            leerlingnummer: leerlingnummer,
            bestelling: product.naam,
            totaalbedrag: product.prijs
        });
        voegLogToe(`Leerling ${leerlingnummer} bestelde ${product.naam} (€${product.prijs.toFixed(2)}).`);
        return "Bestelling geslaagd!";
    } else {
        return "Onvoldoende saldo!";
    }
}
// Voorbeeldgebruik testen in de console:
console.log("Huidig menu:", bestelMenu);
pasMenuAan("toevoegen", { id: 4, naam: "Appel", prijs: 0.75, beschikbaar: true });
pasMenuAan("wijzigen", { id: 2, prijs: 2.25 }); // Prijs van de tosti verhogen
