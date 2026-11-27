// --- SUPABASE CONFIGURATIE ---
const SUPABASE_URL = 'VUL_HIER_JE_PROJECT_URL_IN';
const SUPABASE_ANON_KEY = 'VUL_HIER_JE_ANON_KEY_IN';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- GLOBALE VARIABELEN ---
let huidigeGebruiker = null;
let mandje = [];
let totaalBedrag = 0;

// --- UI HELPERS ---
function toonScherm(id) {
  document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function uitloggen() {
  huidigeGebruiker = null; mandje = []; totaalBedrag = 0;
  document.getElementById('foutmelding').innerText = '';
  toonScherm('scherm-login');
}

// --- AUTHENTICATIE ---
async function inloggen() {
  const naam = document.getElementById('inlog-naam').value;
  const ww = document.getElementById('inlog-ww').value;
  const btn = document.getElementById('btn-login');
  btn.innerText = 'Bezig met inloggen...';

  // Zoek in Supabase
  const { data, error } = await supabase
    .from('gebruikers')
    .select('*')
    .ilike('gebruikersnaam', naam) // Hoofdletterongevoelig zoeken
    .eq('wachtwoord', ww)
    .single();

  btn.innerText = 'Veilig Inloggen';

  if (data) {
    huidigeGebruiker = data;
    if (data.rol === 'Klant') {
      document.getElementById('klant-naam').innerText = data.gebruikersnaam;
      document.getElementById('klant-saldo').innerText = Number(data.saldo).toFixed(2);
      toonScherm('scherm-klant');
      laadMenu();
    } else {
      toonScherm('scherm-kantine');
      wisselKantineApp('orders');
    }
  } else {
    document.getElementById('foutmelding').innerText = 'Onjuiste inloggegevens!';
  }
}

// --- KLANT LOGICA ---
async function opwaarderen() {
  const zeker = confirm("Weet je zeker dat je €5,00 aan je account wilt toevoegen?");
  if (!zeker) return;

  const code = prompt("Simulatie iDEAL: Voer je pincode in (typ '1234' om te slagen):");
  if (code !== '1234') return alert("Transactie geannuleerd of onjuiste code.");

  const nieuwSaldo = Number(huidigeGebruiker.saldo) + 5.00;

  const { error } = await supabase
    .from('gebruikers')
    .update({ saldo: nieuwSaldo })
    .eq('gebruiker_id', huidigeGebruiker.gebruiker_id);

  if (!error) {
    alert("Betaling geslaagd! €5,00 is toegevoegd.");
    huidigeGebruiker.saldo = nieuwSaldo;
    document.getElementById('klant-saldo').innerText = nieuwSaldo.toFixed(2);
  }
}

async function laadMenu() {
  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .eq('organisatie_id', huidigeGebruiker.organisatie_id)
    .order('categorie');

  if (error) return console.error(error);

  const lijst = document.getElementById('menu-lijst');
  lijst.innerHTML = '';
  data.forEach(item => {
    let knopHTML = item.voorraad > 0 
      ? `<button class="btn-klein" onclick="inMandje('${item.naam}', ${item.prijs}, '${item.product_id}')">+ Kies</button>` 
      : `<span style="color:red; font-size:12px; font-weight:bold;">Uitverkocht</span>`;
      
    lijst.innerHTML += `
      <div class="rij">
        <div><strong>${item.naam}</strong><br><small style="color:gray;">€${Number(item.prijs).toFixed(2)}</small></div>
        ${knopHTML}
      </div>`;
  });
}

function inMandje(naam, prijs, id) {
  mandje.push({ naam, prijs, id });
  totaalBedrag += Number(prijs);
  document.getElementById('mandje-aantal').innerText = mandje.length;
  document.getElementById('mandje-items').innerText = mandje.map(m => m.naam).join(', ');
  document.getElementById('mandje-totaal').innerText = totaalBedrag.toFixed(2);
}

async function bestelNu() {
  if (mandje.length === 0) return alert('Kies eerst een product!');
  if (totaalBedrag > huidigeGebruiker.saldo) return alert('Oeps! Je hebt onvoldoende saldo. Waardeer eerst op.');

  // Genereer order ID
  const bestellingId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
  const nieuwSaldo = Number(huidigeGebruiker.saldo) - totaalBedrag;

  // 1. Saldo afschrijven
  await supabase.from('gebruikers').update({ saldo: nieuwSaldo }).eq('gebruiker_id', huidigeGebruiker.gebruiker_id);
  
  // 2. Bestelling plaatsen
  const itemsText = mandje.map(m => m.naam).join(', ');
  await supabase.from('bestellingen').insert([{
    bestelling_id: bestellingId,
    organisatie_id: huidigeGebruiker.organisatie_id,
    gebruiker_id: huidigeGebruiker.gebruiker_id,
    items: itemsText,
    totaalbedrag: totaalBedrag,
    status: 'Nieuw'
  }]);

  // 3. Voorraad per item updaten
  for (let item of mandje) {
    const { data } = await supabase.from('menu').select('voorraad').eq('product_id', item.id).single();
    await supabase.from('menu').update({ voorraad: data.voorraad - 1 }).eq('product_id', item.id);
  }

  alert(`Bestelling ${bestellingId} is geplaatst!`);
  huidigeGebruiker.saldo = nieuwSaldo;
  document.getElementById('klant-saldo').innerText = nieuwSaldo.toFixed(2);
  
  // Reset mandje
  mandje = []; totaalBedrag = 0;
  document.getElementById('mandje-aantal').innerText = '0';
  document.getElementById('mandje-items').innerText = 'Nog niets gekozen';
  document.getElementById('mandje-totaal').innerText = '0.00';
  laadMenu(); 
}

// --- KANTINE LOGICA ---
function wisselKantineApp(appNaam) {
  document.getElementById('app-orders').style.display = (appNaam === 'orders') ? 'block' : 'none';
  document.getElementById('app-voorraad').style.display = (appNaam === 'voorraad') ? 'block' : 'none';
  document.getElementById('app-orders-btn').className = (appNaam === 'orders') ? 'app-knop active-app' : 'app-knop';
  document.getElementById('app-voorraad-btn').className = (appNaam === 'voorraad') ? 'app-knop active-app' : 'app-knop';
  
  if(appNaam === 'orders') laadBestellingen();
  if(appNaam === 'voorraad') laadVoorraad();
}

async function laadBestellingen() {
  const { data, error } = await supabase
    .from('bestellingen')
    .select('*')
    .eq('organisatie_id', huidigeGebruiker.organisatie_id)
    .order('aangemaakt_op', { ascending: false });

  const lijst = document.getElementById('bestellingen-lijst');
  lijst.innerHTML = data.length === 0 ? 'Geen bestellingen gevonden.' : '';
  
  data.forEach(o => {
    let isNieuw = o.status === 'Nieuw';
    let bg = isNieuw ? '#fff3cd' : '#d4edda';
    let knop = isNieuw ? `<button class="btn-klein" style="width:100%; margin-top:10px;" onclick="zetKlaar('${o.bestelling_id}')">Klaarzetten ✔️</button>` : `<div style="color:green; margin-top:10px; font-weight:bold;">Afgehandeld</div>`;
    let tijd = new Date(o.aangemaakt_op).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'});

    lijst.innerHTML += `
      <div class="rij" style="display:block; background:${bg}; padding:10px; border-radius:6px; margin-bottom:10px;">
        <strong>${o.bestelling_id}</strong> (Klant: ${o.gebruiker_id})<br>
        Producten: <b>${o.items}</b><br>
        Tijd: ${tijd}<br>
        ${knop}
      </div>`;
  });
}

async function zetKlaar(orderId) {
  await supabase.from('bestellingen').update({ status: 'Gereed' }).eq('bestelling_id', orderId);
  laadBestellingen();
}

async function laadVoorraad() {
  const { data } = await supabase
    .from('menu')
    .select('*')
    .eq('organisatie_id', huidigeGebruiker.organisatie_id)
    .order('naam');

  const lijst = document.getElementById('voorraad-lijst');
  lijst.innerHTML = '';
  data.forEach(item => {
    lijst.innerHTML += `
      <div class="rij">
        <div><strong>${item.naam}</strong><br>Huidig: <b>${item.voorraad}</b> stuks</div>
        <div>
          <button class="btn-klein" style="background:#e74c3c;" onclick="wijzigVoorraad('${item.product_id}', -1, ${item.voorraad})">-1</button>
          <button class="btn-klein" style="background:#27ae60;" onclick="wijzigVoorraad('${item.product_id}', 1, ${item.voorraad})">+1</button>
        </div>
      </div>`;
  });
}

async function wijzigVoorraad(productId, verschil, huidigeVoorraad) {
  let nieuweVoorraad = huidigeVoorraad + verschil;
  if(nieuweVoorraad < 0) nieuweVoorraad = 0;
  
  await supabase.from('menu').update({ voorraad: nieuweVoorraad }).eq('product_id', productId);
  laadVoorraad();
}
