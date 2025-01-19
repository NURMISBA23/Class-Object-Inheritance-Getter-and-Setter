class Product {
    constructor(name, price, image) {
      this._name = name;
      this._price = price;
      this._image = image;
    }
  
    get name() {
      return this._name;
    }
  
    get price() {
      return this._price;
    }
  
    get image() {
      return this._image;
    }
  }
  
  class CartItem extends Product {
    constructor(product, quantity) {
      super(product.name, product.price, product.image);
      this._quantity = quantity;
    }
  
    get quantity() {
      return this._quantity;
    }
  
    set quantity(value) {
      this._quantity = value;
    }
  
    get totalPrice() {
      return this._price * this._quantity;
    }
  }
  
  class Buyer {
    constructor() {
      this._cart = [];
      this._total = 0;
    }
  
    get cart() {
      return this._cart;
    }
  
    get total() {
      return this._total;
    }
  
    addToCart(product, quantity) {
      const existingItem = this._cart.find(item => item.name === product.name);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this._cart.push(new CartItem(product, quantity));
      }
      this._total += product.price * quantity;
      this.updateCartDisplay();
    }
  
    removeFromCart(productName) {
      const itemIndex = this._cart.findIndex(item => item.name === productName);
      if (itemIndex !== -1) {
        const item = this._cart[itemIndex];
        this._total -= item.totalPrice;
        this._cart.splice(itemIndex, 1);
        this.updateCartDisplay();
      }
    }
  
    updateQuantity(productName, newQuantity) {
      const item = this._cart.find(item => item.name === productName);
      if (item) {
        this._total -= item.totalPrice;
        item.quantity = newQuantity;
        this._total += item.totalPrice;
        this.updateCartDisplay();
      }
    }
  
    updateCartDisplay() {
      const cartList = document.getElementById("cart-list");
      const totalPrice = document.getElementById("total-price");
      cartList.innerHTML = "";
      this._cart.forEach(item => {
        const li = document.createElement("li");
        const cartItemDiv = document.createElement("div");
        cartItemDiv.className = "cart-item";
        cartItemDiv.innerHTML = `
          <div>${item.name} x ${item.quantity} = Rp ${item.totalPrice}</div>
          <div class="cart-item-controls">
            <button onclick="buyer.updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
            <button onclick="buyer.updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
            <button onclick="buyer.removeFromCart('${item.name}')">Hapus</button>
          </div>
        `;
        li.appendChild(cartItemDiv);
        cartList.appendChild(li);
      });
      totalPrice.textContent = this._total;
    }
  
    pay(money) {
      if (money < this._total) {
        alert("Uang tidak cukup!");
        return false;
      }
      const change = money - this._total;
      if (change > 0) {
        document.getElementById("change-message").textContent = `Kembalian: Rp ${change}`;
      } else {
        document.getElementById("change-message").textContent = "";
      }
      this._cart = [];
      this._total = 0;
      this.updateCartDisplay();
      return true;
    }
  }
  
  // Daftar Produk
  const products = [
    new Product("Apel", 10000, "images/apel.jpg"),
    new Product("Pisang", 5000, "images/pisang.jpg"),
    new Product("Jeruk", 8000, "images/jeruk.jpg"),
    new Product("Mangga", 12000, "images/mangga.jpg"),
  ];
  
  // Inisialisasi Pembeli
  const buyer = new Buyer();
  
  // Tampilkan Daftar Produk
  const productList = document.getElementById("product-list");
  products.forEach(product => {
    const li = document.createElement("li");
    const productDiv = document.createElement("div");
    productDiv.className = "product-item";
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    productDiv.appendChild(img);
    productDiv.innerHTML += ` ${product.name} - Rp ${product.price} `;
    li.appendChild(productDiv);
    const button = document.createElement("button");
    button.textContent = "Tambah ke Keranjang";
    button.addEventListener("click", () => {
      buyer.addToCart(product, 1);
    });
    li.appendChild(button);
    productList.appendChild(li);
  });
  
  // Fitur Bayar
  document.getElementById("pay").addEventListener("click", () => {
    const moneyInput = document.getElementById("money-input");
    const money = parseInt(moneyInput.value);
    if (isNaN(money) || money < 0) {
      alert("Masukkan jumlah uang yang valid!");
      return;
    }
    buyer.pay(money);
    moneyInput.value = "";
  });