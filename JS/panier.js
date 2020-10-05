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

    //Gestion quantité produit
    let inputs = document.querySelectorAll('.itemcount');

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("change", (e) => {
            //console.log(e) TEST
            let id = inputs[i].getAttribute('id');
            cartITems[id][0].incart = parseInt(inputs[i].value);
            localStorage.setItem('itemsInCart', JSON.stringify(cartITems));

            if (parseInt(e.target.defaultValue) > parseInt(inputs[i].value)) {
                console.log('-1'); // TEST
                // Soustraire le nombre de camera au total d'objets dans le panier puis ajouter le nombre modifié.
                // Soustraire le prix du produit au total du panier

                let price = localStorage.getItem('totalCost') - cartITems[id][0].price;
                localStorage.setItem('totalCost', price);
                let itemstotal = parseInt(localStorage.getItem('cartNumbers'));
                let numCamera = parseInt(e.target.defaultValue);
                let cameraModifier = cartITems[id][0].incart;

                if (itemstotal > numCamera) {
                    itemstotal = itemstotal - numCamera;
                    itemstotal = itemstotal + cameraModifier;
                    localStorage.setItem('cartNumbers', itemstotal);
                } else if (itemstotal === numCamera) {
                    console.log("c'est le même nombre");
                    itemstotal = cameraModifier;
                    localStorage.setItem('cartNumbers', itemstotal);
                }
            } else if (parseInt(e.target.defaultValue) < parseInt(inputs[i].value)) {
                console.log('+1');  // TEST

                // Ajouter le nombre de camera au total d'objets dans le panier puis ajouter le nombre modifié.
                // Additionner le prix du produit au total du panier

                let price = parseInt(localStorage.getItem('totalCost')) + parseInt(cartITems[id][0].price);
                localStorage.setItem('totalCost', price);
                let itemstotal = parseInt(localStorage.getItem('cartNumbers'));
                let numCamera = parseInt(e.target.defaultValue);
                let cameraModifier = cartITems[id][0].incart;

                if (itemstotal > numCamera) {
                    itemstotal = itemstotal + numCamera;
                    itemstotal = itemstotal + cameraModifier;
                    localStorage.setItem('cartNumbers', itemstotal);
                } else if (itemstotal === numCamera) {
                    console.log("c'est le même nombre");
                    itemstotal = cameraModifier;
                    localStorage.setItem('cartNumbers', itemstotal);
                }
            }
            window.location.reload();
        });
    }
}
