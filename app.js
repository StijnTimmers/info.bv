// Startlijst van het kantine bestelmenu
let bestelMenu = [
    { id: 1, naam: "Broodje Gezond", prijs: 2.50, beschikbaar: true },
    { id: 2, naam: "Tosti Ham/Kaas", prijs: 2.00, beschikbaar: true },
    { id: 3, naam: "Flesje Water", prijs: 1.25, beschikbaar: true }
];

// Werkende functie: Het bestelmenu aanpassen (toevoegen, wijzigen of verwijderen)
function pasMenuAan(actie, product) {
    if (actie === "toevoegen") {
        bestelMenu.push(product);
        console.log(`Toegevoegd aan menu: ${product.naam} (€${product.prijs.toFixed(2)})`);
    } 
    else if (actie === "wijzigen") {
        const index = bestelMenu.findIndex(item => item.id === product.id);
        if (index !== -1) {
            bestelMenu[index] = { ...bestelMenu[index], ...product };
            console.log(`Product aangepast: ${bestelMenu[index].naam}`);
        } else {
            console.log("Product niet gevonden in het menu.");
        }
    } 
    else if (actie === "verwijderen") {
        bestelMenu = bestelMenu.filter(item => item.id !== product.id);
        console.log(`Product met ID ${product.id} verwijderd uit het menu.`);
    }
    return bestelMenu;
}

// Voorbeeldgebruik testen in de console:
console.log("Huidig menu:", bestelMenu);
pasMenuAan("toevoegen", { id: 4, naam: "Appel", prijs: 0.75, beschikbaar: true });
pasMenuAan("wijzigen", { id: 2, prijs: 2.25 }); // Prijs van de tosti verhogen
