document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const pagination = document.getElementById('pagination');
    const cartCount = document.getElementById('cart-count');
    let products = [];
    let currentPage = 1;
    const itemsPerPage = 12;

    // Fetch products from JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts();
            renderPagination();
            updateCartCount();
        });

    // Render products
    function renderProducts() {
        productGrid.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedProducts = products.slice(start, end);

        paginatedProducts.forEach(product => {
            const productCard = `
                <div class="bg-white p-4 rounded shadow-md">
                    <a href="product-details.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-32 object-cover">
                        <h3 class="text-lg font-bold mt-2">${product.name}</h3>
                        <p class="text-gray-600">$${product.price}</p>
                        <p class="text-yellow-500">⭐ ${product.rating}</p>
                    </a>
                    <button class="bg-blue-500 text-white mt-2 px-4 py-2 rounded" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            `;
            productGrid.insertAdjacentHTML('beforeend', productCard);
        });
    }

    // Render pagination
    function renderPagination() {
        const totalPages = Math.ceil(products.length / itemsPerPage);
        pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = `
                <button class="px-4 py-2 border rounded ${i === currentPage ? 'bg-blue-500 text-white' : ''}" onclick="goToPage(${i})">${i}</button>
            `;
            pagination.insertAdjacentHTML('beforeend', pageButton);
        }
    }

 // Ensure the function is globally accessible
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

  
 

    
      function toggleProduct() {
        // Target the button
        const button = document.getElementById("btn");

        // Target all grid items starting from the 5th
        const products = document.querySelectorAll(
          ".grid > div:nth-child(n+5)" // Corrected selector for grid items
        );

        // Check if the first product in the selection is hidden
        const isHidden = products[0].classList.contains("hidden");

        // Toggle the hidden class for all selected products
        products.forEach((item) => {
          item.classList.toggle("hidden");
        });

        // Update the button text accordingly
        button.textContent = isHidden ? "Source less" : "Source now";
      }

      function toggleProducts() {
        const button = document.getElementById("toggleBtn");
        const products = document.querySelectorAll(
          "#productGrid > div:nth-child(n+5)"
        );

        // Check the current state (hidden or visible)
        const isHidden = products[0].classList.contains("hidden");

        products.forEach((product) => {
          if (isHidden) {
            product.classList.remove("hidden"); // Show all items
          } else {
            product.classList.add("hidden"); // Hide additional items
          }
        });

        // Update button text
        button.textContent = isHidden ? "Source less" : "Source now";
      }
      function selectOption(country, icon) {
        document.getElementById(
          "dropdownButton"
        ).innerHTML = `${country} <img src="${icon}" class="inline-block w-4 h-4 ml-2" />`;
        toggleDropdown();
      }

      // Close the dropdown if clicked outside
      window.onclick = function (event) {
        if (!event.target.matches("#dropdownButton")) {
          document.getElementById("dropdownMenu").classList.add("hidden");
        }
      };

    // Go to a specific page
    window.goToPage = (page) => {
        currentPage = page;
        renderProducts();
        renderPagination();
    };

   // Add to cart
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);

    if (product) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item.id === id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        // Update local storage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update cart count in DOM
        updateCartCount();

        alert(`${product.name} has been added to your cart!`);
    } else {
        alert('Product not found!');
    }
};

// Update cart count for all elements with id="cart-count"
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    // Select all elements with id="cart-count"
    const cartCountElements = document.querySelectorAll('#cart-count');
    if (cartCountElements.length > 0) {
        cartCountElements.forEach(cartCount => {
            cartCount.textContent = totalItems; // Update each element
        });
    } else {
        console.error('Cart count elements not found in DOM');
    }
}


// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);



    // Apply filters
    document.getElementById('apply-filters').addEventListener('click', () => {
        const category = document.getElementById('category-filter').value;
        const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
        const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

        const filteredProducts = products.filter(product => {
            return (
                (category ? product.category === category : true) &&
                product.price >= minPrice &&
                product.price <= maxPrice
            );
        });

        products = filteredProducts;
        currentPage = 1;
        renderProducts();
        renderPagination();
    });

    // Price range input display
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    priceRange.addEventListener('input', () => {
        priceValue.textContent = priceRange.value;
    });
});
let page = 1;

// Function to toggle the sidebar visibility
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const isSidebarVisible = sidebar.style.transform === 'translateX(0%)';
    sidebar.style.transform = isSidebarVisible ? 'translateX(-100%)' : 'translateX(0%)';
}

// Function to load more products
const loadMoreBtn = document.getElementById('loadMoreBtn');
loadMoreBtn.addEventListener('click', () => {
    page++;
    loadMoreProducts(page);
});

function loadMoreProducts(page) {
    const url = `/api/products?page=${page}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.products && data.products.length > 0) {
                const productGrid = document.getElementById('product-grid');
                data.products.forEach(product => {
                    const productElement = document.createElement('a');
                    productElement.href = `product-details.html?id=${product.id}`;
                    productElement.innerHTML = `<div class="product-item">${product.name}</div>`;
                    productGrid.appendChild(productElement);
                });
            } else {
                loadMoreBtn.textContent = 'No more products';
                loadMoreBtn.disabled = true;
            }
        })
        .catch(error => {
            console.error('Error loading more products:', error);
        });
}


