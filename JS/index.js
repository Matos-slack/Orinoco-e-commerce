
// Produits //
let panier = document.querySelectorAll('.add');       //Selection bouton ajoutez au panier
let url = "http://localhost:3000/api/cameras";
let item = {};
let params = new URLSearchParams(document.location.search.substring(1));
document.querySelector('#compteurPanier').textContent = localStorage.getItem('cartNumbers');


//Switch Urls et appel fonction suivant l'url
console.log(window.location.pathname);

 switch (window.location.pathname) {
    case '/C:/Users/tosma/Desktop/Orinoco/JWDP5/index.html':
    case '/JWDP5/':
    case '/index.html':
        console.log('Acceuil');
        list(url);
        break
    case '/C:/Users/tosma/Desktop/Orinoco/JWDP5/produits.html':
    case '/produits.html':
        let id = params.get("id");
        console.log('Produit, id : ' + id);
        id ? produit(id) : notfound();
        break
    case '/C:/Users/tosma/Desktop/Orinoco/JWDP5/panier.html':
    case '/panier.html':
        console.log('Panier');
        afficherPanier();
        document.querySelector('.buy').addEventListener('click', e => {
            e.preventDefault();
            ValidReg();
        })
        break
    case '/C:/Users/tosma/Desktop/Orinoco/JWDP5/order.html':
    case '/order.html':
        let order = params.get("order");
        console.log('Commande n° : ' + order);
        order ? orders(order) : notfound();
}

//Récuperation donnée API
function list(url) {
    fetch(url).then(function (response) {
        if (response.status !== 200) {
            console.log('Problème requete. Code erreur : ' + response.statut);
            return;
        }
        response.json().then(function (data) {
            for (let i = 0; i < data.length; i++) {       //Boucle pour parcourir les valeurs de retour
                let mainContentImage = document.getElementById("camera");
                let div = document.createElement("div");
                div.className = "col-md-4 my-4";
                div.innerHTML = `<div class="card shadow border-0">
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
}

