# E&S Software (info.bv)

**E&S Software** ontwikkelt slimme bestelsoftware voor schoolkantines. Onze applicatie is gebruiksvriendelijk voor zowel kantinemedewerkers als leerlingen (kopers). Dankzij onze handige bestelfunctie kunnen leerlingen vooraf hun lunch bestellen en betalen met hun schooltegoed, waardoor lange wachtrijen en drukte in de pauze worden vermeden.

## Ons Team & Taakverdeling

| Naam | Rol(len) | GitHub-gebruikersnaam | Verantwoordelijkheden |
| :--- | :--- | :--- | :--- |
| Stijn Timmers | Manager, Product, Kwaliteit | @StijnTimmers | Planning, `README.md`, `app.js`, `tests.js` |
| Ewoud van Dijkman | Marketing, Kwaliteit | @[Gebruikersnaam-Ewoud] | Landingspagina `index.html`, huisstijl, testen |

## Hoe onze software werkt (Datastructuur)
Onze applicatie is gebaseerd op vier onderdelen (afkomstig uit ons oorspronkelijke spreadsheet-ontwerp):
1. **Menu:** Bevat alle beschikbare kantineproducten met ID, categorie (Broodje, Drinken, Snoep), naam en prijs.
2. **Saldo:** Houdt per leerlingnummer het actuele schooltegoed bij en maakt opwaarderen mogelijk.
3. **Data (Bestellingen):** Slaat geplaatste bestellingen op inclusief tijdstip, leerlingnummer, product en totaalbedrag.
4. **Log:** Registreert automatisch elke actie (zoals menu-wijzigingen, saldo-opwaarderingen en bestellingen) voor overzicht en controle.

## Planning & Voortgang
- [x] Basisbestanden en projectstructuur opzetten
- [x] Landingspagina met menukaart en stappenplan (`index.html`)
- [x] Menubeheer, saldo-opwaardering en foutafhandeling (`app.js`)
- [x] Geautomatiseerde kwaliteitstests (`tests.js`)
- [ ] Feedback verwerken van onze potentiële klant (schoolkantine)
