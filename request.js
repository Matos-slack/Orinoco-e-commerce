

// Produits //

let params = new URLSearchParams(document.location.search.substring(1));
let id = params.get('id'); // variable renvoyant la valeur associé au parametre id.

//Récuperation donnée API
fetch ("http://localhost:3000/api/cameras")
    .then (function (response) {
        if (response.status !== 200) {
            console.log('Problème requete. Code erreur : ' + response.statut);
            return;
        }
        response.json().then(function (data) {
            for (let i = 0; i < data.length; i++) {       //Boucle pour parcourir les valeurs de retour
                let mainContentImage = document.getElementById("camera"); 
                let div = document.createElement("div");
                div.className = "col-4 my-4";
                div.innerHTML =`<div class="card shadow border-0">
                                    <img src="${data[i].imageUrl}" alt="img" class="my-3" height="240px">
                                        <div class="card-body">
                                            <h5 class="card-title">${data[i].name}</h5>
                                            <p class="card-text">${data[i].description}</p>        
                                            <a href="produits.html?id=${data[i]._id}" class="btn btn-primary">Détails</a>                                                                                           
                                        </div>
                                </div> `;       
                mainContentImage.appendChild(div);
            }
        });
    })
    .catch(function (error) {
        console.log('Problème avec fonction fetch : ', error);
    });



//Récupération id des produits API, pour envoyer infos sur page produits.html?id
fetch("http://localhost:3000/api/cameras/"+id).then(function (response) {
        if (response.ok) {
            response.json().then(function (json) {
                document.querySelector("#name").textContent = json.name;
                document.querySelector("#desc").textContent = json.description;
                document.querySelector('.idImage').setAttribute('src', json.imageUrl);
                document.querySelector('#price').textContent = json.price + ' €';
                document.querySelector('.idImage').className = "border border-secondary rounded my-5 productImage";
                document.querySelector('p').className = "my-5 ml-5";

                //Boucle pour tout les objectifs retournés en valeur, on a attribue la valeur des objectifs dans la balise option
                for (let i in json.lenses) {
                    let details = document.querySelector('#lenses');
                    let option = document.createElement("option");
                    option.innerHTML = `<option id="${json.lenses[i]}" value="${json.lenses[i]}" name="${json.lenses[i]}">${json.lenses[i]}</option>`;
                    details.appendChild(option);
                }
            })
        }
})


// Panier //

let panier = document.querySelectorAll('#addPanier');

for (let i = 0; i < panier.length; i++) {
    panier[i].addEventListener('click', function() {                //Evenement au clic sur panier, on applique une fonction panierNumbers
        panierNumbers();
    })
}
    
function chargementPanierNumbers() {                                // Fonction pour garder productNumbers même en rafraichissant la page
    let productNumbers = localStorage.getItem('panierNumbers');
    if (productNumbers) {
        document.querySelector('#compteurPanier').textContent = productNumbers;
    }
}


function panierNumbers() {   
    let productNumbers = localStorage.getItem('panierNumbers');     //Renvoi la valeur associé à la clé panierNumbers sur la variable productNumbers
    productNumbers = parseInt(productNumbers);                      //Change le type de la valeur en nombre
    
    if(productNumbers) {                                            //Si il y a deja une valeur produit dans le localstorage, si productNumbers existe
        localStorage.setItem('panierNumbers', productNumbers + 1);  // Ajoute + 1 à la valeur de la clé panierNumbers du localstorage
        document.querySelector('#compteurPanier').textContent = productNumbers +1;  
    } else {                                                        // Sinon
        localStorage.setItem('panierNumbers', 1);                   // Definit la valeur de la clé du localstorage sur 1
        document.querySelector('#compteurPanier').textContent = 1;
    }
}

chargementPanierNumbers(); 