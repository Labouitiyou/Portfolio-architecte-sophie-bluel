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

// Récupérer les catégories //
async function getCategory(){
const reponse = await fetch("http://localhost:5678/api/categories");
const categorys= await reponse.json();
return categorys;
}

// Génerer dynamiquement le menu de catégories//
async function generateMenuCategory()
{
    const categorys = await getCategory();
    for (let i=0; i<categorys.length; i++) {
    const button= document.createElement("button");
    button.textContent = categorys[i].name;
    button.id= categorys[i].id;
    filtres.appendChild(button);
     }
}

 // Ajout des filtres pour afficher les travaux par catégorie 
async function filtrerCategory(){
    const listButton= document.querySelectorAll(".filtres button")
    const works = await getWorks();
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
document.addEventListener("DOMContentLoaded", async () => {
    await generateMenuCategory();
    const works = await getWorks();
    await afficherWorks(works); 
    await filtrerCategory();
});


