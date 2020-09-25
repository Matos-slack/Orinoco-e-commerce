

// Produits //

let params = new URLSearchParams(document.location.search.substring(1));
let id = params.get('id'); // variable renvoyant la valeur associé au parametre id.
let url = "http://localhost:3000/api/cameras";


//Switch Urls et appel fonction suivant l'url
console.log(window.location.pathname)
switch (window.location.pathname) {
    case '/C:/Users/tosma/Desktop/Orinoco/JWDP5/index.html':
    case '/JWDP5/':
    case '/index.html':
        console.log('Acceuil')
        listing(url)
        break
    case '/C:/Users/tosma/Desktop/Orinoco/JWDP5/produits.html':
    case '/produits.html':
        let id = params.get("id");
        console.log('Produit, id : ' + id)
        id ? prod(id) : notfound()
        break
    case '/C:/Users/tosma/Desktop/Orinoco/JWDP5/panier.html':
    case '/panier.html':
        console.log('Panier')
        displayCart()
        break
    case '/C:/Users/tosma/Desktop/Orinoco/JWDP5/confirm.html':
    case '/confirm.html':
        let confirm = params.get('confirm')
        console.log('Commande numéro : ' + confirm)
        confirm ? confirms(confirm) : notfound()
        break
    case '/C:/Users/tosma/Desktop/Orinoco/JWDP5/order.html':
    case '/order.html':
        let order = params.get("order");
        console.log('Commande n° : ' + order)
        order ? orders(order) : notfound()
}




//Récuperation donnée API
function listing (url) {
    fetch (url).then (function (response) {
            if (response.status !== 200) {
                console.log('Problème requete. Code erreur : ' + response.statut);
                return;
            }
                response.json().then(function (data) {
                    for (let i = 0; i < data.length; i++) {       //Boucle pour parcourir les valeurs de retour
                        let mainContentImage = document.getElementById("camera"); 
                        let div = document.createElement("div");
                        div.className = "col-md-4 my-4";
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
}

function product(id) {
    document.location = 'products.html?id=' + id;
}


//Récupération id des produits API, pour envoyer infos sur page produits.html?id
function prod (id) {
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


// Panier //


let panier = document.querySelectorAll('.add');                     //Selection bouton ajoutez au panier

for (let i = 0; i < panier.length; i++) {
    panier[i].addEventListener('click', function(e) {                //Evenement au clic sur bouton panier
        e.preventDefault();
        cartNum();                                                  // Appel fonction pour nbr article
        cartItems();                                                // Appel fonction pour ajouter un item au panier
    })
}
    
function chargementPanierNumbers() {                                // Fonction pour garder cartNum même en rafraichissant la page
    let cartNumbers = localStorage.getItem('cartNumbers');
    if (cartNumbers) {
        document.querySelector('#compteurPanier').textContent = cartNumbers;
    } else {
        document.querySelector('#compteurPanier').textContent = 0;
    }
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


// Fonction ajout item dans localstorage et panier en fonction de son id

function cartItems() {
    if (localStorage.getItem('itemsInCart') != null) {                     // 1) Si item dans panier sont # de null

        let inCart = JSON.parse(localStorage.getItem('itemsInCart')) ;     // 2) Récuperer les items dans un tableau

        let product = updateproduct();
        total();
        console.log(product);

        let ids = Object.keys(inCart)                                      //retourne un tableau des noms de proprietes de l'objet inCart
            if (ids.indexOf(product[0].id) != -1) {                        //si l'id est déjà dans le panier 
                let i = ids.indexOf(product[0].id);
                let curid = ids[i];
                let info = 0;
                inCart[curid][info].incart += 1;
                localStorage.setItem('itemsInCart', JSON.stringify(inCart))
                // console.log([i]);                                        // 3) Ajouter le nouvel item au tableau product
            } else {
                localStorage.setItem('itemsInCart', JSON.stringify(additem(product[0].id, product, inCart)));    // Ajouter au localstorage
            }

    } else {
        let product = updateproduct();
            total();
            localStorage.setItem('itemsInCart', JSON.stringify(additem(product[0].id, product))) ;   // 4) Ajouter le nouveau tableau dans le localstorage
        }
}

//Fonction mise a jour du produit
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

//Fonction ajout d'un produit
function additem(id, product, json) {
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


//Fonction pour supprimer item panier
function deleteitem(id) {
    let json = JSON.parse(localStorage.getItem('itemsInCart'));
    if (json != null) {
        if (json[id] != undefined) {
            const itemcount = new Promise((resolve, reject) => {
                resolve(json[id][0].incart);
            })
            .then((items) => {
                let num = parseInt(localStorage.getItem('cartNumbers'));
                num = num - items;

                localStorage.setItem('cartNumbers', num);
                let price = json[id][0].price * json[id][0].incart;
                price = parseInt(localStorage.getItem('totalCost')) - price;

                localStorage.setItem('totalCost', price);
                delete json[id];
                localStorage.setItem('itemsInCart', JSON.stringify(json));
            })
        }
        window.location.reload();
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


//Fonction afficher panier 
function displayCart() {
    let cartITems = localStorage.getItem('itemsInCart');
    cartITems = JSON.parse(cartITems);

    let productsInCart = document.querySelector('.cart.additem');
    document.querySelector('#total').textContent = `Total : ${localStorage.getItem('totalCost')}€`;
    console.log(cartITems); // Verification produit présent dans le panier

    if (cartITems && productsInCart) {
        productsInCart.innerHTML = '';

        Object.values(cartITems).map(item => {
            productsInCart.innerHTML += `
                <div class="row">
                    <div class="col-12 col-sm-12 col-md-2 text-center">
                        <img class="img-responsive" src="${item[0].img}" alt="preview appareil" width="100%">
                    </div>

                    <div class="col-12 text-sm-center col-sm-12 text-md-left col-md-6 ml-4">
                        <h4 class="product-name font-weight-bold my-1">${item[0].name}</h4>
                        <p>${item[0].desc}</p>
                    </div>

                    <div class="col-12 col-sm-12 text-sm-center col-md-4 text-md-right row">
                        <div class="col-4 col-sm-3 col-md-6 text-md-right">
                            <h6 class="font-weight-bold mt-2">${item[0].price}<span class="text-muted">€</span></h6>
                        </div>
                        <div class="col-4 col-sm-4 col-md-4 mt-1 text-center">
                            <div class ="quantity">
                                <input id="${item[0].id}" class="itemcount" type = "number" step="1" max="99" min="1" value="${item[0].incart}" title="Qty" class="qty" size = "4" >
                            </div>
                        </div>
                        <div class = "col-4 col-sm-2 col-md-2 text-right">
                            <button id="${item[0].id}" onclick="deleteitem(this.id)" type="button" class="btn btn-outline-danger btn-xs">
                            <i class="fa fa-trash" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
                <hr>
                `
        })
    }

    //Gestion quantité produit
    let inputs = document.querySelectorAll('.itemcount');

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("change", (e) => {
                //console.log(e) test
            let id = inputs[i].getAttribute('id');
            cartITems[id][0].incart = parseInt(inputs[i].value);
            localStorage.setItem('itemsInCart', JSON.stringify(cartITems));
            console.log(inputs[i].value);

            if (parseInt(e.target.defaultValue) > parseInt(inputs[i].value)) {
                console.log('-1');
                /*Prendre le nombre de camera le soustraire au total d'objets dans le panier puis ajouter le nombre modifier.*/
                /*Prendre le prix du produit et le soustraire au total */

                let price = localStorage.getItem('totalCost') - cartITems[id][0].price;
                localStorage.setItem('totalCost', price);
                let itemstotal = parseInt(localStorage.getItem('cartNumbers'))
                let numCamera = parseInt(e.target.defaultValue)
                let cameraModifier = cartITems[id][0].incart
                if (itemstotal > numCamera) {
                    itemstotal = itemstotal - numCamera
                    itemstotal = itemstotal + cameraModifier
                    localStorage.setItem('cartNumbers', itemstotal)
                } else if (itemstotal === numCamera) {
                    console.log("c'est le même nombre")
                    itemstotal = cameraModifier
                    localStorage.setItem('cartNumbers', itemstotal)
                }
            } else if (parseInt(e.target.defaultValue) < parseInt(inputs[i].value)) {
                console.log('+1')

                /*Prendre le nombre de camera l'ajouter au total d'objets dans le panier puis ajouter le nombre modifier.*/
                /*Prendre le prix du produit et l'additionner au total */

                let price = parseInt(localStorage.getItem('totalCost')) + parseInt(cartITems[id][0].price)
                localStorage.setItem('totalCost', price)
                let itemstotal = parseInt(localStorage.getItem('cartNumbers'))
                let numCamera = parseInt(e.target.defaultValue)
                let cameraModifier = cartITems[id][0].incart
                if (itemstotal > numCamera) {
                    itemstotal = itemstotal + numCamera
                    itemstotal = itemstotal + cameraModifier
                    localStorage.setItem('cartNumbers', itemstotal)
                } else if (itemstotal === numCamera) {
                    console.log("c'est le même nombre")
                    itemstotal = cameraModifier
                    localStorage.setItem('cartNumbers', itemstotal)
                }
            }
            window.location.reload()
        });
    }
}




//Fonction confirmation commande prenant id comme parametre

function ValidCart(inputs) {
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch("http://localhost:3000/api/cameras/order", options)
        .then((response) => { response.json()
        .then((data) => {
            console.log(data);
            localStorage.setItem('order', JSON.stringify(data));
            document.location = 'order.html?order=' + data.orderId;
        }
        )}
)}

//test requete POST



chargementPanierNumbers(); 