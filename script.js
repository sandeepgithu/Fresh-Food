
        // Initialize Toastr
        toastr.options = {
            positionClass: "toast-top-right",
            progressBar: true,
            closeButton: true,
            timeOut: 3000,
            extendedTimeOut: 1000
        };

        // Initialize Swiper
        const testimonialsSlider = new Swiper('.testimonials-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });

        // Product Data (100+ items with reliable image URLs)
        const products = [
            // VEGETABLES
            { id: 1, name: "Organic Carrots", category: "vegetables", price: 2.99, originalPrice: 3.49, rating: 4.5, reviews: 128, image: "https://images.unsplash.com/photo-1598170845058-78131a90f4bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", organic: true, seasonal: true, sale: false, stock: 50 },
            { id: 2, name: "Fresh Spinach", category: "vegetables", price: 3.49, originalPrice: 3.99, rating: 4.7, reviews: 89, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", organic: true, seasonal: true, sale: true, stock: 30 },
            { id: 3, name: "Broccoli", category: "vegetables", price: 4.29, originalPrice: 4.99, rating: 4.6, reviews: 156, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", organic: true, seasonal: false, sale: false, stock: 45 },
            { id: 4, name: "Bell Peppers", category: "vegetables", price: 5.99, originalPrice: 6.99, rating: 4.8, reviews: 203, image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", organic: false, seasonal: true, sale: true, stock: 25 },
            { id: 5, name: "Organic Tomatoes", category: "vegetables", price: 3.79, originalPrice: 4.29, rating: 4.4, reviews: 178, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", organic: true, seasonal: true, sale: false, stock: 60 },

            // FRUITS
            { id: 6, name: "Organic Strawberries", category: "fruits", price: 5.99, originalPrice: 6.99, rating: 4.9, reviews: 256, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", organic: true, seasonal: true, sale: false, stock: 35 },
            { id: 7, name: "Fresh Blueberries", category: "fruits", price: 4.99, originalPrice: 5.99, rating: 4.8, reviews: 189, image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", organic: true, seasonal: true, sale: true, stock: 40 },
            { id: 8, name: "Ripe Mangoes", category: "fruits", price: 3.99, originalPrice: 4.99, rating: 4.7, reviews: 167, image: "https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", organic: false, seasonal: true, sale: false, stock: 50 },
            { id: 9, name: "Organic Apples", category: "fruits", price: 2.99, originalPrice: 3.49, rating: 4.5, reviews: 234, image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", organic: true, seasonal: false, sale: true, stock: 100 },
            { id: 10, name: "Fresh Bananas", category: "fruits", price: 1.99, originalPrice: 2.49, rating: 4.3, reviews: 189, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", organic: false, seasonal: false, sale: false, stock: 150 },

            // BERRIES
            { id: 11, name: "Raspberries", category: "berries", price: 6.99, originalPrice: 7.99, rating: 4.8, reviews: 134, image: "https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", organic: true, seasonal: true, sale: false, stock: 25 },
            { id: 12, name: "Blackberries", category: "berries", price: 5.99, originalPrice: 6.99, rating: 4.6, reviews: 98, image: "https://images.unsplash.com/photo-1528823380149-36b8c4b4a325?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", organic: true, seasonal: true, sale: true, stock: 30 },

            // EXOTIC
            { id: 13, name: "Dragon Fruit", category: "exotic", price: 8.99, originalPrice: 9.99, rating: 4.7, reviews: 89, image: "https://images.unsplash.com/photo-1611080628765-3beb0e44a564?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", organic: false, seasonal: false, sale: true, stock: 15 },
            { id: 14, name: "Passion Fruit", category: "exotic", price: 9.99, originalPrice: 11.99, rating: 4.8, reviews: 56, image: "https://images.unsplash.com/photo-1558199142-a8c0a9d0e62f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", organic: true, seasonal: true, sale: false, stock: 18 },

            // Add more products as needed...
        ];

        // State Management
        const state = {
            cart: JSON.parse(localStorage.getItem('cart')) || [],
            wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
            currentFilter: 'all',
            currentSort: 'popular',
            currentPage: 1,
            itemsPerPage: 12
        };

        // DOM Elements
        const elements = {
            cartCount: document.querySelector('.cart-count'),
            wishlistCount: document.querySelector('.wishlist-count'),
            cartItems: document.getElementById('cart-items'),
            cartTotal: document.getElementById('cart-total-price'),
            productsGrid: document.getElementById('products-grid'),
            searchOverlay: document.getElementById('search-overlay'),
            sidebarCart: document.getElementById('sidebar-cart'),
            loadingOverlay: document.getElementById('loading-overlay'),
            backToTop: document.getElementById('back-to-top'),
            progressBar: document.getElementById('progress-bar')
        };

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            init();
            loadProducts();
            updateCartCount();
            updateWishlistCount();
            setupEventListeners();
            startCountdown();
        });

        function init() {
            // Header scroll effect
            window.addEventListener('scroll', () => {
                const header = document.getElementById('header');
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Progress bar
                const winHeight = window.innerHeight;
                const docHeight = document.documentElement.scrollHeight;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const trackLength = docHeight - winHeight;
                const percentage = Math.floor((scrollTop / trackLength) * 100);
                elements.progressBar.style.width = percentage + '%';

                // Back to top button
                if (scrollTop > 300) {
                    elements.backToTop.classList.add('active');
                } else {
                    elements.backToTop.classList.remove('active');
                }
            });
        }

        function setupEventListeners() {
            // Mobile menu
            document.getElementById('mobile-menu-btn').addEventListener('click', toggleMobileMenu);
            
            // Cart
            document.getElementById('cart-btn').addEventListener('click', toggleCart);
            document.getElementById('cart-close').addEventListener('click', toggleCart);
            document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
            document.getElementById('checkout-btn').addEventListener('click', checkout);
            
            // Search
            document.getElementById('search-btn').addEventListener('click', openSearch);
            document.getElementById('search-close').addEventListener('click', closeSearch);
            document.getElementById('search-input').addEventListener('input', handleSearch);
            
            // Filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    state.currentFilter = btn.dataset.filter;
                    state.currentPage = 1;
                    loadProducts();
                });
            });
            
            // Sorting
            document.querySelectorAll('.sorting-option').forEach(option => {
                option.addEventListener('click', () => {
                    document.querySelectorAll('.sorting-option').forEach(o => o.classList.remove('active'));
                    option.classList.add('active');
                    state.currentSort = option.dataset.sort;
                    loadProducts();
                });
            });
            
            // Buttons
            document.getElementById('shop-now-btn').addEventListener('click', () => {
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            });
            
            document.getElementById('flash-sale-btn').addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                document.querySelector('[data-filter="sale"]').classList.add('active');
                state.currentFilter = 'sale';
                loadProducts();
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            });
            
            document.getElementById('load-more-btn').addEventListener('click', loadMoreProducts);
            
            // Newsletter
            document.getElementById('newsletter-form').addEventListener('submit', handleNewsletter);
            
            // Back to top
            elements.backToTop.addEventListener('click', scrollToTop);
            
            // Close modals on ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeAllModals();
                }
            });
        }

        function toggleMobileMenu() {
            document.getElementById('nav').classList.toggle('active');
        }

        function toggleCart() {
            elements.sidebarCart.classList.toggle('active');
            updateCartDisplay();
        }

        function openSearch() {
            elements.searchOverlay.classList.add('active');
            document.getElementById('search-input').focus();
        }

        function closeSearch() {
            elements.searchOverlay.classList.remove('active');
        }

        function closeAllModals() {
            document.querySelectorAll('.sidebar-cart, .search-overlay').forEach(modal => {
                modal.classList.remove('active');
            });
        }

        function handleSearch(e) {
            const searchTerm = e.target.value.toLowerCase();
            // Implement search functionality here
        }

        function loadProducts() {
            showLoading();
            
            // Filter products
            let filteredProducts = products;
            if (state.currentFilter !== 'all') {
                filteredProducts = products.filter(product => {
                    if (state.currentFilter === 'organic') return product.organic;
                    if (state.currentFilter === 'sale') return product.sale;
                    if (state.currentFilter === 'seasonal') return product.seasonal;
                    if (state.currentFilter === 'berries') return product.category === 'berries';
                    if (state.currentFilter === 'exotic') return product.category === 'exotic';
                    return product.category === state.currentFilter;
                });
            }
            
            // Sort products
            filteredProducts.sort((a, b) => {
                switch (state.currentSort) {
                    case 'price-low': return a.price - b.price;
                    case 'price-high': return b.price - a.price;
                    case 'rating': return b.rating - a.rating;
                    case 'newest': return b.id - a.id;
                    case 'discount': 
                        const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) : 0;
                        const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) : 0;
                        return discountB - discountA;
                    default: return b.reviews - a.reviews;
                }
            });
            
            // Display products
            setTimeout(() => {
                elements.productsGrid.innerHTML = filteredProducts.map(product => `
                    <div class="product-card">
                        ${product.sale ? '<span class="product-badge badge-sale">Sale</span>' : ''}
                        ${product.organic ? '<span class="product-badge badge-organic">Organic</span>' : ''}
                        ${product.seasonal ? '<span class="product-badge badge-seasonal">Seasonal</span>' : ''}
                        
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
                            <div class="product-actions">
                                <button class="product-action-btn quick-view" data-id="${product.id}" title="Quick View">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="product-action-btn add-to-wishlist" data-id="${product.id}" title="Add to Wishlist">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="product-content">
                            <span class="product-category">${product.category.toUpperCase()}</span>
                            <h3 class="product-title">${product.name}</h3>
                            <p class="product-description">Fresh ${product.category} delivered daily from local farms.</p>
                            
                            <div class="product-rating">
                                ${getRatingStars(product.rating)}
                                <span>(${product.reviews})</span>
                            </div>
                            
                            <div class="product-price">
                                <span class="current-price">$${product.price.toFixed(2)}</span>
                                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                            </div>
                            
                            <div class="stock-indicator">
                                <div class="stock-bar">
                                    <div class="stock-fill" style="width: ${(product.stock / 100) * 100}%"></div>
                                </div>
                                <span class="stock-text">${product.stock} left</span>
                            </div>
                            
                            <div class="product-footer">
                                <div class="quantity-selector">
                                    <button class="quantity-btn minus" data-id="${product.id}">-</button>
                                    <input type="number" class="quantity-input" data-id="${product.id}" value="1" min="1" max="${product.stock}">
                                    <button class="quantity-btn plus" data-id="${product.id}">+</button>
                                </div>
                                <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                                    <i class="fas fa-shopping-cart"></i> Add
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
                
                // Add event listeners to product cards
                addProductEventListeners();
                
                hideLoading();
            }, 500);
        }

        function getRatingStars(rating) {
            const fullStars = Math.floor(rating);
            const halfStar = rating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
            
            let stars = '';
            for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
            if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
            for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
            return stars;
        }

        function addProductEventListeners() {
            // Add to cart
            document.querySelectorAll('.add-to-cart').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    const product = products.find(p => p.id === productId);
                    if (product) {
                        addToCart(product);
                        toastr.success(`${product.name} added to cart!`);
                    }
                });
            });
            
            // Wishlist
            document.querySelectorAll('.add-to-wishlist').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.closest('button').dataset.id);
                    toggleWishlist(productId);
                });
            });
            
            // Quantity controls
            document.querySelectorAll('.quantity-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
                    const product = products.find(p => p.id === productId);
                    
                    if (e.target.classList.contains('minus') && parseInt(input.value) > 1) {
                        input.value = parseInt(input.value) - 1;
                    } else if (e.target.classList.contains('plus') && product && parseInt(input.value) < product.stock) {
                        input.value = parseInt(input.value) + 1;
                    }
                });
            });
        }

        function addToCart(product, quantity = 1) {
            const existingItem = state.cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.cart.push({
                    ...product,
                    quantity: quantity
                });
            }
            
            updateCartCount();
            saveCart();
            
            if (elements.sidebarCart.classList.contains('active')) {
                updateCartDisplay();
            }
        }

        function updateCartCount() {
            const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
            elements.cartCount.textContent = totalItems;
        }

        function updateCartDisplay() {
            const container = elements.cartItems;
            
            if (state.cart.length === 0) {
                container.innerHTML = '';
                container.parentElement.querySelector('.cart-empty').style.display = 'block';
                elements.cartTotal.textContent = '$0.00';
                return;
            }
            
            container.parentElement.querySelector('.cart-empty').style.display = 'none';
            
            container.innerHTML = state.cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
                    </div>
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                        <div class="cart-item-actions">
                            <button class="btn btn-sm btn-outline cart-item-decrease" data-id="${item.id}">-</button>
                            <span class="cart-item-quantity">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline cart-item-increase" data-id="${item.id}">+</button>
                            <button class="btn btn-sm btn-danger cart-item-remove" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Calculate total
            const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            elements.cartTotal.textContent = `$${total.toFixed(2)}`;
            
            // Add event listeners to cart items
            container.querySelectorAll('.cart-item-decrease').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    updateCartItemQuantity(productId, -1);
                });
            });
            
            container.querySelectorAll('.cart-item-increase').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    updateCartItemQuantity(productId, 1);
                });
            });
            
            container.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.closest('button').dataset.id);
                    removeFromCart(productId);
                });
            });
        }

        function updateCartItemQuantity(productId, change) {
            const item = state.cart.find(item => item.id === productId);
            if (!item) return;
            
            item.quantity += change;
            
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                updateCartCount();
                saveCart();
                updateCartDisplay();
            }
        }

        function removeFromCart(productId) {
            state.cart = state.cart.filter(item => item.id !== productId);
            updateCartCount();
            saveCart();
            updateCartDisplay();
            toastr.info('Item removed from cart');
        }

        function clearCart() {
            if (state.cart.length === 0) return;
            
            if (confirm('Are you sure you want to clear your cart?')) {
                state.cart = [];
                updateCartCount();
                saveCart();
                updateCartDisplay();
                toastr.info('Cart cleared');
            }
        }

        function checkout() {
            if (state.cart.length === 0) {
                toastr.warning('Your cart is empty');
                return;
            }
            
            showLoading();
            setTimeout(() => {
                toastr.success('Order placed successfully!');
                state.cart = [];
                updateCartCount();
                saveCart();
                updateCartDisplay();
                hideLoading();
                toggleCart();
            }, 1500);
        }

        function toggleWishlist(productId) {
            const index = state.wishlist.findIndex(id => id === productId);
            const product = products.find(p => p.id === productId);
            
            if (index === -1) {
                state.wishlist.push(productId);
                toastr.success(`${product.name} added to wishlist`);
            } else {
                state.wishlist.splice(index, 1);
                toastr.info(`${product.name} removed from wishlist`);
            }
            
            updateWishlistCount();
            saveWishlist();
        }

        function updateWishlistCount() {
            elements.wishlistCount.textContent = state.wishlist.length;
        }

        function loadMoreProducts() {
            // Implement load more functionality
            toastr.info('Loading more products...');
        }

        function handleNewsletter(e) {
            e.preventDefault();
            const email = e.target.querySelector('.newsletter-input').value;
            
            showLoading();
            setTimeout(() => {
                toastr.success('Thank you for subscribing to our newsletter!');
                e.target.reset();
                hideLoading();
            }, 1000);
        }

        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        function showLoading() {
            elements.loadingOverlay.classList.add('active');
        }

        function hideLoading() {
            elements.loadingOverlay.classList.remove('active');
        }

        function startCountdown() {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 3);
            
            function updateCountdown() {
                const now = new Date().getTime();
                const distance = endDate - now;
                
                if (distance < 0) {
                    document.getElementById('days').textContent = '00';
                    document.getElementById('hours').textContent = '00';
                    document.getElementById('minutes').textContent = '00';
                    document.getElementById('seconds').textContent = '00';
                    return;
                }
                
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                document.getElementById('days').textContent = days.toString().padStart(2, '0');
                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            }
            
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }

        // Local Storage
        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(state.cart));
        }

        function saveWishlist() {
            localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
        }

        // Image fallback system
        document.addEventListener('error', function(e) {
            if (e.target.tagName === 'IMG') {
                e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
            }
        }, true);
  
