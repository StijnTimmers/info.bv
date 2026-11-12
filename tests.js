console.log("--- Start Kwaliteitscontrole E&S Software ---");

// Test 1: Controleer of de 3 producten uit de spreadsheet geladen zijn
if (menu.length === 3 && menu[0].naam === "Hamburger") {
    console.log("PASS: Startmenu uit spreadsheet (Hamburger, Cola, Frutti) correct geladen.");
} else {
    console.error("FAIL: Startmenu komt niet overeen met spreadsheet.");
}

// Test 2: Test of het aanpassen van het menu werkt en gelogd wordt
pasMenuAan("toevoegen", { id: 4, categorie: "Broodje", naam: "Broodje Gezond", prijs: 3.50 });
if (menu.length === 4 && logboek.length > 1) {
    console.log("PASS: Product succesvol toegevoegd aan menu en opgeslagen in het logboek.");
} else {
    console.error("FAIL: Menu aanpassen of loggen is mislukt.");
}

// Test 3: Test saldo-check van leerling a678765 (€10 starttegoed)
const resultaat = plaatsBestelling("a678765", 2); // Bestelt Cola (€2.99)
if (resultaat === "Bestelling geslaagd!" && saldoLijst["a678765"] === 7.01) {
    console.log("PASS: Bestelling geplaatst en saldo correct bijgewerkt naar €7.01.");
} else {
    console.error("FAIL: Fout bij verwerken bestelling of saldo.");
}
