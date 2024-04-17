const gallery = document.querySelector(".gallery");
const filtres = document.querySelector(".filtres");
const Modal = document.querySelector(".modalContainer");
const imagesModal = document.querySelector(".imagesModal");
const addImgModal = document.querySelector(".addImages");


//Récupération des works //

async function getWorks() {
   const reponse = await fetch("http://localhost:5678/api/works");
   const works= await reponse.json();
   return works;
}

//Affichage des works //
function afficherWorks(works){
    if(gallery){
        gallery.innerHTML = "";
        for (let i=0; i< works.length; i++) {
          const figure = document.createElement("figure");
          const img = document.createElement("img");
          const figcaption = document.createElement("figcaption");
          img.src = works[i].imageUrl;
          figcaption.textContent = works[i].title;
          figure.appendChild(img);
          figure.appendChild(figcaption);
          gallery.appendChild(figure);
       }
   }
}

// Récupérer les catégories //
async function getCategory(){
   const reponse = await fetch("http://localhost:5678/api/categories");
   const categorys= await reponse.json();
   return categorys;
}

// Génerer dynamiquement le menu de catégories//
function generateMenuCategory(categorys){   
  if(filtres){
    for (let i=0; i<categorys.length; i++) {
       const button= document.createElement("button");
       button.textContent = categorys[i].name;
       button.id= categorys[i].id;
       filtres.appendChild(button);
      }
  }
}
// Ajout des filtres pour afficher les travaux par catégorie 
 function filtrerCategory(works){
  const listButton= document.querySelectorAll(".filtres button")
  for(let i=0; i< listButton.length; i++){
    listButton[i].addEventListener("click", async () => {
      if (listButton[i].id !== "0"){ 
        const worksfiltres = works.filter(function(work) {
          return work.categoryId == listButton[i].id;
        });
        afficherWorks(worksfiltres);
      }
      else {
       afficherWorks(works); 
      }
    });
  }
}

//Récuperer les photos et les afficher dans la modale//
const galleryimg = document.querySelector(".imgGallery");
function imgDisplay(works) {
  galleryimg.innerHTML = "";
  for (let i=0; i< works.length; i++) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = works[i].id;
    img.src = works[i].imageUrl;
    span.appendChild(trash);
    figure.appendChild(span);
    figure.appendChild(img);
    galleryimg.appendChild(figure);
  }
  deleteImages();
}

 //Selectionner l'image à l'ajouter dans la modale //
function selectImage(){
  const imgFile = document.querySelector(".Image_Zone img");
  const inputFile = document.querySelector(".Image_Zone input");
  const labelFile = document.querySelector(".Image_Zone label");
  const iconFile = document.querySelector(".Image_Zone .fa-image");
  const pFile = document.querySelector(".Image_Zone p");
  //Ecouter les changement sur l'input file
  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imgFile.src = e.target.result;
        imgFile.style.display = "flex";
        labelFile.style.display = "none";
        iconFile.style.display = "none";
        pFile.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });
}


// Récuperer les catégories et les ajouter au formulaire.
async function selectCat(category){
   const selectCategory = document.getElementById("category");
  // const category = await getCategory();
   for (let i=0; i<category.length; i++) {
     // Créer un nouvel élément d'option
     const option = document.createElement("option");
     // Définir la valeur et le texte de l'option avec les données de la catégorie
     option.value = category[i].id;
     option.textContent = category[i].name;
     // Ajouter cette option au menu déroulant des catégories
     selectCategory.appendChild(option);
  }
}


// Fermer la modale et retour à la modale précédante 
function Modalgestion(){
  const close = document.querySelector(".addImages .fa-xmark");
  const retour = document.querySelector(".addImages .fa-arrow-left");
  const Modal = document.querySelector(".modalContainer"); 
  const buttonValider = document.querySelector(".imagesModal button");
  const buttonModifier = document.querySelector(".title span");
  const xmark = document.querySelector(".imagesModal .fa-xmark");

  // Ouvrir la modale en cliquant sur le button modifier.
  buttonModifier.addEventListener("click",() =>{
    Modal.style.display= "flex"
    addImgModal.style.display= "none"
    imagesModal.style.display= "flex"
  });
  //Fermer la modale en cliquant sur l'icone xmark
  xmark.addEventListener("click",() =>{
    Modal.style.display= "none"
    window.location.href ="index.html"
    });
  // Fermer la modal en cliquant sur la Xmark
  close.addEventListener("click",() =>{
    Modal.style.display= "none"
    window.location.href ="index.html"
  });
  // Retourner à la modale précedante "Galery Photo" en cliquant sur la flèche retour
  retour.addEventListener("click",() =>{
    addImgModal.style.display= "none"
    imagesModal.style.display= "flex"
  });
  // En cliquant sur "valider", fermer la modale Galery Photo et ouvrir la modale "Ajout Photo"
  buttonValider.addEventListener("click",() =>{
    addImgModal.style.display= "flex"
    imagesModal.style.display= "none"
  });
}


// Valider l'ajout de la photo //
const form = document.getElementById("addimage");
const title = document.getElementById("titre");
const category = document.getElementById("category");
const imageInput = document.getElementById("file");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Vérification du  fichier image,  titre et une catégorie sont sélectionnés
  if (!imageInput.files[0] || !title.value || !category.value) {
    alert("Veuillez remplir tous les champs.");
    return;
  }
   // Création d'un objet FormData et ajoutez les données du formulaire
   const formData = new FormData();
   formData.append("image", imageInput.files[0]);
   formData.append("title", title.value);
   formData.append("category", category.value);
   try {
     // Récuperation le token d'authentification depuis le localStorage
     const token = localStorage.getItem("token");
     const response = await fetch("http://localhost:5678/api/works", {
     method: "POST",
      headers: {
       Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (response.ok) {
      const responseData = await response.json();

      // Récuperation l'URL de l'image depuis la réponse JSON
      const imageUrl = responseData.imageUrl;

      const newImage = document.createElement("img");
      const lienImg = document.getElementById("file")
      newImage.src = imageUrl;
      newImage.alt = "Aperçu de l'image ajoutée";

      gallery.appendChild(newImage);
      lienImg.src= ""

      //  Si l'image s'ajoute bien
      alert("Image ajoutée avec succès !");
       title.value= "";
       category.value="";
      const work = await getWorks();
      imgDisplay(work);
      Modal.style.display= "flex";
      addImgModal.style.display= "none";
      imagesModal.style.display= "flex";

      
    } else {
       // Pour gérer les erreurs de la requête
       alert("Une erreur est survenue lors de l'envoi de l'image.");
    }
    } catch (error) {
     // Pour gérer erreurs liées à l'envoi de la requête
      console.error("Erreur lors de l'envoi de la requête :", error);
      alert("Une erreur est survenue lors de l'envoi de l'image.");
    }
});

// Suppression d'images dans la modale //
function deleteImages() {
  const deletelist = document.querySelectorAll(".fa-trash-can");

    deletelist.forEach((trash) => {
    trash.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = trash.id;
      const token = window.localStorage.getItem("token");
      const init = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, init);
        if (!response.status == 204) {
          console.log("La requête a échoué");
          return;
        }
        // Supprimer l'image de la galerie
        const imageContainer = trash.parentNode.parentNode; // Accéder au conteneur de l'image
        imageContainer.remove(); // Supprimer l'élément parent de l'icône de suppression
        alert("photo supprimée")
        const work = await getWorks();
        imgDisplay(work);
      } catch (error) {
        console.error("Erreur :", error);
      }
    
    });
  });
}

// Appeler les fonctions //
document.addEventListener("DOMContentLoaded", async () => {
  const works = await getWorks();
  const categorys = await getCategory();
  generateMenuCategory(categorys);
  afficherWorks(works);
  filtrerCategory(works); 
  imgDisplay(works);
  selectCat(categorys);
  selectImage();
  Modalgestion();
  deleteImages();
});


