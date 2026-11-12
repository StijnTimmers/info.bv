// Eenvoudige test om te controleren of het aanpassen van het menu werkt
console.log("--- Start Kwaliteitscontrole E&S Software ---");

// Test 1: Controleer of het standaardmenu 3 producten bevat
if (bestelMenu.length === 3) {
    console.log("PASS: Standaardmenu heeft 3 producten.");
} else {
    console.error("FAIL: Onjuist aantal standaardproducten.");
}

// Test 2: Voeg een nieuw product toe en check of de lijst groeit
pasMenuAan("toevoegen", { id: 99, naam: "Test Broodje", prijs: 1.50, beschikbaar: true });
if (bestelMenu.some(item => item.id === 99)) {
    console.log("PASS: Nieuw product succesvol toegevoegd aan bestelmenu.");
} else {
    console.error("FAIL: Product toevoegen mislukt.");
}
