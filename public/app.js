const initProductListingApp = () => {
    // DOM Elements
    const categorySelect = document.getElementById('category');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const sortSelect = document.getElementById('sort');
    const resetBtn = document.getElementById('resetFilters');
    
    const productsGrid = document.getElementById('productsGrid');
    const loader = document.getElementById('loader');
    const productCount = document.getElementById('productCount');
    const emptyState = document.getElementById('emptyState');

    // Debounce timer for inputs
    let timeoutId;

    // Fetch and render products
    const fetchProducts = async () => {
        // Show loader, hide grid and empty state
        loader.classList.remove('hidden');
        productsGrid.innerHTML = '';
        emptyState.classList.add('hidden');

        // Build query string
        const params = new URLSearchParams();
        
        const category = categorySelect.value;
        if (category && category !== 'All') {
            params.append('category', category);
        }

        const min = minPriceInput.value;
        if (min !== '') {
            params.append('minPrice', min);
        }

        const max = maxPriceInput.value;
        if (max !== '') {
            params.append('maxPrice', max);
        }

        const sort = sortSelect.value;
        if (sort && sort !== 'default') {
            params.append('sort', sort);
        }

        const url = `/api/products?${params.toString()}`;

        try {
            // Simulated slight delay to show off the loader and premium feel
            const response = await fetch(url);
            const data = await response.json();
            
            // Add minimum artificial delay for smoother perceived performance
            setTimeout(() => {
                loader.classList.add('hidden');
                renderProducts(data.products);
            }, 300);

        } catch (error) {
            console.error('Error fetching products:', error);
            loader.classList.add('hidden');
            productsGrid.innerHTML = '<p style="color:red">Failed to load products.</p>';
        }
    };

    // Render HTML
    const renderProducts = (products) => {
        productCount.textContent = `${products.length} item${products.length !== 1 ? 's' : ''}`;

        if (products.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        const html = products.map((product, index) => `
            <div class="product-card" style="animation: fadeInUp ${0.3 + index * 0.05}s ease forwards">
                <span class="category-badge">${product.category}</span>
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="add-btn" aria-label="Add to cart">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        productsGrid.innerHTML = html;
    };

    // Add Keyframe animation for cards dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(styleSheet);


    // Event Listeners
    categorySelect.addEventListener('change', fetchProducts);
    sortSelect.addEventListener('change', fetchProducts);

    const handleInputDebounced = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fetchProducts();
        }, 500); // 500ms debounce
    };

    minPriceInput.addEventListener('input', handleInputDebounced);
    maxPriceInput.addEventListener('input', handleInputDebounced);

    resetBtn.addEventListener('click', () => {
        categorySelect.value = 'All';
        minPriceInput.value = '';
        maxPriceInput.value = '';
        sortSelect.value = 'default';
        fetchProducts();
    });

    // Initial Fetch
    fetchProducts();

    // Add Product Modal Logic
    const openAddModalBtn = document.getElementById('openAddModalBtn');
    const closeAddModalBtn = document.getElementById('closeAddModalBtn');
    const addProductModal = document.getElementById('addProductModal');
    const addProductForm = document.getElementById('addProductForm');
    const newProductImageInput = document.getElementById('newProductImage');
    const submitProductBtn = document.getElementById('submitProductBtn');

    openAddModalBtn.addEventListener('click', () => {
        addProductModal.classList.remove('hidden');
    });

    closeAddModalBtn.addEventListener('click', () => {
        addProductModal.classList.add('hidden');
        addProductForm.reset();
    });

    // Close modal when clicking outside
    addProductModal.addEventListener('click', (e) => {
        if (e.target === addProductModal) {
            addProductModal.classList.add('hidden');
            addProductForm.reset();
        }
    });

    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitProductBtn.textContent = 'Adding...';
        submitProductBtn.disabled = true;

        const name = document.getElementById('newProductName').value;
        const price = document.getElementById('newProductPrice').value;
        const category = document.getElementById('newProductCategory').value;
        const imageFile = newProductImageInput.files[0];

        // Convert file to Base64 data URL
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result;

            const productData = {
                name,
                price: parseFloat(price),
                category,
                image: base64Image
            };

            try {
                const response = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    addProductModal.classList.add('hidden');
                    addProductForm.reset();
                    fetchProducts(); // Refresh grid
                } else {
                    alert('Error adding product.');
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred while adding the product.');
            } finally {
                submitProductBtn.textContent = 'Add Product';
                submitProductBtn.disabled = false;
            }
        };

        if (imageFile) {
            reader.readAsDataURL(imageFile);
        }
    });

};

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initProductListingApp);
} else {
    console.log('public/app.js is a browser script. Start the server with "npm start" and open the app in a browser.');
}
