
const grid = document.querySelector('.products-grid');

async function loadProducts() {
    
    const response = await fetch('./data.json');
    const products = await response.json();

   
    products.forEach(item => {
        grid.innerHTML += `
                <div class="products-card">
                    <div class="products-header">
                        <img src="${item.image.desktop}" alt="${item.name}">
                        <div class="button-container" data-name="${item.name}">
                        <button class="add-to-cart-btn">
                            <img src="./assets/images/icon-add-to-cart.svg" alt="">
                            <span>Add to Cart</span>
                        </button>
                         <div class="quantity-control hidden">
                            <button class="decrement" data-name="${item.name}">
                            <img src="./assets/images/icon-decrement-quantity.svg" alt="-">
                            </button>
                            <span class="quantity-value">1</span>
                            <button class="increment" data-name="${item.name}">
                            <img src="./assets/images/icon-increment-quantity.svg" alt="+">
                        </div>
                        </div>
                    </div>
                    <div class="products-info">
                        <p class="category">${item.category}</p>
                        <h3 class="product-name">${item.name}</h3>
                        <p class="price">$${item.price}</p>
                    </div>
                </div>
            `;
    });
}
loadProducts();

let cart = [];

grid.addEventListener('click', (e) => {
    addBtn = e.target.closest('.add-to-cart-btn');
    if (addBtn) {
        const container = addBtn.parentElement;
        const productCard = container.closest('.products-card');
        const name = productCard.querySelector('.product-name').textContent;
        const priceText = productCard.querySelector('.price').textContent;
        const price = parseFloat(priceText.replace('$', ''));
        
        
        const productImg = productCard.querySelector('img');
        cart.push({ name, price, quantity: 1 });
        

        addBtn.classList.add('hidden');
        container.querySelector('.quantity-control').classList.remove('hidden');
        productImg.classList.add('selected-border');

        RenderCart();
    }

    const incBtn = e.target.closest('.increment');
    if (incBtn) {
        const productCard = incBtn.closest('.products-card');
        const name = productCard.querySelector('.product-name').textContent;
        const item = cart.find(i => i.name === name);
        if (item) {
            item.quantity += 1;
            incBtn.parentElement.querySelector('.quantity-value').textContent = item.quantity;
            RenderCart();
        }
        let valSpan = incBtn.parentElement.querySelector('.quantity-value');
        valSpan.textContent = parseInt(valSpan.textContent) + 1;
    }

    const decBtn = e.target.closest('.decrement');
    if (decBtn) {
        const productCard = decBtn.closest('.products-card');
        const name = productCard.querySelector('h3').textContent;
        const itemIndex = cart.findIndex(i => i.name === name);
        if (itemIndex > -1) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                cart.splice(itemIndex, 1);
            }
            RenderCart();
        }
        let valSpan = decBtn.parentElement.querySelector('.quantity-value');
        let currentVal = parseInt(valSpan.textContent);

        if (currentVal > 1) {
            valSpan.textContent = currentVal - 1;
        } else {

            const container = decBtn.parentElement.parentElement;
            container.querySelector('.add-to-cart-btn').classList.remove('hidden');
            container.querySelector('.quantity-control').classList.add('hidden');
            productCard.querySelector('img').classList.remove('selected-border');
        }
    }
});

function RenderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const сartSectionEmpty = document.querySelector('.cart-section-empty');
    const cartSection = document.querySelector('.cart-section');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCount.textContent = `(${count})`;

    if (cart.length === 0) {
        сartSectionEmpty.classList.remove('hidden');
        cartSection.classList.add('hidden');
    } else {
        сartSectionEmpty.classList.add('hidden');
        cartSection.classList.remove('hidden');
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
        <p>${item.name}</p>
        <div class="cart-item-info"> 
                <span> $${item.quantity} x $${item.price.toFixed(2)}</span>
            </div>
            <span> $${(item.quantity * item.price).toFixed(2)}</span>
        </div>
    `).join('');
}
