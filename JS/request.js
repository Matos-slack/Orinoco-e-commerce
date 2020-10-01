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


for (let i = 0; i < panier.length; i++) {
    panier[i].addEventListener('click', function (e) {                //Evenement au clic sur bouton panier
        e.preventDefault();
        cartNum();                                                  // Appel fonction pour nbr article
    itemPanier();                                                   // Appel fonction pour ajouter un item au panier
    })
}


// Fonction nombre item dans le panier
function cartNum() {
    let num = parseInt(localStorage.getItem('cartNumbers'));
    if (num) {
        localStorage.setItem('cartNumbers', num + 1);
        document.querySelector('#compteurPanier').textContent = num + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('#compteurPanier').textContent = 1;
    }
}

//Fonction pour faire total item dans panier
function total() {
    let product = updateproduct();
    let cartCost = localStorage.getItem('totalCost');
    if (cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost', cartCost + product[0].price);
    } else {
        localStorage.setItem('totalCost', product[0].price);
    }
}

function notfound() {
    document.location = '404.html';
}




