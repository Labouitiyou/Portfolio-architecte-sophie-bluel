function login(){
    const form= document.getElementById("loginForm");
    form.addEventListener("submit", async (event)=>{
        event.preventDefault();
        const email= document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const user = {
             email: email,
             password: password, };
        const loginErreur= document.querySelector(".passwordErr");
        try {
            // Appel de la fonction fetch avec toutes les informations nécessaires
              const response = await fetch("http://localhost:5678/api/users/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(user),
              });
    
            // Vérification de la réponse
              if (response.status === 404) {
              // Affichage du message d'erreur en cas d'identifiants incorrects
              loginErreur.textContent = "Erreur dans l’identifiant ou le mot de passe";
               }

            const result = await response.json();
              // Stockage du token dans le local storage
            localStorage.setItem("token", result.token);
            window.alert(result.token);
            // Redirection vers la page d'accueil
            window.location.href ="./index.html";

        } 
        catch (error) {
            // Message en cas d'erreurs de requête ou de connexion
            console.error("Erreur lors de la requête d'authentification:", error);
        }   
    });
}

document.addEventListener("DOMContentLoaded", function () {
    login();
  });