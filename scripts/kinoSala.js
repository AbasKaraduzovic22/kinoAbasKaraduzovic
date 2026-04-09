var trenutniIndex = 0;

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

function nadjiProjekciuIzURL() {
  var params = new URLSearchParams(window.location.search);
  var filmIzURL = params.get("film");

  if (!filmIzURL) return 0;

  for (var i = 0; i < podaci.projekcije.length; i++) {
    if (podaci.projekcije[i].film === filmIzURL) {
      return i;
    }
  }

  return 0;
}

function prikaziSalu() {
  var container = document.getElementById("sala");
  container.innerHTML = "";

  var projekcija = podaci.projekcije[trenutniIndex];

  document.getElementById("film-poster").src              = projekcija.poster || "";
  document.getElementById("naziv-filma").textContent      = projekcija.film;
  document.getElementById("trajanje").textContent         = projekcija.trajanje || "";
  document.getElementById("vrijeme").textContent          = projekcija.vrijeme;
  document.getElementById("sala-naziv").textContent       = projekcija.sala;

  var redovi = {};
  for (var i = 0; i < projekcija.sjedista.length; i++) {
    var s = projekcija.sjedista[i];
    if (!redovi[s.red]) redovi[s.red] = [];
    redovi[s.red].push(s);
  }

  var grid = document.createElement("div");
  grid.className = "sjedista-grid";

  var redoviNazivi = Object.keys(redovi).sort();

  for (var r = 0; r < redoviNazivi.length; r++) {
    var redIme = redoviNazivi[r];

    var oznaka = document.createElement("div");
    oznaka.className = "red-oznaka";
    oznaka.textContent = redIme;
    grid.appendChild(oznaka);

    var sjedistaCurrent = redovi[redIme];
    for (var k = 0; k < sjedistaCurrent.length; k++) {
      var sjediste = sjedistaCurrent[k];

      var div = document.createElement("div");
      div.className = "sjediste " + sjediste.status;
      div.textContent = sjediste.broj;

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

  document.getElementById("btn-prethodna").disabled = (trenutniIndex === 0);
  document.getElementById("btn-sljedeca").disabled  = (trenutniIndex === podaci.projekcije.length - 1);
}

if (!validirajPodatke(podaci)) {
  document.getElementById("sala").innerHTML = "<p class='greska'>Podaci nisu validni!</p>";
} else {
  trenutniIndex = nadjiProjekciuIzURL();
  prikaziSalu();

  document.getElementById("btn-prethodna").addEventListener("click", function() {
    if (trenutniIndex > 0) {
      trenutniIndex--;
      prikaziSalu();
    }
  });

  document.getElementById("btn-sljedeca").addEventListener("click", function() {
    if (trenutniIndex < podaci.projekcije.length - 1) {
      trenutniIndex++;
      prikaziSalu();
    }
  });
}
