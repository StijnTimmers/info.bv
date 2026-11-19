console.log("--- Start Uitgebreide Kwaliteitscontrole E&S Software ---");

// Test 1: Startmenu controleren
if (menu.length === 3 && menu[0].naam === "Hamburger") {
    console.log("PASS: Startmenu correct geladen.");
} else {
    console.error("FAIL: Startmenu klopt niet.");
}

// Test 2: Negatieve prijs weigeren (Kwaliteit Issue 1)
const foutPrijs = pasMenuAan("toevoegen", { id: 99, categorie: "Snoep", naam: "Fout Snoepje", prijs: -2.00 });
if (foutPrijs === "Fout: Prijs moet groter dan €0 zijn.") {
    console.log("PASS: Negatieve prijs is succesvol geblokkeerd.");
} else {
    console.error("FAIL: Negatieve prijs werd toch toegestaan!");
}

// Test 3: Onbekend leerlingnummer weigeren (Kwaliteit Issue 1)
const foutLeerling = plaatsBestelling("999999", 1);
if (foutLeerling === "Fout: Onbekend leerlingnummer.") {
    console.log("PASS: Onbekend leerlingnummer is succesvol geblokkeerd.");
} else {
    console.error("FAIL: Onbekend leerlingnummer kon bestellen!");
}

// Test 4: Saldo opwaarderen voor leerling 234567 (Product Issue 2)
waardeerSaldoOp("234567", 5.00);
if (saldoLijst["234567"] === 5.00) {
    console.log("PASS: Saldo van leerling 234567 succesvol opgewaardeerd naar €5.00.");
} else {
    console.error("FAIL: Saldo opwaarderen mislukt.");
}
