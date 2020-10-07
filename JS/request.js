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
        produit(id);
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
        orders(order);
}


for (let i = 0; i < panier.length; i++) {
    panier[i].addEventListener('click', function (e) {                  //Evenement au clic sur bouton panier
        e.preventDefault();
        cartNum();                                                      // Appel fonction pour nbr article
        itemPanier();                                                   // Appel fonction pour ajouter un item au panier
    })
}

// Recupere donnée API et affiche les produits sur page index.html
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

// Fonction ajout item dans localstorage et propireté incart en fonction de son id
function itemPanier() {
    if (localStorage.getItem('itemsInCart') != null) {                      // Si item dans panier sont # de null
 
        let inCart = JSON.parse(localStorage.getItem('itemsInCart'));       // Récuperer les items dans un tableau

        let product = updateproduct();
        total();
        console.log(product);                                               // Affiche les infos du produits cliqué

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

// Fonction validation formulaire, si Ok renvoi vers page order avec les valeurs correspondantes
function ValidReg() {
    let inputs = document.querySelectorAll('input.form-control');
    let data = {};
    let valid = true;
    let regex = {
        "mail": /([\w-\.]+@[\w-\.]+\.{1}[\w]+)/i, // Adresse Mail
        "text": /^\S[a-z ,.'à-ÿ-]+$/i, // Nom, Prénom, Ville
        "postal": /^[0-9]{1,5}[A-z0-9 'à-ÿ-]{5,30}$/i // Adresse postale
    }
    inputs.forEach(input => {
        let validation = false;
        if (input.name == "name" || input.name == "lastname" || input.name == "city")
            validation = validForm(regex.text.test(input.value), input);
        else if (input.name == "email")
            validation = validForm(regex.mail.test(input.value), input);
        else if (input.name == "adress")
            validation = validForm(regex.postal.test(input.value), input);
        if (!validation)
            valid = false;
    });

    if (valid) {
        console.log('test envoi');
        let pducts = JSON.parse(localStorage.getItem('itemsInCart'));
        data = {
            'contact': {
                'firstName': inputs[0].value,
                'lastName': inputs[1].value,
                'address': inputs[3].value,
                'city': inputs[4].value,
                'email': inputs[2].value
            },
            'products': [

            ]
        }

        // Recupération des proprietés et valeurs du produits dans le panier
        Object.keys(pducts).map(pdt => {
            for (let i = 0; i < pducts[pdt].length; i++) {
                const e = pducts[pdt][i];
                if (e.incart > 1) {
                    for (let x = 0; x < e.incart; x++) {
                        data.products.push(e.id);
                    }
                } else {
                    data.products.push(e.id);
                }
            }
        })
        console.log(data)
        // Ici le Post et localstorage
        let posturl = "http://localhost:3000/api/cameras/order"
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        fetch(posturl, options).then((response) => {

            response.json().then((data) => {
                console.log(data);
                localStorage.setItem('order', JSON.stringify(data));
                localStorage.removeItem('cartNumbers');
                localStorage.removeItem('totalCost');
                localStorage.removeItem('itemsInCart');
                document.location = 'order.html?order=' + data.orderId;
            });
        })
    }
}

// Fonction ajout ou suppression validation formulaire
function validForm(Regtest, input) {
    if (Regtest) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
    }
    return false;
}

// Fonction qui supprime un produit que ce soit sur la nav bar, bouton supprimer(produit), gérer les quantitées
function cartNumDeleted() {
    let numbers = parseInt(localStorage.getItem('cartNumbers'));

    if (numbers) {
        localStorage.setItem('cartNumbers', numbers - 1);
        document.querySelector('#compteurPanier').textContent = numbers - 1;

    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('#compteurPanier').textContent = 1;
    }
}

//Fonction pour supprimer item panier
function deleteItem(id) {
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

//Fonction afficher panier 
function afficherPanier() {
    let cartITems = localStorage.getItem('itemsInCart');
    cartITems = JSON.parse(cartITems);

    let productsInCart = document.querySelector('.cart.additem');
    document.querySelector('#total').textContent = `Total : ${localStorage.getItem('totalCost')}€`;
    console.log(cartITems);            // Verification produit présent dans le panier TEST

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
                            <button id="${item[0].id}" onclick="deleteItem(this.id)" type="button" class="btn btn-outline-danger btn-xs">
                            <i class="fa fa-trash" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
                <hr>
                `
        })
    }

     //Boucle pour gérer le nombres de produits dans le panier ainsi que le prix total
    let inputs = document.querySelectorAll('.itemcount');

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("change", (e) => {
            console.log(e);
            let id = inputs[i].getAttribute('id');
            cartITems[id][0].incart = parseInt(inputs[i].value);
            localStorage.setItem('itemsInCart', JSON.stringify(cartITems));

            if (parseInt(e.target.defaultValue) > parseInt(inputs[i].value)) {
                console.log('-1');
                //Prendre le nombre de caméras le soustraire au total d'objets dans le panier puis ajouter le nombre modifier
                //Prendre le prix du produit et le soustraire au total

                let price = localStorage.getItem('totalCost') - cartITems[id][0].price;
                localStorage.setItem('totalCost', price);

                let itemstotal = parseInt(localStorage.getItem('cartNumbers'));
                let numCam = parseInt(e.target.defaultValue);
                let camModify = cartITems[id][0].incart;
                cartNumDeleted();

                if (itemstotal > numCam) {
                    itemstotal = itemstotal - numCam;
                    itemstotal = itemstotal + camModify;
                    localStorage.setItem('cartNumbers', JSON.stringify(itemstotal));

                } else if (itemstotal === numCam) {
                    console.log("c'est le même nombre");
                    itemstotal = camModify;
                    localStorage.setItem('cartNumbers', itemstotal);

                }
                 //Prendre le nombre de caméras l'additonner au total d'objets dans le panier puis ajouter le nombre modifier
                 //Prendre le prix du produit et l'additionner au total
            } else if (parseInt(e.target.defaultValue) < parseInt(inputs[i].value)) {
                console.log('+1');
                let price = parseInt(localStorage.getItem('totalCost')) + parseInt(cartITems[id][0].price);
                localStorage.setItem('totalCost', price);
                cartNum()

            }
            window.location.reload()   //Rechargement page pour compteur panier
        });
    }
}

//Fonction affichage page order
function orders(id) {
    let order = JSON.parse(localStorage.getItem('order'));
    if (id == order.orderId) {
        document.querySelector('.orderid').textContent = `Commande n° : ${order.orderId}`
        let total = 0;
        Object.values(order.products).map(items => {
            document.querySelector('#products').innerHTML += `<tr>
                                                                <th scope="row col-sm-3">${items._id}</th>
                                                                <td>${items.name}</td>
                                                                <td>${items.price / 100 + '€'}</td>
                                                              </tr>`
            total += items.price;
        })
        document.querySelector('.price').textContent = `Prix total : ${total / 100 + '€'}`;
        document.querySelector('#thanks').textContent = `Merci ${order.contact.lastName} pour votre commande`;
    }
}





