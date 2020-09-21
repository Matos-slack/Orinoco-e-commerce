

// Produits //

let params = new URLSearchParams(document.location.search.substring(1));
let id = params.get('id'); // variable renvoyant la valeur associé au parametre id.
let url = "http://localhost:3000/api/cameras";


//Switch Urls
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
}



//Récupération id des produits API, pour envoyer infos sur page produits.html?id
function prod (id) {
    fetch(url + '/' + id).then(function (response) {
            if (response.ok) {
                response.json().then(function (json) {
                    document.querySelector("#name").textContent = json.name;
                    document.querySelector("#desc").textContent = json.description;
                    document.querySelector('.idImage').setAttribute('src', json.imageUrl);
                    document.querySelector('#price').textContent = json.price + ' €';
                    document.querySelector('.idImage').className = "border border-secondary rounded my-5 productImage";
                    document.querySelector('p').className = "my-5 ml-5";
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

// let products = [
//    {
//     name : 'Zurss 50',
//     id : "5be1ed3f1c9d44000030b061",
//     lenses : "35mm 1.4",
//     imageUrl : "http://localhost:3000/images/vcam_1.jpg",
//     price : 49900,
//     inCart : 0
//    },
//    {
//     name : 'Hirch 400DTS',
//     id : "5be1ef211c9d44000030b062",
//     lenses : "50mm 1.8",
//     imageUrl : "http://localhost:3000/images/vcam_2.jpg",
//     price : 30900,
//     inCart : 0
//    }
// ]

let panier = document.querySelectorAll('.add');

for (let i = 0; i < panier.length; i++) {
    panier[i].addEventListener('click', function(e) {                //Evenement au clic sur panier, on applique une fonction panierNumbers qui determine le produit cliqué
        e.preventDefault();
        cartNum();
        cartItems();
    })
}
    
function chargementPanierNumbers() {                                // Fonction pour garder productNumbers même en rafraichissant la page
    let cartNumbers = localStorage.getItem('cartNumbers');
    if (cartNumbers) {
        document.querySelector('#compteurPanier').textContent = cartNumbers;
    } else {
        document.querySelector('#compteurPanier').textContent = 0;
    }
}


// function panierNumbers(product) {  
//     let productNumbers = localStorage.getItem('panierNumbers');     //Renvoi la valeur associé à la clé panierNumbers sur la variable productNumbers
//     productNumbers = parseInt(productNumbers);                      //Change le type de la valeur en nombre
    
//     if(productNumbers) {                                            //Si il y a deja une valeur produit dans le localstorage, si productNumbers existe
//         localStorage.setItem('panierNumbers', productNumbers + 1);  // Ajoute + 1 à la valeur de la clé panierNumbers du localstorage
//         document.querySelector('#compteurPanier').textContent = productNumbers +1;  
//     } else {                                                        // Sinon
//         localStorage.setItem('panierNumbers', 1);                   // Definit la valeur de la clé du localstorage sur 1
//         document.querySelector('#compteurPanier').textContent = 1;
//     }
//     setItems(product);
// }

// function setItems(product) {                                       // Fonction ajout Item au panier
//     let panierItems = localStorage.getItem('productsInCart');
//     panierItems = JSON.parse(panierItems);

//     if (panierItems != null) {

//         if(panierItems[product.id] == undefined) {
//             panierItems = {
//                 ...panierItems,
//                 [product.id]: product
//             }
//         }
//         panierItems[product.id].inCart += 1;
//     } else {
//         product.inCart = 1;
//         panierItems = {
//             [product.id]: product
//         }
//     }

//     localStorage.setItem("productsInCart", JSON.stringify(panierItems));
// }

function cartNum() {
    let num = parseInt(localStorage.getItem('cartNumbers'))
    if (num) {
        localStorage.setItem('cartNumbers', num + 1)
        document.querySelector('#compteurPanier').textContent = num + 1;
    } else {
        localStorage.setItem('cartNumbers', 1)
        document.querySelector('#compteurPanier').textContent = 1;
    }
}



function cartItems() {
    // 1) Verifier s'il y a déjà des items dans le panier
    // 2) Récuperer les items dans un tableau
    // 3) Ajouter le nouvel item au tableau
    // 4) Ajouter le nouveau tableau dans le localstorage
    if (localStorage.getItem('itemsInCart') != null) {

        let inCart = JSON.parse(localStorage.getItem('itemsInCart'))

        let product = updateproduct()
        total()

        let ids = Object.keys(inCart)
        if (ids.indexOf(product[0].id) != -1) { //si l'id est déjà dans le panier
            let i = ids.indexOf(product[0].id)
            let curid = ids[i]

            // let info = existcolor(inCart, curid, product[0].color)
            let info = 0


            if (info === false) {
                console.log('la couleur : ' + product[0].color + " n'est pas dans le panier")
                localStorage.setItem('itemsInCart', JSON.stringify(inCart))
            } else {
                console.log('la couleur : ' + inCart[curid][info].color + ' est déjà dans le panier')
                inCart[curid][info].incart += 1
                localStorage.setItem('itemsInCart', JSON.stringify(inCart))
            }
        } else {
            localStorage.setItem('itemsInCart', JSON.stringify(additem(product[0].id, product, inCart)))
        }

    } else {
        let product = updateproduct()
        total()
        localStorage.setItem('itemsInCart', JSON.stringify(additem(product[0].id, product)))
    }

}


function updateproduct() {
    let product = [{
        name: $("#name").text(),
        desc: $("#desc").text(),
        img: $(".idImage").attr('src'),
        price: parseInt($("#price").text()),
        id: $(".add").attr('id'),
        incart: 1
    }]
    return product
}


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
    return item
}


function deleteitem(id) {
    let json = JSON.parse(localStorage.getItem('itemsInCart'))
    if (json != null) {
        if (json[id] != undefined) {
            const itemcount = new Promise((resolve, reject) => {
                resolve(json[id][0].incart)
            }).then((items) => {
                let num = parseInt(localStorage.getItem('cartNumbers'))
                num = num - items
                localStorage.setItem('cartNumbers', num)
                let price = json[id][0].price * json[id][0].incart
                price = parseInt(localStorage.getItem('totalCost')) - price
                localStorage.setItem('totalCost', price)
                delete json[id]
                localStorage.setItem('itemsInCart', JSON.stringify(json))
            })
        }
        window.location.reload()
    }
}


function total() {
    let product = updateproduct()
    let cartCost = localStorage.getItem('totalCost')
    if (cartCost != null) {
        cartCost = parseInt(cartCost)
        localStorage.setItem('totalCost', cartCost + product[0].price)
    } else {
        localStorage.setItem('totalCost', product[0].price)
    }
}

function displayCart() {
    let cartITems = localStorage.getItem('itemsInCart')
    cartITems = JSON.parse(cartITems)
    let productsInCart = document.querySelector('.cart.additem')
    document.querySelector('#total').textContent = `Total : ${localStorage.getItem('totalCost')} €`
    if (cartITems && productsInCart) {
        productsInCart.innerHTML = ''
        Object.values(cartITems).map(item => {
            productsInCart.innerHTML += `
                <div class="row">
                    <div class="col-12 col-sm-12 col-md-2 text-center">
                        <img class="img-responsive" src ="${item[0].img}" alt="prewiew" width="100%">
                    </div>
                    <div class="col-12 text-sm-center col-sm-12 text-md-left col-md-6">
                        <h4 class="product-name font-weight-bold my-1">${item[0].name}</h4>
                        <p>${item[0].desc}</p>
                    </div>
                    <div class="col-12 col-sm-12 text-sm-center col-md-4 text-md-right row">
                        <div class="col-3 col-sm-3 col-md-6 text-md-right">
                            <h6>${item[0].price} <span class="text-muted"> € </span></h6>
                        </div>
                        
                        <div class = "col-2 col-sm-2 col-md-2 text-right">
                            <button id="${item[0].id}" onclick="deleteitem(this.id)" type="button" class="btn btn-outline-danger btn-xs">
                            <i class="fa fa-trash" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
                <hr>
                `
        })
    }
}
chargementPanierNumbers(); 