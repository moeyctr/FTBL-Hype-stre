// Cart stored in localStorage as array of {id, name, price, quantity, image}

const CART_KEY = 'ftblHypeCart';

// Add product to cart
function addToCart(productId) {
  const productEl = document.querySelector(`.product[data-id="${productId}"]`);
  if (!productEl) return alert('Product not found');

  const product = {
    id: productId,
    name: productEl.dataset.name,
    price: Number(productEl.dataset.price),
    image: productEl.dataset.image,
    quantity: 1,
  };

  let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push(product);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  alert(`Added ${product.name} to cart!`);
}

// Remove product from cart by id
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

// Update quantity of a product in cart
function updateQuantity(productId, quantity) {
  let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity < 1 ? 1 : quantity;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
  }
}

// Update cart count in nav
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    countEl.textContent = count;
  }
}

// Render cart items on cart.html
function renderCartItems() {
  if (!document.getElementById('cart-items')) return; // only run on cart page

  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  const container = document.getElementById('cart-items');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('cart-total').textContent = '';
    return;
  }

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" loading="lazy" />
      <div>
        <h4>${item.name}</h4>
        <p>$${item.price} x 
          <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity('${item.id}', this.value)" />
        </p>
        <button onclick="removeFromCart('${item.id}')">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
}

// Checkout button logic
function checkout() {
  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  if (cart.length === 0) return alert('Your cart is empty.');

  // For demo, just clear cart and thank user
  localStorage.removeItem(CART_KEY);
  updateCartCount();
  renderCartItems();
  alert('Thank you for your purchase! (This is a demo store)');
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCartItems();

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
  }
});
