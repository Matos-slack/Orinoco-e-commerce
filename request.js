
let params = new URLSearchParams(document.location.search.substring(1));
let id = params.get('id');

//Récuperation donnée API
fetch ("http://localhost:3000/api/cameras")
    .then (function (response) {
        if (response.status !== 200) {
            console.log('Problème requete. Code erreur : ' + response.statut);
            return;
        }
        response.json().then(function (data) {
            for (let i = 0; i < data.length; i++) {       //Boucle pour parcourir les données
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

// function product(id) {
//     document.location = 'produits.html?id=' + id;
// }


fetch("http://localhost:3000/api/cameras/"+id).then(function (response) {
        if (response.ok) {
            response.json().then(function (json) {
                document.querySelector("#name").textContent = json.name;
                document.querySelector("#desc").textContent = json.description;
                document.querySelector('.idImage').setAttribute('src', json.imageUrl);
                document.querySelector('#price').textContent = json.price + ' €';
                document.querySelector('.idImage').className = "my-5";
                document.querySelector('p').className = "my-5";
                
                for (let i in json.lenses) {
                    let details = document.querySelector('#lenses');
                    let option = document.createElement("option");
                    option.innerHTML = `<option id="${json.lenses[i]}" value="${json.lenses[i]}" name="${json.lenses[i]}">${json.lenses[i]}</option>`;
                    details.appendChild(option);
                }
            })
        }
})

    