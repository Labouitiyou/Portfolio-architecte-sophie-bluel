const gallery = document.querySelector(".gallery");
const filtres = document.querySelector(".filtres");


//Récupération des works //

async function getWorks() {
const reponse = await fetch("http://localhost:5678/api/works");
const works= await reponse.json();
return works;
}

//Affichage des works //
async function afficherWorks(works){
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
async function generateMenuCategory()
{   
    if(filtres){
    const categorys = await getCategory();
    for (let i=0; i<categorys.length; i++) {
    const button= document.createElement("button");
    button.textContent = categorys[i].name;
    button.id= categorys[i].id;
    filtres.appendChild(button);
     }
    }
}

 // Ajout des filtres pour afficher les travaux par catégorie 
async function filtrerCategory(works){
    const listButton= document.querySelectorAll(".filtres button")
   // const works = await getWorks();
    for (let i=0; i< listButton.length; i++){
        listButton[i].addEventListener("click", async () => {
            if (listButton[i].id !== "0"){ 
                 const worksfiltres = works.filter(function(work) {
                    return work.categoryId == listButton[i].id;
                   });
                   await afficherWorks(worksfiltres);
            }
            else {
                await afficherWorks(works); 
            }
        });
    }
}

const galleryimg = document.querySelector(".imgGallery");
async function imgDisplay(works) {
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
   // deleteImages();
  }
  

  async function setGalery(){
    const buttonModifier = document.querySelector(".title span");
    const xmark = document.querySelector(".fa-xmark");
    const Modal = document.querySelector(".modalContainer");
    buttonModifier.addEventListener("click",() =>{
        Modal.style.display= "flex"
        });
    xmark.addEventListener("click",() =>{
        Modal.style.display= "none"
        });
          }
  setGalery();

document.addEventListener("DOMContentLoaded", async () => {
    generateMenuCategory();
    const works = await getWorks();
    await afficherWorks(works);
    filtrerCategory(works); 
    imgDisplay(works);
});

//Modal 

