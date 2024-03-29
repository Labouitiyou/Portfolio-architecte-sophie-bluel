const gallery = document.querySelector(".gallery");

//Récupération des works //

async function getworks() {
const reponse = await fetch("http://localhost:5678/api/works");
return await reponse.json();
}
//const workslist= getworks();

//Affichage des works //
async function afficherworks(works){
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

afficherworks(works);

