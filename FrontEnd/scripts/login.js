// Vérifier l'état de connexion 
function islogged(){
  const token = localStorage.getItem("token");
  const mode = document.querySelector(".edition-mode");
  const buttonFiltres = document.querySelector(".filtres");
  const buttonModifier = document.querySelector(".title span");
  
  if (mode && buttonFiltres && buttonModifier) {
     if (token) {
      // Afficher le mode édition et le button modifier
       mode.style.display= "flex"
       buttonModifier.style.display= "block"
       // Masquer les buttons des filtres
       buttonFiltres.style.display= "none"
       
     } else {
      // Masquer le mode édition et le button modifier
       mode.style.display= "none"
       buttonModifier.style.display= "none"
        // Afficher les buttons des filtres
       buttonFiltres.style.display= "flex"
      }
  }
}

// Fonction de Connexion 
function login(){
    const form= document.getElementById("loginForm");
    if(form){
    form.addEventListener("submit", async (event)=>{
        event.preventDefault();
        const email= document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const loginErreur= document.querySelector(".passwordErr");

        try {
            // Appel de la fonction fetch 
              const response = await fetch("http://localhost:5678/api/users/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({email, password}),
              });
    
            // Vérification de la réponse
              if (response.status === 404) {
              // Affichage du message d'erreur en cas d'identifiants incorrects
              loginErreur.textContent = "Erreur dans l’identifiant ou le mot de passe";
               }
            const result = await response.json();
              // Stockage du token dans le local storage
            localStorage.setItem("token", result.token);
            
            // Redirection vers la page d'accueil
            window.location.href ="index.html"
        } 
       catch (error) {
            // Message en cas d'erreurs de requête ou de connexion
            console.error("Erreur lors de la requête d'authentification:", error);
        } 
      finally{
        islogged();
      }
                
    }); 
  }
    
}

// Fonction de déconnexion
function logout() {
  const loginli = document.querySelector(".loginli");
  const logoutli = document.querySelector(".logoutli");

  if (loginli && logoutli){

    // Vérification si le token est déjà stocké dans le local storage
    if (localStorage.getItem("token")) {
      // Masquer "Login" et Afficher "Logout" dans le menu
      loginli.style.display= "none"
      logoutli.style.display= "block"

      logoutli.addEventListener("click", function (event) {
        event.preventDefault();

        // Suppression du token du local storage
        localStorage.removeItem("token");

        // Redirection vers la page d'identification
       window.location.href = "./login.html";
      });
    } else {
      // Afficher "Login" après la déconnexion
      loginli.style.display= "block"
    }
  }
}

 document.addEventListener("DOMContentLoaded", function () {
  islogged();
  logout();
  login();
  });

  /*window.addEventListener("popstate", function (event) {
    // Vérifier l'état de connexion lorsque l'utilisateur utilise le bouton "retour" du navigateur
    islogged();
  });*/