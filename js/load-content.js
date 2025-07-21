//Funcion para cargar contenidos de navbar y footer
fetch('/partials/navbar.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById("navbar-placeholder").innerHTML = html;
    // Emitir evento de que el navbar está cargado
    document.dispatchEvent(new CustomEvent('navbarLoaded'));
});

fetch('/partials/footer.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById("footer-placeholder").innerHTML = html;
    // Emitir evento de que el footer está cargado
    document.dispatchEvent(new CustomEvent('footerLoaded'));
});

fetch('/partials/headernav.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById("headernav-placeholder").innerHTML = html;
    // Emitir evento de que el headernav está cargado
    document.dispatchEvent(new CustomEvent('headernavLoaded'));
});
