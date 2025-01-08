document.addEventListener('DOMContentLoaded', () => {
    // Get the product ID from the URL (Product Details Page)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'), 10);

    // Check if productId exists and is a valid number
    if (isNaN(productId)) {
        alert('Invalid product ID!');
        window.location.href = 'index.html'; // Redirect to homepage if invalid ID
        return;
    }

    // Fetch product data from JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            // Find the product by ID
            const product = products.find(p => p.id === productId);

            if (product) {
                // Populate main product details
                document.getElementById('main-product-image').src = product.image;
                document.getElementById('product-name').textContent = product.name;
                document.getElementById('product-price').textContent = `$${product.price}`;
                document.getElementById('product-category').textContent = `Category: ${product.category}`;
                document.getElementById('Specifications').textContent = `Specifications: ${product.Specifications || 'Not available'}`;
                document.getElementById('product-rating').innerHTML = `⭐ ${product.rating}`;

                // Load product images in carousel
                document.getElementById('image-1').src = product.images[0];
                document.getElementById('image-2').src = product.images[1];
                document.getElementById('image-3').src = product.images[2];

                // Add to cart functionality
                document.getElementById('add-to-cart').addEventListener('click', () => {
                    addToCart(product);
                    alert(`${product.name} has been added to your cart!`);
                    updateCartCount();
                });

                // Buy now functionality
                document.getElementById('buy-now').addEventListener('click', () => {
                    alert('Proceeding to checkout!');
                });

                // Load related products
                loadRelatedProducts(products, product.category);
            } else {
                alert('Product not found!');
                window.location.href = 'index.html'; // Redirect to homepage if product not found
            }
        })
        .catch(error => console.error('Error loading product data:', error));
        window.toggleSidebar = function () {
            const sidebar = document.getElementById("sidebar");
            sidebar.classList.toggle("-translate-x-full");
          };
          
        
        // Attach it to the window object if needed
        window.toggleSidebar = toggleSidebar;
        
        // Keep the DOMContentLoaded listener for other initialization
        document.addEventListener("DOMContentLoaded", () => {
            console.log("DOM fully loaded");
        });
        
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('open'); // Toggles the 'open' class
        }

    // Toggle Products Functionality (Show More/Show Less)
    function toggleProducts() {
        const button = document.getElementById("toggleBtn");
        const products = document.querySelectorAll("#productGrid > div:nth-child(n+5)");

        if (products.length === 0) {
            console.warn("No products found to toggle.");
            return;
        }

        const isHidden = products[0].classList.contains("hidden");

        products.forEach(product => product.classList.toggle("hidden"));

        button.textContent = isHidden ? "Show Less" : "Show More";
    }

    // Attach toggle functionality to the button
    const toggleBtn = document.getElementById("toggleBtn");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", toggleProducts);
    }

    // Add product to cart and save to localStorage (updated to store image)
    function addToCart(product) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image // Store the image URL here
            });
        }

        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update cart count for all elements with id="cart-count"
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

        const cartCountElements = document.querySelectorAll('#cart-count');
        if (cartCountElements.length > 0) {
            cartCountElements.forEach(cartCount => {
                cartCount.textContent = totalItems;
            });
        } else {
            console.error('Cart count elements not found in DOM');
        }
    }

    // Initialize cart count on page load
    document.addEventListener('DOMContentLoaded', updateCartCount);

    // Load related products
    function loadRelatedProducts(products, category) {
        const relatedProductsContainer = document.getElementById('related-products');
        const related = products.filter(p => p.category === category).slice(0, 4);

        related.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('border', 'rounded', 'p-4', 'bg-white');

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="w-full h-32 object-cover rounded mb-2">
                <h3 class="text-sm font-semibold">${product.name}</h3>
                <p class="text-sm text-green-500 font-semibold">$${product.specifications}</p>
                <p class="text-sm text-green-500 font-semibold">$${product.price}</p>
            `;

            productCard.addEventListener('click', () => {
                window.location.href = `product-details.html?id=${product.id}`;
            });

            relatedProductsContainer.appendChild(productCard);
        });
    }

    // Initial cart count update
    updateCartCount();
});

// Function to render cart items (including images)
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items-container');
    cartContainer.innerHTML = ''; // Clear the cart container

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item', 'flex', 'items-center', 'p-4', 'border', 'rounded-lg', 'mb-4');

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded mr-4">
            <div class="flex-1">
                <h4 class="text-lg font-semibold">${item.name}</h4>
                <p class="text-sm text-gray-500">Price: $${item.price}</p>
                <p class="text-sm">Quantity: ${item.quantity}</p>
            </div>
            <div class="text-right">
                <p class="font-semibold">Total: $${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        `;

        cartContainer.appendChild(cartItem);
    });

    // Optionally update the total price of the cart
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    document.getElementById('total-price').textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Call renderCart on page load (e.g., cart page load)
document.addEventListener('DOMContentLoaded', renderCart);
