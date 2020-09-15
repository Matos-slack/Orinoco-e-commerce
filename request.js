// const { response } = require("express");

// function get (url) {
//     return new Promise((resolve, reject) => {
//         var request = new XMLHttpRequest();
//         request.onreadystatechange = function() {
//             if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
//                 var response = JSON.parse(this.responseText);
//                 resolve(response);
//             }
//         };
//         request.open("GET", url);
//         request.send(); 
//     }) 
// } 

// var data = get("http://localhost:3000/api/cameras").then((data) => {
//     console.log(data);
// });




// //Création element Img
// let imgOne = document.createElement("img");
// //Pointage vers id cameraOne
// let firstCamera = document.querySelector('#cameraOne');
// //Ajout du noeud img enfant à cameraOne
// firstCamera.appendChild(imgOne);
// //Html du nouveau noeud en ajoutant une cible à img
// firstCamera.innerHTML = '<img class = "first"> <div class = "card-body">';



// //Pointage vers class first
// let firstImg = document.querySelector(".first");
// //Modification style nouveau noeud
// firstImg.style.height = '300px';
// //Ajout d'une class au nouveau noeud
// firstImg.classList.add("my-3");


// let name = document.createElement("div");
// let nameCameraOne = document.querySelector('.card-body');
// nameCameraOne.appendChild(name);
// nameCameraOne.innerHTML = '<a href="produits.html" class="stretched-link"></a> <h5 class="card-title"></h5> <p class="card-text"></p>';




//Récuperation donnée API
fetch ("http://localhost:3000/api/cameras")
    .then (function (response) {
        if (response.status !== 200) {
            console.log('Problème requete. Code erreur : ' + response.statut);
            return;
        }
        //Examine le txt de la réponse
        response.json().then(function (data) {
            for (let i = 0; i < data.length; i++) {       //Boucle pour parcourir les données
                let mainContentImage = document.getElementById("camera"); 
                let div = document.createElement("div");
                div.innerHTML =`<div class="card col-12 col-md-4 mx-auto my-4 shadow border-0">
                                    <img src="${data[i].imageUrl}" alt="img" class="my-3" height="240px">
                                        <div class="card-body">
                                            <a href="produits.html" class="stretched-link"></a>
                                            <h5 class="card-title">${data[i].name}</h5>
                                            <p class="card-text">${data[i].description}</p>
                                        </div>
                                </div>
                                `
                mainContentImage.appendChild(div); 
            }
        });
    })
    .catch(function (error) {
        console.log('Problème avec fonction fetch : ', error);
    });


//Faire fonction qui parcours les _id de l'API et qui renvoi sur page produit le resultat au clic souris
