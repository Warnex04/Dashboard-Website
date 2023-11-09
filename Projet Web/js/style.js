const text = 'Ceci est une petite explication ou une introduction à votre contenu.';
let index = 0;

function typeWriter() {
  if (index < text.length) {
    document.getElementById("typewriter").innerHTML += text.charAt(index);
    index++;
    // Appelle la fonction typeWriter toutes les 150ms
    setTimeout(typeWriter, 150);
  }
}

// Lancer la fonction quand le contenu du DOM est chargé
document.addEventListener('DOMContentLoaded', typeWriter);

