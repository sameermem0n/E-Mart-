let cart = [];

// Load products from products.json
async function loadProducts() {
  const response = await fetch("products.json");
  const products = await response.json();

  // Sample Cart (Populate with products for testing)
  cart = [
    { ...products[0], quantity: 1 },
    { ...products[1], quantity: 2 }
  ];

  renderCart();
}

// Render Cart Items
function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalContainer = document.getElementById("cart-total");

  let totalPrice = 0;

  cartItemsContainer.innerHTML = cart
    .map((item, index) => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;

      return `
        <div class="flex items-center justify-between border-b py-4">
          <div class="flex items-center">
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-md">
            <div class="ml-4">
              <p class="font-semibold">${item.name}</p>
              <p class="text-sm text-gray-600">$${item.price.toFixed(2)}</p>
              <div class="flex items-center mt-2">
                <button
                  class="bg-gray-200 px-3 py-1 rounded-md font-bold"
                  data-index="${index}"
                  data-action="decrease"
                >
                  -
                </button>
                <span class="mx-2">${item.quantity}</span>
                <button
                  class="bg-gray-200 px-3 py-1 rounded-md font-bold"
                  data-index="${index}"
                  data-action="increase"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p class="text-lg font-semibold">$${itemTotal.toFixed(2)}</p>
            <button
              class="text-red-500 text-sm font-medium"
              data-index="${index}"
              data-action="remove"
            >
              Remove
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  cartTotalContainer.innerHTML = `
    <p class="text-gray-600">Subtotal: $${totalPrice.toFixed(2)}</p>
    <p id="final-total" class="text-xl font-bold">Total: $${totalPrice.toFixed(2)}</p>
  `;
}

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


// Handle Quantity and Remove Buttons
document.addEventListener("click", (e) => {
  const btn = e.target;
  const index = btn.dataset.index;
  const action = btn.dataset.action;

  if (action === "increase") {
    cart[index].quantity++;
  } else if (action === "decrease") {
    if (cart[index].quantity > 1) cart[index].quantity--;
  } else if (action === "remove") {
    cart.splice(index, 1);
  }

  renderCart();
});

// Apply Coupon
document.getElementById("apply-coupon").addEventListener("click", () => {
  const coupon = document.getElementById("coupon-code").value.trim();
  const discount = coupon === "SAVE10" ? 0.10 : 0;

  if (discount > 0) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountedTotal = subtotal - subtotal * discount;

    document.getElementById("final-total").textContent = `Total: $${discountedTotal.toFixed(2)}`;
    alert("Coupon applied!");
  } else {
    alert("Invalid coupon code!");
  }
});

// Handle Proceed to Checkout Button
document.getElementById("proceed-checkout").addEventListener("click", () => {
  localStorage.setItem("cart", JSON.stringify(cart)); // Save cart to localStorage
  window.location.href = "checkout.html"; // Redirect to checkout page
});

// Initialize
loadProducts();
