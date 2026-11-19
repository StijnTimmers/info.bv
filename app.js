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

function voegLogToe(bericht) {
    const nu = new Date().toISOString().replace('T', ' ').substring(0, 19);
    logboek.push({ timestamp: nu, message: bericht });
}

// HOOFDFUNCTIE: Het bestelmenu aanpassen (inclusief foutafhandeling voor Kwaliteit Issue 1)
function pasMenuAan(actie, item) {
    if (actie === "toevoegen") {
        if (!item.naam || item.prijs <= 0) {
            console.error("Fout: Ongeldige productnaam of negatieve/nul prijs.");
            return "Fout: Prijs moet groter dan €0 zijn.";
        }
        menu.push(item);
        voegLogToe(`Menu uitgebreid: ${item.naam} (${item.categorie}) voor €${item.prijs.toFixed(2)}.`);
    } 
    else if (actie === "wijzigen") {
        if (item.prijs !== undefined && item.prijs <= 0) {
            return "Fout: Prijs moet groter dan €0 zijn.";
        }
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
    
    // Update de tabel op de webpagina als deze in de browser geopend is
    toonMenuOpPagina();
    return menu;
}

// NIEUWE FUNCTIE (Product Issue 2): Saldo opwaarderen voor een leerling
function waardeerSaldoOp(leerlingnummer, bedrag) {
    if (bedrag <= 0) {
        return "Fout: Opwaardeerbedrag moet positief zijn.";
    }
    if (saldoLijst[leerlingnummer] === undefined) {
        saldoLijst[leerlingnummer] = 0.00;
        voegLogToe(`Nieuwe gebruiker (${leerlingnummer}) aangemaakt.`);
    }
    saldoLijst[leerlingnummer] += bedrag;
    voegLogToe(`Saldo van ${leerlingnummer} opgewaardeerd met €${bedrag.toFixed(2)}. Nieuw saldo: €${saldoLijst[leerlingnummer].toFixed(2)}.`);
    return `Nieuw saldo: €${saldoLijst[leerlingnummer].toFixed(2)}`;
}

// Bestelling plaatsen (inclusief check op onbekend leerlingnummer voor Kwaliteit Issue 1)
function plaatsBestelling(leerlingnummer, productId) {
    if (saldoLijst[leerlingnummer] === undefined) {
        return "Fout: Onbekend leerlingnummer.";
    }
    const product = menu.find(p => p.id === productId);
    if (!product) return "Fout: Product bestaat niet.";

    if (saldoLijst[leerlingnummer] >= product.prijs) {
        saldoLijst[leerlingnummer] = Number((saldoLijst[leerlingnummer] - product.prijs).toFixed(2));
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

// KOPPELING MET HTML (Product Issue 1)
function toonMenuOpPagina() {
    if (typeof document === "undefined") return;
    const tabelBody = document.getElementById("menu-tabel");
    if (!tabelBody) return;

    tabelBody.innerHTML = "";
    menu.forEach(item => {
        const rij = `<tr>
            <td>${item.id}</td>
            <td>${item.categorie}</td>
            <td>${item.naam}</td>
            <td>€${item.prijs.toFixed(2)}</td>
            <td><button class="btn-verwijder" onclick="pasMenuAan('verwijderen', { id: ${item.id} })">Verwijder</button></td>
        </tr>`;
        tabelBody.innerHTML += rij;
    });
}

function voegProductToeVanafPagina() {
    const naam = document.getElementById("nieuw-naam").value;
    const categorie = document.getElementById("nieuw-categorie").value;
    const prijs = parseFloat(document.getElementById("nieuw-prijs").value);

    if (!naam || isNaN(prijs) || prijs <= 0) {
        alert("Vul een geldige naam en een prijs hoger dan €0,00 in!");
        return;
    }

    const nieuwId = menu.length > 0 ? Math.max(...menu.map(p => p.id)) + 1 : 1;
    pasMenuAan("toevoegen", { id: nieuwId, categorie: categorie, naam: naam, prijs: prijs });

    document.getElementById("nieuw-naam").value = "";
    document.getElementById("nieuw-prijs").value = "";
}

// Laad het menu zodra de pagina opent
if (typeof window !== "undefined") {
    window.onload = toonMenuOpPagina;
}
