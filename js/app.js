// I define the variables, arrays and objects
let spinnerContainer = document.getElementById('spinner')
let loadingLayout = document.querySelector('.loadingLayout')
let heroContainer = document.querySelector('.heroContainer')
let categoriesContainer = document.querySelector('.categoriesContainer')
let initLayout = document.querySelector('.initLayout')
let btnCategories = document.querySelectorAll('.btnCategories')
let categoryRenderContainer = document.querySelector('.categoryRenderContainer')
let modalContainer = document.querySelector('.modalContainer')
let cartLogo = document.querySelector('.cartLogo')
let cartContainer = document.querySelector('.cartContainer')
let cartContainerList = document.querySelector('.cartContainerList')
let cartNumber = document.querySelector('.cartNumber')
let footer = document.querySelector('footer')
let emptyCartInit = document.querySelector('.emptyCartInit')
let totalPrice 
let number

let heroProduct =  {}
let product = {}
let productBought = {}

let products = []
let electronics = []
let jewelery = []
let men = []
let women = []
let cart = JSON.parse(localStorage.getItem('cart')) || []

// The app display and spinner for 2 seconds and then init the first layout
setTimeout(() => {
    if(loadingLayout == null) {
        return
    }
        loadingLayout.style.display = 'none'
        initLayout.style.display = 'block'
        footer.style.display = 'block'
    }, 2000)

// First the app hits the API and renders the hero product and call the categories function
const heroProductRender = () => {
    if(heroContainer == null) {
        return
    }
    fetch('https://fakestoreapi.com/products/1')
            .then(res=>res.json())
            .then(json=> {
                    heroProduct = {
                        title: json.title,
                        url: json.image,
                        price: json.price,
                        description: json.description
                    }
                    heroContainer.innerHTML = `
                        <div class="heroDescriptionContainer">
                            <h1>${heroProduct.title}</h1>
                            <p>${heroProduct.description}</p>
                            <button class="btn btnHero" onclick="addToCart('${heroProduct.price}','${heroProduct.title}','${heroProduct.url}')">Buy</button>
                        </div>
                        <div class="heroImgContainer">
                            <img class="heroImg" src=${heroProduct.url} alt="">
                        </div>
                    `
                })
            Categories()
        }

// This function creates a new array of objects for each category
const Categories = () => {
    fetch('https://fakestoreapi.com/products')
            .then(res=>res.json())
            .then(json=> {
                json.forEach(e => {
                    product = {
                        id: e.id,
                        title: e.title,
                        category: e.category,
                        url: e.image,
                        description: e.description,
                        price: e.price
                    }
                    products.push(product)
                    electronics = products.filter(e => e.category == "electronics")
                    jewelery = products.filter(e => e.category == "jewelery")
                    men = products.filter(e => e.category == "men's clothing")  
                    women = products.filter(e => e.category == "women's clothing")    
                })})
    }   

// Depending on the category clicked on the first screen, the app renders the specific products, sending an array of objects as a function parameter
const CategoryProducts = (e) => {
    if(e.getAttribute('name') == 'electronics') {
        renderCategoryProducts(electronics)
    } else if(e.getAttribute('name') == 'jewelery') {
        renderCategoryProducts(jewelery)
    } else if(e.getAttribute('name') == 'men') {
        renderCategoryProducts(men)
    } else if(e.getAttribute('name') == 'women') {
        renderCategoryProducts(women)
    }
}
btnCategories.forEach(e => e.addEventListener('click', ()=> CategoryProducts(e) ))

// The specifics products of a category are render
const renderCategoryProducts = (el) => {
    initLayout.style.display = 'none'
    categoryRenderContainer.style.display = 'flex'
    if(categoryRenderContainer.innerHTML != '') {
        categoryRenderContainer.innerHTML = ''
    }
    el.forEach(item => {
        categoryRenderContainer.innerHTML += `
            <div class="card" style="width: 18rem;">
                <div class="imgProductContainer">
                    <img src="${item.url}" alt="${item.title}">
                </div>
                <div class="card-body">
                    <h5 class="card-title productTitle">${item.title}</h5>
                    <p class="card-text price"><strong>$${item.price}</strong></p>
                    <div class="btnCategoriesContainer">
                        <button type="button" class="btn btn-primary btnCategories" data-bs-toggle="modal" data-bs-target="#modal${item.id}">
                            Buy
                        </button>
                    </div>
                </div>
            </div>
            <!-- Modal -->
            <div class="modal fade modal-lg" id="modal${item.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    <img class="imgModal" src="${item.url}" alt="${item.title}">
                    <h5 class="modal-title" id="exampleModalLabel"><strong>${item.title}</strong></h5>
                </div>
                <div class="modal-body">
                    <p class="card-text">${item.description}</p>
                    <p class="card-text price">$${item.price}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary btnAddToCart" onclick="addToCart('${item.price}','${item.title}','${item.url}')">Add to card</button>
                </div>
                </div>
            </div>
            </div>
        `
    })
}

// The bought products are save in an object and pushed into an array. The array is saved in the storage
const addToCart = (price, title, url) => {
    productBought = {
        price: price,
        title: title,
        url: url
    }
    cart.push(productBought)
    localStorage.setItem('cart', JSON.stringify(cart))
    productsNumber()
}

// The products saved in the storage are passed into and array and then are render in the cart page
// Apart from the products, a cart clear and a buy button are render
const cartProductsRender = () => {
    cart =  JSON.parse(localStorage.getItem('cart'))
    totalPrice = 0
    if(cart == null) {
        return
    }
    emptyCartInit.style.display = 'none'
    cart.forEach(e => {
        cartContainerList.innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto ">
                <div class="fw-bold">${e.title}</div>
                <img class="cartImg" src="${e.url}" alt="${e.title}">
            </div>
            <div class="cartItemPriceContainer"> 
                <span class="badge bg-primary rounded-pill cartItemPrice" >$${e.price}</span>
            </div>
        </li>
` 
    totalPrice += parseFloat(e.price)
    })
    totalPriceRender = document.createElement("div")
    totalPriceRender.innerHTML = `
        <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">Total</div>
            </div>
            <span class="badge bg-primary rounded-pill cartItemPrice">$${totalPrice.toFixed(2)}</span>
        </li>
        <div class="cartButtonsContainer">
            <button class="btn btnReset btnCategories" onclick="resetCart()">Reset</button>
            <button class="btn btnCartBuy btnCategories">Buy</button>
        </div>
        `
    cartContainerList.append(totalPriceRender)
    console.log(totalPrice)
}

// The number of items bought are displayed 
const productsNumber = () => {
    number = cart.length
    cartNumber.innerText = number
}

// when clear cart button is hit, the cart is reset
const resetCart = () => {
    cartContainerList.innerHTML = '<div class="emptyCart"><p>No tienes Items agregados en el carrito</p></div>'
    let number = 0
    cartNumber.innerText = number
    localStorage.clear()
}

heroProductRender()
productsNumber()