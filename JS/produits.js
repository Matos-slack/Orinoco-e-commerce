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

//Fonction renvoi des éléments de proprieté des produits
function updateproduct() {
    let product = [{
        name: $("#name").text(),
        desc: $("#desc").text(),
        img: $("img").attr('src'),
        price: parseInt($("#price").text()),
        id: $(".add").attr('id'),
        incart: 1
    }]

    return product;

}

// Fonction ajout item dans localstorage et panier en fonction de son id

function itemPanier() {
    if (localStorage.getItem('itemsInCart') != null) {                      // 1) Si item dans panier sont # de null
 
        let inCart = JSON.parse(localStorage.getItem('itemsInCart'));       // 2) Récuperer les items dans un tableau

        let product = updateproduct();
        total();
        console.log(product);

        let ids = Object.keys(inCart);                                      // Retourne un tableau des noms de proprietes de l'objet inCart
        if (ids.indexOf(product[0].id) != -1) {                             // Si l'id est déjà dans le panier 
            let i = ids.indexOf(product[0].id);
            let curid = ids[i];
            let info = 0;
            inCart[curid][info].incart += 1;
            localStorage.setItem('itemsInCart', JSON.stringify(inCart));    // 3) Ajouter le nouvel item au tableau product
            // console.log([i]);  TEST                                      
        } else {
            localStorage.setItem('itemsInCart', JSON.stringify(addItem(product[0].id, product, inCart)));    // Ajouter au localstorage
        }

    } else {
        let product = updateproduct();
        total();
        localStorage.setItem('itemsInCart', JSON.stringify(addItem(product[0].id, product)));   // 4) Ajouter le nouveau tableau dans le localstorage
    }
}

//Fonction ajout d'un produit
function addItem(id, product, json) {
    if (json != null) {
        if (json[id] === undefined) {
            item = {
                ...json,
                [id]: product
            }
        }
    } else {
        item = {
            [id]: product
        }
    }
    return item;
}

function product(id) {
    document.location = 'products.html?id=' + id;
}


//Récupération id des produits API, pour envoyer infos sur page produits.html?id
function produit(id) {
    fetch(url + '/' + id).then(function (response) {
        if (response.ok) {
            response.json().then(function (json) {
                document.querySelector("#name").textContent = json.name;
                document.querySelector("#desc").textContent = json.description;
                document.querySelector('img').setAttribute('src', json.imageUrl);
                document.querySelector('.idImage').setAttribute('src', json.imageUrl);
                document.querySelector('#price').textContent = json.price / 100 + ' €';
                document.querySelector('#price').className = "font-weight-bold my-5 ml-5";
                document.querySelector('.idImage').className = "img-fluid border border-secondary rounded my-5 productImage";
                document.querySelector('p').className = "my-5 ml-5 h3";
                document.querySelector('.add').setAttribute('id', json._id);

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
