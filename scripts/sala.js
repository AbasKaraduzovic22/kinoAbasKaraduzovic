const params = new URLSearchParams(window.location.search);
    const film     = params.get('film');
    const vrijeme  = params.get('vrijeme');
    const sala     = params.get('sala');
    const poster   = params.get('poster');
    const trajanje = params.get('trajanje');

    if (film)     document.getElementById('naziv-filma').textContent = film;
    if (vrijeme)  document.getElementById('vrijeme').textContent     = vrijeme;
    if (sala)     document.getElementById('sala-naziv').textContent  = sala;
    if (trajanje) document.getElementById('trajanje').textContent    = trajanje;
    if (poster)   document.getElementById('film-poster').src         = poster;
    if (film)     document.title = 'Sala – ' + film;