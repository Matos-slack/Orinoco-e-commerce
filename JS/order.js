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

