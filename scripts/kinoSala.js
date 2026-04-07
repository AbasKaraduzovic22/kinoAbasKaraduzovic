// Trenutno prikazana projekcija
var trenutniIndex = 0;

// Validacija podataka
function validirajPodatke(podaci) {
  var validniStatusi = ["slobodno", "zauzeto", "rezervisano"];

  if (!podaci.projekcije || podaci.projekcije.length === 0) {
    return false;
  }

  for (var i = 0; i < podaci.projekcije.length; i++) {
    var p = podaci.projekcije[i];
    for (var j = 0; j < p.sjedista.length; j++) {
      if (validniStatusi.indexOf(p.sjedista[j].status) === -1) {
        return false;
      }
    }
  }

  return true;
}

// Iscrtavanje sale
function prikaziSalu() {
  var container = document.getElementById("sala");
  container.innerHTML = "";

  var projekcija = podaci.projekcije[trenutniIndex];

  // Film info (lijevi panel)
  document.getElementById("film-poster").src       = projekcija.poster || "";
  document.getElementById("naziv-filma").textContent = projekcija.film;
  document.getElementById("trajanje").textContent    = projekcija.trajanje || "";
  document.getElementById("vrijeme").textContent     = projekcija.vrijeme;
  document.getElementById("sala-naziv").textContent  = projekcija.sala;

  // Grupisanje sjedišta po redu
  var redovi = {};
  for (var i = 0; i < projekcija.sjedista.length; i++) {
    var s = projekcija.sjedista[i];
    if (!redovi[s.red]) {
      redovi[s.red] = [];
    }
    redovi[s.red].push(s);
  }

  // Grid element
  var grid = document.createElement("div");
  grid.className = "sjedista-grid";

  var redoviNazivi = Object.keys(redovi).sort();

  for (var r = 0; r < redoviNazivi.length; r++) {
    var redIme = redoviNazivi[r];

    // Oznaka reda (A, B, C...)
    var oznaka = document.createElement("div");
    oznaka.className = "red-oznaka";
    oznaka.textContent = redIme;
    grid.appendChild(oznaka);

    // Sjedišta u redu
    var sjedistaCurrent = redovi[redIme];
    for (var k = 0; k < sjedistaCurrent.length; k++) {
      var sjediste = sjedistaCurrent[k];

      var div = document.createElement("div");
      div.className = "sjediste " + sjediste.status;
      div.textContent = sjediste.broj;

      // Klik — samo slobodna mogu se rezervisati
      (function(s) {
        div.addEventListener("click", function() {
          if (s.status === "slobodno") {
            s.status = "rezervisano";
            prikaziSalu();
          }
        });
      })(sjediste);

      grid.appendChild(div);
    }
  }

  container.appendChild(grid);

  // Dugmad navigacije
  var dugmad = document.createElement("div");
  dugmad.className = "navigacija";

  var prethodna = document.createElement("button");
  prethodna.textContent = "◀ Prethodna projekcija";
  prethodna.className = "nav-btn";
  prethodna.addEventListener("click", function() {
    if (trenutniIndex > 0) {
      trenutniIndex--;
      prikaziSalu();
    }
  });

  var sljedeca = document.createElement("button");
  sljedeca.textContent = "Sljedeća projekcija ▶";
  sljedeca.className = "nav-btn";
  sljedeca.addEventListener("click", function() {
    if (trenutniIndex < podaci.projekcije.length - 1) {
      trenutniIndex++;
      prikaziSalu();
    }
  });

  // Onemogući dugme ako nema prethodne/sljedeće
  if (trenutniIndex === 0) {
    prethodna.disabled = true;
  }
  if (trenutniIndex === podaci.projekcije.length - 1) {
    sljedeca.disabled = true;
  }

  dugmad.appendChild(prethodna);
  dugmad.appendChild(sljedeca);
  container.appendChild(dugmad);
}

// Pokretanje
if (!validirajPodatke(podaci)) {
  document.getElementById("sala").innerHTML = "<p class='greska'>Podaci nisu validni!</p>";
} else {
  prikaziSalu();
}
