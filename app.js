function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('E&S Software - Kantine')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function setupEnVulTestData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const structuur = {
    'Organisaties': ['Organisatie_ID', 'Naam', 'Actief'],
    'Gebruikers': ['Gebruiker_ID', 'Organisatie_ID', 'Gebruikersnaam', 'Wachtwoord', 'Rol', 'Saldo'],
    'Menu': ['Product_ID', 'Organisatie_ID', 'Categorie', 'Naam', 'Prijs', 'Voorraad'],
    'Bestellingen': ['Bestelling_ID', 'Organisatie_ID', 'Timestamp', 'Gebruiker_ID', 'Items', 'Totaalbedrag', 'Status']
  };

  for (const sheetName in structuur) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) sheet = ss.insertSheet(sheetName);
    sheet.clear(); 
    const headers = structuur[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  }

  ss.getSheetByName('Organisaties').appendRow(['ORG-001', 'Test School', true]);
  ss.getSheetByName('Gebruikers').appendRow(['USR-1', 'ORG-001', 'stijn', '1234', 'Klant', 10.00]);
  ss.getSheetByName('Gebruikers').appendRow(['USR-2', 'ORG-001', 'kantine', '1234', 'Medewerker', 0.00]);
  
  ss.getSheetByName('Menu').appendRow(['PRD-1', 'ORG-001', 'Broodje', 'Hamburger', 2.50, 20]);
  ss.getSheetByName('Menu').appendRow(['PRD-2', 'ORG-001', 'Drinken', 'Cola', 1.50, 30]);
  ss.getSheetByName('Menu').appendRow(['PRD-3', 'ORG-001', 'Snoep', 'Frutti', 1.00, 50]);
}

function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() <= 1) return [];
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  return data.map((row, index) => {
    let obj = { _rijNummer: index + 2 };
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function verifieerLogin(gebruikersnaam, wachtwoord) {
  const gebruikers = getSheetData('Gebruikers');
  const user = gebruikers.find(u => String(u.Gebruikersnaam).toLowerCase() === String(gebruikersnaam).toLowerCase() && String(u.Wachtwoord) === String(wachtwoord));
  
  if (user) {
    return { success: true, userId: user.Gebruiker_ID, orgId: user.Organisatie_ID, rol: user.Rol, naam: user.Gebruikersnaam, saldo: user.Saldo };
  }
  return { success: false, message: 'Onjuiste inloggegevens!' };
}

function opwaarderen(userId, bedrag) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Gebruikers');
  const gebruikers = getSheetData('Gebruikers');
  const user = gebruikers.find(u => u.Gebruiker_ID === userId);
  
  if (user) {
    const nieuwSaldo = Number(user.Saldo) + Number(bedrag);
    sheet.getRange(user._rijNummer, 6).setValue(nieuwSaldo); 
    return nieuwSaldo;
  }
  return false;
}

function haalMenuOp(orgId) {
  return getSheetData('Menu').filter(item => String(item.Organisatie_ID) === String(orgId));
}

function pasVoorraadAan(productId, verschil) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Menu');
  const menu = getSheetData('Menu');
  const item = menu.find(m => m.Product_ID === productId);
  
  if (item) {
    let nieuweVoorraad = Number(item.Voorraad) + Number(verschil);
    if(nieuweVoorraad < 0) nieuweVoorraad = 0;
    sheet.getRange(item._rijNummer, 6).setValue(nieuweVoorraad); 
  }
}

function plaatsBestelling(orgId, userId, items, totaal) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const gebruikers = getSheetData('Gebruikers');
  const user = gebruikers.find(u => u.Gebruiker_ID === userId);
  if (Number(user.Saldo) < Number(totaal)) return { success: false, message: 'Onvoldoende saldo!' };
  
  ss.getSheetByName('Gebruikers').getRange(user._rijNummer, 6).setValue(Number(user.Saldo) - Number(totaal));

  const menuSheet = ss.getSheetByName('Menu');
  const menuData = getSheetData('Menu');
  items.forEach(besteldItem => {
    let menuItem = menuData.find(m => m.Naam === besteldItem);
    if(menuItem) {
      menuSheet.getRange(menuItem._rijNummer, 6).setValue(Number(menuItem.Voorraad) - 1);
      menuItem.Voorraad -= 1;
    }
  });

  const sheet = ss.getSheetByName('Bestellingen');
  const id = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
  sheet.appendRow([id, orgId, new Date(), userId, items.join(', '), totaal, 'Nieuw']);
  
  return { success: true, message: 'Bestelling ' + id + ' is geplaatst!', nieuwSaldo: (Number(user.Saldo) - Number(totaal)) };
}

function haalBestellingenOp(orgId) {
  return getSheetData('Bestellingen')
    .filter(b => String(b.Organisatie_ID) === String(orgId))
    .map(b => {
      b.Timestamp = new Date(b.Timestamp).toLocaleString('nl-NL');
      return b;
    });
}

function updateOrderStatus(bestellingId, nieuweStatus) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Bestellingen');
  const orders = getSheetData('Bestellingen');
  const order = orders.find(o => o.Bestelling_ID === bestellingId);
  
  if (order) {
    sheet.getRange(order._rijNummer, 7).setValue(nieuweStatus);
    return true;
  }
}
