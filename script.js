
        const CONFIG = {
            APP_NAME: 'FreshFood',
            VERSION: '1.0.0',
            API_BASE: 'https://api.example.com',
            CART_KEY: 'freshfood_cart_v2',
            WISHLIST_KEY: 'freshfood_wishlist_v2',
            USER_KEY: 'freshfood_user_v2',
            CURRENCY: 'USD',
            TAX_RATE: 0.08,
            SHIPPING_FREE_THRESHOLD: 30,
            SHIPPING_COST: 5.99,
            DEFAULT_SORT: 'popular',
            ITEMS_PER_PAGE: 12,
            ANIMATION_DURATION: 300,
            DEBOUNCE_DELAY: 300,
            TOASTR_CONFIG: {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-right',
                timeOut: '3000',
                newestOnTop: true
            }
        };

        // ====================== GLOBAL VARIABLES ======================
        let state = {
            cart: [],
            wishlist: [],
            user: null,
            products: [],
            filteredProducts: [],
            currentPage: 1,
            currentFilter: 'all',
            currentSort: 'popular',
            searchQuery: '',
            isLoading: false,
            isCartOpen: false,
            isSearchOpen: false,
            isModalOpen: false
        };

        // ====================== DATA MODELS ======================
        class Product {
            constructor(id, name, price, originalPrice, image, category, tags, rating, description, features, nutrition, stock, organic, seasonal, sale) {
                this.id = id;
                this.name = name;
                this.price = price;
                this.originalPrice = originalPrice;
                this.image = image;
                this.category = category;
                this.tags = tags || [];
                this.rating = rating;
                this.description = description;
                this.features = features || [];
                this.nutrition = nutrition || {};
                this.stock = stock;
                this.organic = organic;
                this.seasonal = seasonal;
                this.sale = sale;
                this.createdAt = new Date().toISOString();
                this.updatedAt = new Date().toISOString();
            }
        }

        class CartItem {
            constructor(product, quantity) {
                this.id = product.id;
                this.name = product.name;
                this.price = product.price;
                this.image = product.image;
                this.quantity = quantity;
                this.total = product.price * quantity;
            }
        }

        // ====================== PRODUCT DATABASE ======================
        const PRODUCT_DATABASE = [
            // Vegetables (50 items)
            new Product(1, "Organic Kale", 3.99, 4.99, "https://images.pexels.com/photos/616404/pexels-photo-616404.jpeg", "vegetables", ["leafy", "organic", "superfood"], 4.8, "Fresh organic kale packed with vitamins and minerals. Perfect for smoothies and salads.", ["Rich in Vitamin K", "High in antioxidants", "Low in calories"], {calories: 33, protein: 2.9, carbs: 6, fiber: 2}, 150, true, true, true),
            new Product(2, "Baby Spinach", 2.99, 3.49, "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg", "vegetables", ["leafy", "organic", "salad"], 4.7, "Tender baby spinach leaves, perfect for salads and cooking.", ["Rich in iron", "High in Vitamin A", "Delicate flavor"], {calories: 23, protein: 2.9, carbs: 3.6, fiber: 2.2}, 200, true, false, false),
            new Product(3, "Romaine Lettuce", 2.49, null, "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg", "vegetables", ["leafy", "crunchy", "salad"], 4.5, "Crisp romaine lettuce hearts for perfect Caesar salads.", ["Crunchy texture", "High in fiber", "Low calorie"], {calories: 17, protein: 1.2, carbs: 3.3, fiber: 2.1}, 180, false, false, false),
            new Product(4, "Arugula", 3.49, 3.99, "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg", "vegetables", ["leafy", "peppery", "organic"], 4.6, "Peppery arugula leaves with a distinct flavor profile.", ["Peppery taste", "Rich in nitrates", "Vitamin K source"], {calories: 25, protein: 2.6, carbs: 3.7, fiber: 1.6}, 120, true, false, true),
            new Product(5, "Swiss Chard", 3.99, null, "https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg", "vegetables", ["leafy", "colorful", "organic"], 4.4, "Colorful Swiss chard with vibrant stems and tender leaves.", ["Colorful stems", "High in Vitamin K", "Iron rich"], {calories: 19, protein: 1.8, carbs: 3.7, fiber: 1.6}, 90, true, true, false),
            new Product(6, "Collard Greens", 2.99, 3.49, "https://images.pexels.com/photos/6004781/pexels-photo-6004781.jpeg", "vegetables", ["leafy", "southern", "hearty"], 4.3, "Hearty collard greens perfect for traditional Southern cooking.", ["Hearty leaves", "Calcium rich", "Slow cooking"], {calories: 32, protein: 3, carbs: 5.4, fiber: 4}, 110, false, true, true),
            new Product(7, "Bok Choy", 2.79, null, "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg", "vegetables", ["asian", "crunchy", "stem"], 4.5, "Crunchy bok choy with tender stems and flavorful leaves.", ["Crunchy stems", "Mild flavor", "Stir-fry favorite"], {calories: 13, protein: 1.5, carbs: 2.2, fiber: 1}, 140, false, false, false),
            new Product(8, "Watercress", 4.49, 4.99, "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg", "vegetables", ["leafy", "peppery", "aquatic"], 4.7, "Peppery watercress grown in pure spring water.", ["Aquatic plant", "Peppery bite", "Nutrient dense"], {calories: 11, protein: 2.3, carbs: 1.3, fiber: 0.5}, 80, true, false, true),
            new Product(9, "Mustard Greens", 3.29, null, "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg", "vegetables", ["leafy", "spicy", "pungent"], 4.2, "Pungent mustard greens with a spicy kick.", ["Spicy flavor", "Vitamin C rich", "Antioxidants"], {calories: 27, protein: 2.9, carbs: 4.7, fiber: 3.2}, 100, false, true, false),
            new Product(10, "Beet Greens", 2.99, 3.29, "https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg", "vegetables", ["leafy", "earthy", "nutritious"], 4.4, "Nutrient-rich beet greens with earthy flavor.", ["Earthy taste", "Iron source", "Versatile"], {calories: 22, protein: 2.2, carbs: 4.3, fiber: 3.7}, 95, true, false, true),

            // Root Vegetables (20 items)
            new Product(11, "Organic Carrots", 2.99, 3.49, "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg", "vegetables", ["root", "organic", "crunchy"], 4.8, "Sweet organic carrots perfect for snacking and cooking.", ["Rich in beta-carotene", "Crunchy texture", "Sweet flavor"], {calories: 41, protein: 0.9, carbs: 10, fiber: 2.8}, 250, true, false, true),
            new Product(12, "Beets", 3.49, null, "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg", "vegetables", ["root", "sweet", "earthy"], 4.6, "Sweet earthy beets with vibrant color.", ["Natural sweetness", "Earthy flavor", "Vibrant color"], {calories: 43, protein: 1.6, carbs: 10, fiber: 2.8}, 180, false, false, false),
            new Product(13, "Sweet Potatoes", 4.99, 5.49, "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg", "vegetables", ["root", "sweet", "nutritious"], 4.9, "Nutrient-dense sweet potatoes with natural sweetness.", ["High in Vitamin A", "Natural sweetness", "Versatile"], {calories: 86, protein: 1.6, carbs: 20, fiber: 3}, 220, true, true, true),
            new Product(14, "Parsnips", 3.99, null, "https://images.pexels.com/photos/6004781/pexels-photo-6004781.jpeg", "vegetables", ["root", "sweet", "earthy"], 4.3, "Sweet earthy parsnips perfect for roasting.", ["Sweet when cooked", "Earthy flavor", "Roasting favorite"], {calories: 75, protein: 1.2, carbs: 18, fiber: 4.9}, 120, false, true, false),
            new Product(15, "Turnips", 2.79, 3.29, "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg", "vegetables", ["root", "mild", "versatile"], 4.2, "Mild-flavored turnips with versatile uses.", ["Mild flavor", "Low calorie", "Versatile"], {calories: 28, protein: 0.9, carbs: 6, fiber: 1.8}, 160, false, false, true),

            // Fruits (30 items)
            new Product(16, "Organic Strawberries", 5.99, 6.99, "https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg", "fruits", ["berries", "organic", "sweet"], 4.9, "Sweet organic strawberries packed with antioxidants.", ["Rich in Vitamin C", "Antioxidant power", "Sweet flavor"], {calories: 32, protein: 0.7, carbs: 7.7, fiber: 2}, 180, true, true, true),
            new Product(17, "Blueberries", 4.99, 5.49, "https://images.pexels.com/photos/70862/pexels-photo-70862.jpeg", "fruits", ["berries", "antioxidant", "organic"], 4.8, "Antioxidant-rich blueberries for brain health.", ["Brain food", "High in antioxidants", "Sweet-tart"], {calories: 57, protein: 0.7, carbs: 14, fiber: 2.4}, 200, true, false, true),
            new Product(18, "Raspberries", 6.49, 6.99, "https://images.pexels.com/photos/1028599/pexels-photo-1028599.jpeg", "fruits", ["berries", "tart", "fragile"], 4.7, "Fragile raspberries with perfect tart-sweet balance.", ["Tart-sweet balance", "High in fiber", "Delicate"], {calories: 52, protein: 1.2, carbs: 12, fiber: 6.5}, 150, false, true, false),
            new Product(19, "Blackberries", 5.49, null, "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg", "fruits", ["berries", "tart", "dark"], 4.6, "Dark juicy blackberries with intense flavor.", ["Intense flavor", "Vitamin K rich", "Juicy"], {calories: 43, protein: 1.4, carbs: 10, fiber: 5.3}, 170, false, false, false),
            new Product(20, "Organic Apples", 3.99, 4.49, "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg", "fruits", ["tree fruit", "organic", "crisp"], 4.8, "Crisp organic apples with perfect sweetness.", ["Crisp texture", "Variety of types", "Portable snack"], {calories: 52, protein: 0.3, carbs: 14, fiber: 2.4}, 300, true, false, true),

            // Add 80 more products here to reach 100 total
            // ... (Due to character limit, I'll show the pattern and you can expand)
        ];

        // Fill with more sample products
        for (let i = 21; i <= 100; i++) {
            const categories = ['vegetables', 'fruits'];
            const tags = [
                ['organic', 'seasonal', 'fresh'],
                ['local', 'heirloom', 'crisp'],
                ['sweet', 'juicy', 'ripe'],
                ['tart', 'firm', 'aromatic']
            ];
            const names = [
                'Heirloom Tomatoes', 'Cucumbers', 'Bell Peppers', 'Zucchini',
                'Eggplant', 'Broccoli', 'Cauliflower', 'Brussels Sprouts',
                'Asparagus', 'Green Beans', 'Peas', 'Corn', 'Onions', 'Garlic',
                'Ginger', 'Mushrooms', 'Avocado', 'Pineapple', 'Mango', 'Papaya',
                'Kiwi', 'Pomegranate', 'Grapes', 'Watermelon', 'Cantaloupe',
                'Honeydew', 'Peaches', 'Plums', 'Cherries', 'Pears'
            ];

            const category = categories[Math.floor(Math.random() * categories.length)];
            const tagSet = tags[Math.floor(Math.random() * tags.length)];
            const name = names[Math.floor(Math.random() * names.length)];
            const price = parseFloat((Math.random() * 8 + 1).toFixed(2));
            const originalPrice = Math.random() > 0.5 ? parseFloat((price * 1.2).toFixed(2)) : null;
            const organic = Math.random() > 0.3;
            const seasonal = Math.random() > 0.5;
            const sale = Math.random() > 0.6;
            const rating = parseFloat((Math.random() * 1 + 3.5).toFixed(1));
            const stock = Math.floor(Math.random() * 200 + 50);

            PRODUCT_DATABASE.push(
                new Product(
                    i,
                    name,
                    price,
                    originalPrice,
                    `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg`,
                    category,
                    tagSet,
                    rating,
                    `Fresh ${name.toLowerCase()} with excellent quality and flavor.`,
                    ['Fresh', 'High Quality', 'Great Value'],
                    {calories: Math.floor(Math.random() * 100 + 20), protein: (Math.random() * 3).toFixed(1), carbs: (Math.random() * 20).toFixed(1), fiber: (Math.random() * 5).toFixed(1)},
                    stock,
                    organic,
                    seasonal,
                    sale
                )
            );
        }

        // ====================== UTILITY FUNCTIONS ======================
        class Utils {
            static formatPrice(price) {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: CONFIG.CURRENCY
                }).format(price);
            }

            static debounce(func, delay) {
                let timeout;
                return function(...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), delay);
                };
            }

            static animateCSS(element, animation, prefix = 'animate__') {
                return new Promise((resolve) => {
                    const animationName = `${prefix}${animation}`;
                    element.classList.add(`${prefix}animated`, animationName);

                    function handleAnimationEnd() {
                        element.classList.remove(`${prefix}animated`, animationName);
                        element.removeEventListener('animationend', handleAnimationEnd);
                        resolve();
                    }

                    element.addEventListener('animationend', handleAnimationEnd);
                });
            }

            static generateStars(rating) {
                const fullStars = Math.floor(rating);
                const hasHalfStar = rating % 1 >= 0.5;
                let stars = '';

                for (let i = 0; i < fullStars; i++) {
                    stars += '<i class="fas fa-star"></i>';
                }

                if (hasHalfStar) {
                    stars += '<i class="fas fa-star-half-alt"></i>';
                }

                const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
                for (let i = 0; i < emptyStars; i++) {
                    stars += '<i class="far fa-star"></i>';
                }

                return stars;
            }

            static calculateDiscount(original, current) {
                if (!original) return 0;
                return Math.round(((original - current) / original) * 100);
            }
        }

        // ====================== STORAGE MANAGER ======================
        class StorageManager {
            static saveCart(cart) {
                localStorage.setItem(CONFIG.CART_KEY, JSON.stringify(cart));
            }

            static loadCart() {
                const cart = localStorage.getItem(CONFIG.CART_KEY);
                return cart ? JSON.parse(cart) : [];
            }

            static saveWishlist(wishlist) {
                localStorage.setItem(CONFIG.WISHLIST_KEY, JSON.stringify(wishlist));
            }

            static loadWishlist() {
                const wishlist = localStorage.getItem(CONFIG.WISHLIST_KEY);
                return wishlist ? JSON.parse(wishlist) : [];
            }

            static saveUser(user) {
                localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
            }

            static loadUser() {
                const user = localStorage.getItem(CONFIG.USER_KEY);
                return user ? JSON.parse(user) : null;
            }

            static clearAll() {
                localStorage.removeItem(CONFIG.CART_KEY);
                localStorage.removeItem(CONFIG.WISHLIST_KEY);
                localStorage.removeItem(CONFIG.USER_KEY);
            }
        }

        // ====================== CART MANAGER ======================
        class CartManager {
            static addItem(product, quantity = 1) {
                const existingItem = state.cart.find(item => item.id === product.id);
                
                if (existingItem) {
                    existingItem.quantity += quantity;
                    existingItem.total = existingItem.price * existingItem.quantity;
                } else {
                    state.cart.push(new CartItem(product, quantity));
                }

                StorageManager.saveCart(state.cart);
                this.updateUI();
                toastr.success(`${product.name} added to cart!`);
            }

            static removeItem(productId) {
                state.cart = state.cart.filter(item => item.id !== productId);
                StorageManager.saveCart(state.cart);
                this.updateUI();
                toastr.info('Item removed from cart');
            }

            static updateQuantity(productId, quantity) {
                const item = state.cart.find(item => item.id === productId);
                if (!item) return;

                item.quantity = quantity;
                item.total = item.price * quantity;

                if (item.quantity < 1) {
                    this.removeItem(productId);
                    return;
                }

                StorageManager.saveCart(state.cart);
                this.updateUI();
            }

            static clearCart() {
                state.cart = [];
                StorageManager.saveCart(state.cart);
                this.updateUI();
                toastr.info('Cart cleared');
            }

            static getTotal() {
                return state.cart.reduce((sum, item) => sum + item.total, 0);
            }

            static getItemCount() {
                return state.cart.reduce((sum, item) => sum + item.quantity, 0);
            }

            static updateUI() {
                // Update cart count
                const cartCount = document.querySelector('.cart-count');
                const count = this.getItemCount();
                cartCount.textContent = count;
                cartCount.style.display = count > 0 ? 'block' : 'none';

                // Update cart items
                const cartItems = document.getElementById('cart-items');
                const cartEmpty = document.querySelector('.cart-empty');
                const cartTotalPrice = document.getElementById('cart-total-price');

                if (state.cart.length === 0) {
                    cartEmpty.style.display = 'block';
                    cartItems.innerHTML = '';
                    cartTotalPrice.textContent = Utils.formatPrice(0);
                    return;
                }

                cartEmpty.style.display = 'none';
                cartItems.innerHTML = '';

                state.cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-content">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <p class="cart-item-price">${Utils.formatPrice(item.price)}</p>
                            <div class="cart-item-actions">
                                <div class="cart-item-quantity">
                                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                    <span class="quantity-value">${item.quantity}</span>
                                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                                </div>
                                <button class="cart-item-remove" data-id="${item.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    cartItems.appendChild(cartItem);
                });

                // Update total
                cartTotalPrice.textContent = Utils.formatPrice(this.getTotal());

                // Attach event listeners
                document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const productId = parseInt(e.target.closest('.quantity-btn').dataset.id);
                        const item = state.cart.find(item => item.id === productId);
                        if (item) this.updateQuantity(productId, item.quantity - 1);
                    });
                });

                document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const productId = parseInt(e.target.closest('.quantity-btn').dataset.id);
                        const item = state.cart.find(item => item.id === productId);
                        if (item) this.updateQuantity(productId, item.quantity + 1);
                    });
                });

                document.querySelectorAll('.cart-item-remove').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const productId = parseInt(e.target.closest('.cart-item-remove').dataset.id);
                        this.removeItem(productId);
                    });
                });
            }
        }

        // ====================== PRODUCT MANAGER ======================
        class ProductManager {
            static filterProducts(filter, sort) {
                let filtered = [...PRODUCT_DATABASE];

                // Apply filter
                if (filter !== 'all') {
                    switch (filter) {
                        case 'vegetables':
                            filtered = filtered.filter(p => p.category === 'vegetables');
                            break;
                        case 'fruits':
                            filtered = filtered.filter(p => p.category === 'fruits');
                            break;
                        case 'organic':
                            filtered = filtered.filter(p => p.organic);
                            break;
                        case 'sale':
                            filtered = filtered.filter(p => p.sale);
                            break;
                        case 'seasonal':
                            filtered = filtered.filter(p => p.seasonal);
                            break;
                    }
                }

                // Apply search
                if (state.searchQuery) {
                    const query = state.searchQuery.toLowerCase();
                    filtered = filtered.filter(p => 
                        p.name.toLowerCase().includes(query) ||
                        p.description.toLowerCase().includes(query) ||
                        p.tags.some(tag => tag.toLowerCase().includes(query))
                    );
                }

                // Apply sorting
                switch (sort) {
                    case 'price-low':
                        filtered.sort((a, b) => a.price - b.price);
                        break;
                    case 'price-high':
                        filtered.sort((a, b) => b.price - a.price);
                        break;
                    case 'rating':
                        filtered.sort((a, b) => b.rating - a.rating);
                        break;
                    case 'newest':
                        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        break;
                    default: // popular
                        filtered.sort((a, b) => b.rating - a.rating);
                }

                state.filteredProducts = filtered;
                return filtered;
            }

            static renderProducts() {
                const productsGrid = document.getElementById('products-grid');
                if (!productsGrid) return;

                const startIndex = (state.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
                const endIndex = startIndex + CONFIG.ITEMS_PER_PAGE;
                const productsToShow = state.filteredProducts.slice(startIndex, endIndex);

                productsGrid.innerHTML = '';

                productsToShow.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.innerHTML = `
                        <div class="product-badges">
                            ${product.sale ? '<span class="badge badge-accent">Sale</span>' : ''}
                            ${product.organic ? '<span class="badge badge-primary">Organic</span>' : ''}
                            ${product.seasonal ? '<span class="badge badge-secondary">Seasonal</span>' : ''}
                        </div>
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}" loading="lazy">
                        </div>
                        <div class="product-content">
                            <p class="product-category">${product.category}</p>
                            <h3 class="product-title">${product.name}</h3>
                            <div class="rating">
                                ${Utils.generateStars(product.rating)}
                                <span class="rating-text">(${product.rating})</span>
                            </div>
                            <div class="product-price">
                                <span class="current-price">${Utils.formatPrice(product.price)}</span>
                                ${product.originalPrice ? `<span class="original-price">${Utils.formatPrice(product.originalPrice)}</span>` : ''}
                            </div>
                            <div class="product-actions">
                                <button class="add-to-cart-btn" data-id="${product.id}">
                                    <i class="fas fa-shopping-cart"></i> Add to Cart
                                </button>
                                <button class="wishlist-btn" data-id="${product.id}">
                                    <i class="far fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    productsGrid.appendChild(productCard);
                });

                // Attach event listeners
                document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const productId = parseInt(e.target.closest('.add-to-cart-btn').dataset.id);
                        const product = PRODUCT_DATABASE.find(p => p.id === productId);
                        if (product) CartManager.addItem(product, 1);
                    });
                });

                document.querySelectorAll('.wishlist-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const productId = parseInt(e.target.closest('.wishlist-btn').dataset.id);
                        this.toggleWishlist(productId);
                    });
                });

                document.querySelectorAll('.product-card').forEach(card => {
                    card.addEventListener('click', (e) => {
                        if (!e.target.closest('.product-actions')) {
                            const productId = parseInt(card.querySelector('.add-to-cart-btn').dataset.id);
                            this.showProductModal(productId);
                        }
                    });
                });
            }

            static showProductModal(productId) {
                const product = PRODUCT_DATABASE.find(p => p.id === productId);
                if (!product) return;

                const modalBody = document.getElementById('modal-body');
                modalBody.innerHTML = `
                    <div class="modal-images">
                        <div class="modal-main-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="modal-thumbnails">
                            <div class="modal-thumbnail active">
                                <img src="${product.image}" alt="${product.name}">
                            </div>
                            <!-- Additional thumbnails would go here -->
                        </div>
                    </div>
                    <div class="modal-info">
                        <h1>${product.name}</h1>
                        <div class="modal-price">
                            ${Utils.formatPrice(product.price)}
                            ${product.originalPrice ? `<span class="original-price">${Utils.formatPrice(product.originalPrice)}</span>` : ''}
                        </div>
                        <div class="rating mb-3">
                            ${Utils.generateStars(product.rating)}
                            <span class="rating-text">${product.rating} (Based on 128 reviews)</span>
                        </div>
                        <p class="modal-description">${product.description}</p>
                        
                        <div class="modal-features mb-4">
                            <h4>Key Features</h4>
                            <ul>
                                ${product.features.map(feature => `<li><i class="fas fa-check text-primary"></i> ${feature}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="modal-actions">
                            <div class="quantity-selector">
                                <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
                                <input type="number" id="modal-quantity" value="1" min="1" max="99">
                                <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                            </div>
                            <button class="btn btn-primary btn-large add-to-cart-modal" data-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>

                        <div class="modal-tabs mt-4">
                            <div class="tab-buttons">
                                <button class="tab-btn active" data-tab="description">Description</button>
                                <button class="tab-btn" data-tab="nutrition">Nutrition</button>
                                <button class="tab-btn" data-tab="reviews">Reviews</button>
                            </div>
                            <div class="tab-content active" id="tab-description">
                                <p>${product.description}</p>
                                <p>Stock: ${product.stock} units available</p>
                            </div>
                            <div class="tab-content" id="tab-nutrition">
                                <div class="nutrition-row">
                                    <span class="nutrition-label">Calories</span>
                                    <span class="nutrition-value">${product.nutrition.calories}</span>
                                </div>
                                <div class="nutrition-row">
                                    <span class="nutrition-label">Protein</span>
                                    <span class="nutrition-value">${product.nutrition.protein}g</span>
                                </div>
                                <div class="nutrition-row">
                                    <span class="nutrition-label">Carbohydrates</span>
                                    <span class="nutrition-value">${product.nutrition.carbs}g</span>
                                </div>
                                <div class="nutrition-row">
                                    <span class="nutrition-label">Fiber</span>
                                    <span class="nutrition-value">${product.nutrition.fiber}g</span>
                                </div>
                            </div>
                            <div class="tab-content" id="tab-reviews">
                                <p>Average rating: ${product.rating}/5</p>
                                <!-- Reviews would go here -->
                            </div>
                        </div>
                    </div>
                `;

                // Show modal
                document.getElementById('product-modal').classList.add('active');
                document.body.style.overflow = 'hidden';
                state.isModalOpen = true;

                // Attach modal event listeners
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const tab = e.target.dataset.tab;
                        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                        e.target.classList.add('active');
                        document.getElementById(`tab-${tab}`).classList.add('active');
                    });
                });

                document.querySelector('.quantity-btn.minus').addEventListener('click', () => {
                    const input = document.getElementById('modal-quantity');
                    if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
                });

                document.querySelector('.quantity-btn.plus').addEventListener('click', () => {
                    const input = document.getElementById('modal-quantity');
                    if (parseInt(input.value) < 99) input.value = parseInt(input.value) + 1;
                });

                document.querySelector('.add-to-cart-modal').addEventListener('click', () => {
                    const quantity = parseInt(document.getElementById('modal-quantity').value);
                    CartManager.addItem(product, quantity);
                    this.closeModal();
                });
            }

            static closeModal() {
                document.getElementById('product-modal').classList.remove('active');
                document.body.style.overflow = 'auto';
                state.isModalOpen = false;
            }

            static toggleWishlist(productId) {
                const index = state.wishlist.indexOf(productId);
                const btn = document.querySelector(`.wishlist-btn[data-id="${productId}"]`);
                
                if (index > -1) {
                    state.wishlist.splice(index, 1);
                    btn.innerHTML = '<i class="far fa-heart"></i>';
                    btn.classList.remove('active');
                    toastr.info('Removed from wishlist');
                } else {
                    state.wishlist.push(productId);
                    btn.innerHTML = '<i class="fas fa-heart"></i>';
                    btn.classList.add('active');
                    toastr.success('Added to wishlist');
                }

                StorageManager.saveWishlist(state.wishlist);
            }
        }

        // ====================== UI MANAGER ======================
        class UIManager {
            static init() {
                // Initialize toastr
                toastr.options = CONFIG.TOASTR_CONFIG;

                // Load initial state
                state.cart = StorageManager.loadCart();
                state.wishlist = StorageManager.loadWishlist();
                state.user = StorageManager.loadUser();
                state.products = PRODUCT_DATABASE;
                state.filteredProducts = ProductManager.filterProducts('all', 'popular');

                // Initialize UI
                CartManager.updateUI();
                ProductManager.renderProducts();
                this.initEventListeners();
                this.initSliders();
                this.startCountdown();

                // Show welcome message
                setTimeout(() => {
                    toastr.success('Welcome to FreshFood! 🥦');
                }, 1000);
            }

            static initEventListeners() {
                // Header actions
                document.getElementById('cart-btn').addEventListener('click', () => this.toggleCart());
                document.getElementById('cart-close').addEventListener('click', () => this.toggleCart());
                document.getElementById('search-btn').addEventListener('click', () => this.toggleSearch());
                document.getElementById('search-close').addEventListener('click', () => this.toggleSearch());
                document.getElementById('modal-close').addEventListener('click', () => ProductManager.closeModal());
                document.getElementById('mobile-menu-btn').addEventListener('click', () => this.toggleMobileMenu());

                // Cart actions
                document.getElementById('checkout-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    if (state.cart.length === 0) {
                        toastr.error('Your cart is empty');
                        return;
                    }
                    toastr.success('Proceeding to checkout...');
                    // In real app, redirect to checkout page
                });

                document.getElementById('clear-cart-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('Are you sure you want to clear your cart?')) {
                        CartManager.clearCart();
                    }
                });

                // Filter buttons
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        state.currentFilter = e.target.dataset.filter;
                        state.currentPage = 1;
                        ProductManager.filterProducts(state.currentFilter, state.currentSort);
                        ProductManager.renderProducts();
                        this.updatePagination();
                    });
                });

                // Sorting
                document.querySelector('.sorting-btn').addEventListener('click', () => {
                    document.querySelector('.sorting-dropdown').classList.toggle('active');
                });

                document.querySelectorAll('.sorting-option').forEach(option => {
                    option.addEventListener('click', (e) => {
                        document.querySelectorAll('.sorting-option').forEach(o => o.classList.remove('active'));
                        e.target.classList.add('active');
                        state.currentSort = e.target.dataset.sort;
                        document.querySelector('.sorting-btn').innerHTML = `
                            Sort by: ${e.target.textContent} <i class="fas fa-chevron-down"></i>
                        `;
                        ProductManager.filterProducts(state.currentFilter, state.currentSort);
                        ProductManager.renderProducts();
                        document.querySelector('.sorting-dropdown').classList.remove('active');
                    });
                });

                // Search
                const searchInput = document.querySelector('.search-input');
                searchInput.addEventListener('input', Utils.debounce((e) => {
                    state.searchQuery = e.target.value;
                    if (state.searchQuery.length > 2) {
                        this.performSearch(state.searchQuery);
                    } else {
                        document.getElementById('search-results').innerHTML = '';
                    }
                }, CONFIG.DEBOUNCE_DELAY));

                // Close dropdowns when clicking outside
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.sorting-dropdown')) {
                        document.querySelector('.sorting-dropdown').classList.remove('active');
                    }
                    if (!e.target.closest('.nav-dropdown')) {
                        document.querySelectorAll('.nav-dropdown-content').forEach(dropdown => {
                            dropdown.style.display = 'none';
                        });
                    }
                    if (e.target.classList.contains('search-overlay')) {
                        this.toggleSearch();
                    }
                    if (e.target.classList.contains('product-modal')) {
                        ProductManager.closeModal();
                    }
                });

                // Scroll events
                window.addEventListener('scroll', () => {
                    const header = document.querySelector('.header');
                    if (window.scrollY > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                });

                // Newsletter form
                document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
                    e.preventDefault();
                    const email = e.target.querySelector('.newsletter-input').value;
                    if (email) {
                        toastr.success('Thank you for subscribing to our newsletter!');
                        e.target.querySelector('.newsletter-input').value = '';
                    }
                });

                // Pagination
                document.querySelectorAll('.page-link').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const page = parseInt(e.target.textContent);
                        if (!isNaN(page)) {
                            state.currentPage = page;
                            ProductManager.renderProducts();
                            this.updatePagination();
                        }
                    });
                });
            }

            static initSliders() {
                // Recipes slider
                new Swiper('.recipes-slider', {
                    loop: true,
                    spaceBetween: 30,
                    grabCursor: true,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        0: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    },
                });

                // Testimonials slider
                new Swiper('.testimonials-slider', {
                    loop: true,
                    spaceBetween: 30,
                    grabCursor: true,
                    autoplay: {
                        delay: 6000,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        0: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                    },
                });
            }

            static toggleCart() {
                const cart = document.getElementById('sidebar-cart');
                cart.classList.toggle('active');
                state.isCartOpen = !state.isCartOpen;
                document.body.style.overflow = state.isCartOpen ? 'hidden' : 'auto';
            }

            static toggleSearch() {
                const search = document.getElementById('search-overlay');
                search.classList.toggle('active');
                state.isSearchOpen = !state.isSearchOpen;
                document.body.style.overflow = state.isSearchOpen ? 'hidden' : 'auto';
                
                if (state.isSearchOpen) {
                    document.querySelector('.search-input').focus();
                }
            }

            static toggleMobileMenu() {
                document.querySelector('.nav').classList.toggle('active');
            }

            static performSearch(query) {
                const results = PRODUCT_DATABASE.filter(product =>
                    product.name.toLowerCase().includes(query.toLowerCase()) ||
                    product.description.toLowerCase().includes(query.toLowerCase()) ||
                    product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
                ).slice(0, 10);

                const resultsContainer = document.getElementById('search-results');
                resultsContainer.innerHTML = '';

                if (results.length === 0) {
                    resultsContainer.innerHTML = '<p class="text-white">No products found.</p>';
                    return;
                }

                results.forEach(product => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.innerHTML = `
                        <div class="search-result-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="search-result-info">
                            <h4>${product.name}</h4>
                            <p>${Utils.formatPrice(product.price)} • ${product.category}</p>
                        </div>
                    `;
                    resultItem.addEventListener('click', () => {
                        ProductManager.showProductModal(product.id);
                        this.toggleSearch();
                    });
                    resultsContainer.appendChild(resultItem);
                });
            }

            static startCountdown() {
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + 3); // 3 days from now

                function updateCountdown() {
                    const now = new Date();
                    const diff = endDate - now;

                    if (diff <= 0) {
                        clearInterval(countdownInterval);
                        return;
                    }

                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                    document.getElementById('days').textContent = days.toString().padStart(2, '0');
                    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
                }

                updateCountdown();
                const countdownInterval = setInterval(updateCountdown, 1000);
            }

            static updatePagination() {
                const totalPages = Math.ceil(state.filteredProducts.length / CONFIG.ITEMS_PER_PAGE);
                const pagination = document.querySelector('.pagination');
                
                if (totalPages <= 1) {
                    pagination.style.display = 'none';
                    return;
                }

                pagination.style.display = 'flex';
                // Update pagination buttons based on current page
                // This is a simplified version - in production, you'd generate dynamic pagination
            }
        }

        // ====================== INITIALIZATION ======================
        document.addEventListener('DOMContentLoaded', () => {
            UIManager.init();
        });

        // ====================== ADVANCED FEATURES ======================
        // Voice Assistant
        class VoiceAssistant {
            constructor() {
                this.recognition = null;
                this.isListening = false;
                
                if ('webkitSpeechRecognition' in window) {
                    this.recognition = new webkitSpeechRecognition();
                    this.recognition.continuous = false;
                    this.recognition.interimResults = false;
                    
                    this.recognition.onresult = (event) => {
                        const transcript = event.results[0][0].transcript;
                        this.processVoiceCommand(transcript);
                    };
                    
                    this.recognition.onerror = (event) => {
                        console.error('Voice recognition error', event);
                        toastr.error('Voice recognition failed. Please try again.');
                    };
                }
            }

            startListening() {
                if (!this.recognition) {
                    toastr.error('Voice recognition not supported in your browser');
                    return;
                }

                this.isListening = true;
                document.querySelector('.voice-button').classList.add('listening');
                this.recognition.start();
                
                setTimeout(() => {
                    if (this.isListening) {
                        this.stopListening();
                        toastr.info('Listening stopped');
                    }
                }, 5000);
            }

            stopListening() {
                this.isListening = false;
                document.querySelector('.voice-button').classList.remove('listening');
                if (this.recognition) {
                    this.recognition.stop();
                }
            }

            processVoiceCommand(command) {
                const cmd = command.toLowerCase();
                let response = '';

                if (cmd.includes('add') && cmd.includes('cart')) {
                    // Parse product name from command
                    response = 'Adding product to cart';
                    toastr.success(response);
                } else if (cmd.includes('search')) {
                    const searchTerm = cmd.replace('search', '').trim();
                    response = `Searching for ${searchTerm}`;
                    state.searchQuery = searchTerm;
                    UIManager.toggleSearch();
                    document.querySelector('.search-input').value = searchTerm;
                    UIManager.performSearch(searchTerm);
                } else if (cmd.includes('recipe')) {
                    response = 'Here are some recipes you might like';
                } else {
                    response = 'I can help you search, add to cart, or find recipes';
                }

                document.querySelector('.voice-response').textContent = response;
                this.stopListening();
            }
        }

        // Initialize voice assistant
        const voiceAssistant = new VoiceAssistant();
        document.querySelector('.voice-button')?.addEventListener('click', () => {
            if (voiceAssistant.isListening) {
                voiceAssistant.stopListening();
            } else {
                voiceAssistant.startListening();
            }
        });

        // AR Viewer Simulation
        class ARViewer {
            static rotateModel() {
                const model = document.querySelector('.ar-model');
                if (model) {
                    let rotation = 0;
                    setInterval(() => {
                        rotation += 1;
                        model.style.transform = `rotateY(${rotation}deg)`;
                    }, 50);
                }
            }

            static zoomIn() {
                const model = document.querySelector('.ar-model');
                if (model) {
                    const currentScale = parseFloat(model.style.transform?.match(/scale\(([^)]+)\)/)?.[1] || 1);
                    model.style.transform = `scale(${currentScale * 1.2})`;
                }
            }

            static zoomOut() {
                const model = document.querySelector('.ar-model');
                if (model) {
                    const currentScale = parseFloat(model.style.transform?.match(/scale\(([^)]+)\)/)?.[1] || 1);
                    model.style.transform = `scale(${Math.max(0.5, currentScale * 0.8)})`;
                }
            }
        }

        // Gamification System
        class Gamification {
            constructor() {
                this.points = parseInt(localStorage.getItem('freshfood_points')) || 0;
                this.level = Math.floor(this.points / 100) + 1;
                this.progress = (this.points % 100) / 100 * 100;
            }

            addPoints(amount) {
                this.points += amount;
                this.level = Math.floor(this.points / 100) + 1;
                this.progress = (this.points % 100) / 100 * 100;
                localStorage.setItem('freshfood_points', this.points.toString());
                this.updateUI();
                
                if (amount > 0) {
                    toastr.success(`+${amount} points earned!`);
                }
            }

            updateUI() {
                const pointsEl = document.querySelector('.game-stat-value:first-child');
                const levelEl = document.querySelector('.game-level');
                const progressEl = document.querySelector('.game-progress-fill');
                
                if (pointsEl) pointsEl.textContent = this.points;
                if (levelEl) levelEl.textContent = `Level ${this.level}`;
                if (progressEl) progressEl.style.width = `${this.progress}%`;
            }

            // Award points for various actions
            static awardPurchase(amount) {
                const points = Math.floor(amount);
                gamification.addPoints(points);
            }

            static awardReview() {
                gamification.addPoints(10);
            }

            static awardDailyLogin() {
                gamification.addPoints(5);
            }
        }

        const gamification = new Gamification();

        // Smart Fridge Integration
        class SmartFridge {
            constructor() {
                this.items = JSON.parse(localStorage.getItem('smart_fridge_items')) || [];
                this.expiryThreshold = 3; // days
            }

            scanItem(product, quantity = 1) {
                const existingItem = this.items.find(item => item.id === product.id);
                
                if (existingItem) {
                    existingItem.quantity += quantity;
                    existingItem.lastUpdated = new Date().toISOString();
                } else {
                    const expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() + 7); // Default 7 days expiry
                    
                    this.items.push({
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        quantity: quantity,
                        addedDate: new Date().toISOString(),
                        expiryDate: expiryDate.toISOString(),
                        category: product.category
                    });
                }

                this.save();
                this.updateUI();
                toastr.success(`Added ${product.name} to smart fridge`);
            }

            checkExpiry() {
                const now = new Date();
                return this.items.map(item => {
                    const expiryDate = new Date(item.expiryDate);
                    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
                    
                    return {
                        ...item,
                        daysUntilExpiry,
                        status: daysUntilExpiry <= 0 ? 'expired' : 
                               daysUntilExpiry <= this.expiryThreshold ? 'expiring' : 'fresh'
                    };
                });
            }

            generateShoppingList() {
                const lowItems = this.items.filter(item => item.quantity < 2);
                return lowItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    needed: 3 - item.quantity
                }));
            }

            save() {
                localStorage.setItem('smart_fridge_items', JSON.stringify(this.items));
            }

            updateUI() {
                const items = this.checkExpiry();
                const fridgeItems = document.querySelector('.fridge-items');
                
                if (!fridgeItems) return;

                fridgeItems.innerHTML = '';
                
                items.slice(0, 6).forEach(item => {
                    const itemEl = document.createElement('div');
                    itemEl.className = `fridge-item ${item.status}`;
                    itemEl.innerHTML = `
                        <div class="fridge-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <h4>${item.name}</h4>
                        <p>${item.quantity} ${item.quantity === 1 ? 'piece' : 'pieces'}</p>
                        <p>${item.daysUntilExpiry} days left</p>
                    `;
                    fridgeItems.appendChild(itemEl);
                });
            }
        }

        const smartFridge = new SmartFridge();

        // Meal Planner
        class MealPlanner {
            constructor() {
                this.plan = JSON.parse(localStorage.getItem('meal_plan')) || this.generateWeeklyPlan();
                this.currentDay = new Date().getDay();
            }

            generateWeeklyPlan() {
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const meals = ['Breakfast', 'Lunch', 'Dinner'];
                const recipes = [
                    { name: 'Avocado Toast', ingredients: ['Avocado', 'Bread', 'Lemon'], calories: 350 },
                    { name: 'Greek Salad', ingredients: ['Tomato', 'Cucumber', 'Feta'], calories: 280 },
                    { name: 'Grilled Salmon', ingredients: ['Salmon', 'Lemon', 'Herbs'], calories: 450 },
                    { name: 'Vegetable Stir Fry', ingredients: ['Broccoli', 'Bell Peppers', 'Tofu'], calories: 320 },
                    { name: 'Berry Smoothie', ingredients: ['Berries', 'Yogurt', 'Honey'], calories: 220 }
                ];

                return days.map(day => ({
                    day,
                    date: new Date().toLocaleDateString(),
                    meals: meals.map(meal => ({
                        type: meal,
                        time: meal === 'Breakfast' ? '8:00 AM' : meal === 'Lunch' ? '1:00 PM' : '7:00 PM',
                        recipe: recipes[Math.floor(Math.random() * recipes.length)]
                    }))
                }));
            }

            updateUI() {
                const plannerWeek = document.querySelector('.planner-week');
                const plannerMeals = document.querySelector('.planner-meals');
                
                if (!plannerWeek || !plannerMeals) return;

                // Update days
                plannerWeek.innerHTML = '';
                this.plan.forEach((dayPlan, index) => {
                    const dayEl = document.createElement('div');
                    dayEl.className = `planner-day ${index === this.currentDay ? 'active' : ''}`;
                    dayEl.innerHTML = `
                        <div class="day-name">${dayPlan.day.slice(0, 3)}</div>
                        <div class="day-date">${new Date().getDate() + index}</div>
                    `;
                    dayEl.addEventListener('click', () => this.selectDay(index));
                    plannerWeek.appendChild(dayEl);
                });

                // Update meals for selected day
                this.selectDay(this.currentDay);
            }

            selectDay(dayIndex) {
                this.currentDay = dayIndex;
                document.querySelectorAll('.planner-day').forEach((day, index) => {
                    day.classList.toggle('active', index === dayIndex);
                });

                const dayPlan = this.plan[dayIndex];
                const plannerMeals = document.querySelector('.planner-meals');
                
                if (!plannerMeals) return;

                plannerMeals.innerHTML = '';
                dayPlan.meals.forEach(meal => {
                    const mealEl = document.createElement('div');
                    mealEl.className = 'planner-meal';
                    mealEl.innerHTML = `
                        <div class="meal-header">
                            <span class="meal-type">${meal.type}</span>
                            <span class="meal-time">${meal.time}</span>
                        </div>
                        <div class="meal-content">
                            <h4>${meal.recipe.name}</h4>
                            <div class="meal-ingredients">
                                ${meal.recipe.ingredients.map(ing => 
                                    `<span class="ingredient-tag">${ing}</span>`
                                ).join('')}
                            </div>
                            <div class="meal-nutrition">
                                <div class="nutrition-item">
                                    <i class="fas fa-fire"></i>
                                    <span class="nutrition-value">${meal.recipe.calories}</span>
                                    <span>cal</span>
                                </div>
                            </div>
                        </div>
                    `;
                    plannerMeals.appendChild(mealEl);
                });
            }

            save() {
                localStorage.setItem('meal_plan', JSON.stringify(this.plan));
            }
        }

        const mealPlanner = new MealPlanner();

        // Sustainability Calculator
        class SustainabilityCalculator {
            calculateImpact(cartItems) {
                const impacts = {
                    co2Saved: 0,
                    waterSaved: 0,
                    plasticReduced: 0
                };

                cartItems.forEach(item => {
                    // These are example values - in reality, you'd have actual data
                    impacts.co2Saved += item.quantity * 0.5; // kg CO2 saved per item
                    impacts.waterSaved += item.quantity * 100; // liters saved per item
                    impacts.plasticReduced += item.quantity * 0.1; // kg plastic reduced
                });

                return impacts;
            }

            updateUI(impacts) {
                const score = Math.min(100, Math.floor((impacts.co2Saved + impacts.waterSaved / 1000 + impacts.plasticReduced * 10) / 3));
                
                document.querySelector('.score-value')?.textContent = score;
                document.querySelectorAll('.sustainability-stat .stat-value').forEach((el, index) => {
                    const values = [
                        `${impacts.co2Saved.toFixed(1)}kg`,
                        `${impacts.waterSaved.toFixed(0)}L`,
                        `${impacts.plasticReduced.toFixed(2)}kg`
                    ];
                    el.textContent = values[index];
                });
            }
        }

        const sustainabilityCalc = new SustainabilityCalculator();

        // ====================== INITIALIZE ADVANCED FEATURES ======================
        window.addEventListener('load', () => {
            // Update gamification UI
            gamification.updateUI();

            // Update smart fridge
            smartFridge.updateUI();

            // Update meal planner
            mealPlanner.updateUI();

            // Calculate and display sustainability impact
            const impacts = sustainabilityCalc.calculateImpact(state.cart);
            sustainabilityCalc.updateUI(impacts);

            // Initialize AR viewer if present
            if (document.querySelector('.ar-viewer')) {
                ARViewer.rotateModel();
            }
        });

        // ====================== EXPORT FOR DEVTOOLS ======================
        window.FreshFood = {
            state,
            CartManager,
            ProductManager,
            UIManager,
            StorageManager,
            Utils,
            voiceAssistant,
            gamification,
            smartFridge,
            mealPlanner,
            sustainabilityCalc
        };

        console.log('%c FreshFood E-commerce Platform 🥦', 'font-size: 24px; color: #27ae60; font-weight: bold;');
        console.log('%c Version: ' + CONFIG.VERSION, 'color: #666;');
        console.log('%c Total Products: ' + PRODUCT_DATABASE.length, 'color: #666;');
        console.log('%c Cart Items: ' + state.cart.length, 'color: #666;');
        console.log('%c Type FreshFood in console to access development tools.', 'color: #27ae60;');
  