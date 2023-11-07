const text = "Project web: Creation of a dashboard";
const typingSpeed = 150; // Vitesse d'écriture en millisecondes
let index = 0;
let introElement = document.getElementById("animated-intro");

function typeWriter() {
    if (index < text.length) {
        introElement.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeWriter, typingSpeed);
    } else {
        // Retirer la classe qui ajoute le curseur de machine à écrire
        introElement.classList.remove("typing-cursor");
    }
}

// Ajouter la classe qui crée l'effet du curseur clignotant
introElement.classList.add("typing-cursor");
// Démarrer l'animation après que la page ait chargé
window.onload = typeWriter;
