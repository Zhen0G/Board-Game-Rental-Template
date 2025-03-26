/**
 * Board Game World User Portal Scripts
 * Handles UI interactions and game data display
 */

// Sample game data as fallback if API fails
const sampleGames = [
    {
        id: 1,
        name: "Catan",
        category: "strategy",
        price: 4.99,
        players: "3-4 players",
        duration: "60-120 minutes",
        description: "A classic strategy game where players collect resources and build settlements on the island of Catan.",
        image: "https://images.unsplash.com/photo-1611371805429-12b88dc40002?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        name: "Ticket to Ride",
        category: "family",
        price: 3.99,
        players: "2-5 players",
        duration: "30-60 minutes",
        description: "Build train routes across North America in this fast-paced strategic board game.",
        image: "https://images.unsplash.com/photo-1629756048322-a8f15527edf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 3,
        name: "Codenames",
        category: "party",
        price: 2.99,
        players: "4-8 players",
        duration: "15-30 minutes",
        description: "A popular word game where players give one-word clues to help teammates identify specific word cards.",
        image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 4,
        name: "Pandemic",
        category: "strategy",
        price: 4.49,
        players: "2-4 players",
        duration: "45-60 minutes",
        description: "Work together as a team to treat infections around the world and find cures for diseases.",
        image: "https://images.unsplash.com/photo-1576000244350-974e76e62c0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 5,
        name: "Uno",
        category: "card",
        price: 1.99,
        players: "2-10 players",
        duration: "15-30 minutes",
        description: "The classic card game of matching colors and numbers. Easy to learn and fun for the whole family.",
        image: "https://images.unsplash.com/photo-1612404730960-5c71577fca11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 6,
        name: "Candy Land",
        category: "children",
        price: 1.49,
        players: "2-4 players",
        duration: "15-20 minutes",
        description: "A simple racing board game for young children that requires no reading or strategic skills.",
        image: "https://images.unsplash.com/photo-1560714513-0ce2f065eb72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    }
];

// Initialize variables
let allGames = []; // Will be populated from API
let currentCategory = 'all';
let searchTerm = '';
let currentPage = 1;
const gamesPerPage = 6;

// Document ready function
$(document).ready(function() {
    // Fetch games from API instead of using sample data
    fetchGames();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Set up all event listeners for the page
 */
function setupEventListeners() {
    // Category filter change
    $('#categoryFilter').change(function() {
        currentCategory = $(this).val();
        currentPage = 1; // Reset to first page
        filterGames();
    });

    // Search button click
    $('#searchButton').click(function() {
        searchTerm = $('#searchGames').val().toLowerCase();
        currentPage = 1; // Reset to first page
        filterGames();
    });

    // Search input enter key
    $('#searchGames').on('keypress', function(e) {
        if (e.which === 13) {
            searchTerm = $(this).val().toLowerCase();
            currentPage = 1; // Reset to first page
            filterGames();
        }
    });

    // Load more games button
    $('#loadMoreGames').click(function() {
        currentPage++;
        loadMoreGames();
    });

    // Game card click for details
    $(document).on('click', '.game-card', function() {
        const gameId = $(this).data('id');
        openGameDetails(gameId);
    });

    // Add to cart button
    $('#addToCartBtn').click(function() {
        const gameId = $(this).data('game-id');
        const duration = $('input[name="rentalDuration"]:checked').val();
        addToCart(gameId, duration);
    });

    // Login form submission
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        handleLogin();
    });

    // Registration form submission
    $('#registerForm').submit(function(e) {
        e.preventDefault();
        handleRegistration();
    });
    
    // Remove previous button (if it exists)
    $('#syncSampleGames').parent().remove();
    
    // Add sync button in multiple locations for better visibility
    
    // 1. Add to hero section
    $('.hero .container').append(`
        <div class="mt-4">
            <button id="syncSampleGames" class="btn btn-warning">
                <i class="fas fa-sync me-1"></i>Click to Sync Sample Games to Database
            </button>
        </div>
    `);
    
    // 2. Add a floating button
    $('body').append(`
        <div style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
            <button id="syncSampleGamesFloat" class="btn btn-warning btn-lg rounded-circle" 
                    style="width: 60px; height: 60px;" 
                    data-bs-toggle="tooltip" title="Sync Sample Games to Database">
                <i class="fas fa-sync"></i>
            </button>
        </div>
    `);
    
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    
    // Sync sample games to database - main button
    $('#syncSampleGames').click(function() {
        syncSampleGamesToDatabase();
    });
    
    // Sync sample games to database - floating button
    $('#syncSampleGamesFloat').click(function() {
        syncSampleGamesToDatabase();
    });
}

/**
 * Load games based on current filters and page
 */
function loadGames() {
    const filteredGames = filterGamesByCategory(allGames, currentCategory, searchTerm);
    const gamesToShow = filteredGames.slice(0, currentPage * gamesPerPage);
    
    renderGames(gamesToShow);
    
    // Show/hide load more button
    if (gamesToShow.length >= filteredGames.length) {
        $('#loadMoreGames').hide();
    } else {
        $('#loadMoreGames').show();
    }
}

/**
 * Load more games when "Load More" button is clicked
 */
function loadMoreGames() {
    const filteredGames = filterGamesByCategory(allGames, currentCategory, searchTerm);
    const gamesToShow = filteredGames.slice(0, currentPage * gamesPerPage);
    
    renderGames(gamesToShow);
    
    // Hide button if all games are shown
    if (gamesToShow.length >= filteredGames.length) {
        $('#loadMoreGames').hide();
    }
}

/**
 * Filter games and reload the view
 */
function filterGames() {
    loadGames();
}

/**
 * Filter games by category and search term
 */
function filterGamesByCategory(games, category, term) {
    return games.filter(game => {
        const categoryMatch = category === 'all' || game.category === category;
        const searchMatch = !term || 
            game.name.toLowerCase().includes(term) || 
            game.description.toLowerCase().includes(term);
        return categoryMatch && searchMatch;
    });
}

/**
 * Render games to the page
 */
function renderGames(games) {
    const $gamesList = $('#gamesList');
    
    // Clear existing games if this is the first page
    if (currentPage === 1) {
        $gamesList.empty();
    }
    
    // Show message if no games found
    if (games.length === 0 && currentPage === 1) {
        $gamesList.html('<div class="col-12 text-center"><p>No games found matching your criteria.</p></div>');
        return;
    }
    
    // Create HTML for each game
    games.forEach(game => {
        const gameCard = `
            <div class="col-md-4">
                <div class="game-card" data-id="${game.id}">
                    <div class="game-img">
                        <img src="${game.image}" alt="${game.name}">
                        <span class="game-category">${capitalizeFirstLetter(game.category)}</span>
                    </div>
                    <div class="game-body">
                        <h5 class="game-title">${game.name}</h5>
                        <div class="game-meta">
                            <span><i class="fas fa-users me-1"></i>${game.players}</span>
                            <span><i class="fas fa-clock me-1"></i>${game.duration}</span>
                        </div>
                        <p class="game-description">${game.description}</p>
                        <div class="game-footer">
                            <div class="game-price">$${game.price}/day</div>
                            <button class="btn btn-sm btn-primary rent-btn">View Details</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $gamesList.append(gameCard);
    });
}

/**
 * Open game details modal
 */
function openGameDetails(gameId) {
    const game = allGames.find(g => g.id === gameId);
    
    if (!game) return;
    
    // Populate modal with game details
    $('#gameTitle').text(game.name);
    $('#gameImage').attr('src', game.image);
    $('#gamePrice').text('$' + game.price);
    $('#gamePlayers').text(game.players);
    $('#gameDuration').text(game.duration);
    $('#gameDescription').text(game.description);
    
    // Set game ID for add to cart button
    $('#addToCartBtn').data('game-id', game.id);
    
    // Open modal
    const gameDetailModal = new bootstrap.Modal(document.getElementById('gameDetailModal'));
    gameDetailModal.show();
}

/**
 * Add game to cart
 */
function addToCart(gameId, duration) {
    const game = allGames.find(g => g.id === gameId);
    
    if (!game) return;
    
    // In a real application, this would send data to the backend
    console.log(`Added to cart: ${game.name} for ${duration} days`);
    
    // Show success message
    alert(`${game.name} has been added to your cart for ${duration} days!`);
    
    // Close modal
    const gameDetailModal = bootstrap.Modal.getInstance(document.getElementById('gameDetailModal'));
    gameDetailModal.hide();
}

/**
 * Handle login form submission
 */
function handleLogin() {
    const email = $('#loginEmail').val();
    const password = $('#loginPassword').val();
    
    // In a real application, this would send data to the backend for authentication
    console.log(`Login attempt: ${email}`);
    
    // Simulate successful login
    alert(`Welcome back! You are now logged in.`);
    
    // Close modal
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    loginModal.hide();
}

/**
 * Handle registration form submission
 */
function handleRegistration() {
    const name = $('#registerName').val();
    const email = $('#registerEmail').val();
    const password = $('#registerPassword').val();
    const confirmPassword = $('#registerConfirmPassword').val();
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // In a real application, this would send data to the backend
    console.log(`Registration: ${name}, ${email}`);
    
    // Simulate successful registration
    alert(`Thank you for registering, ${name}! You can now log in.`);
    
    // Close modal
    const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    registerModal.hide();
}

/**
 * Helper function to capitalize first letter of a string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Fetch games from the backend API
 */
function fetchGames() {
    // Clear console for debugging
    console.clear();
    console.log('Fetching games from API...');
    
    // Show loading indicator in games list
    $('#gamesList').html('<div class="col-12 text-center"><p><i class="fas fa-spinner fa-spin me-2"></i>Loading board game data...</p></div>');
    
    $.ajax({
        url: '/get_products',
        type: 'GET',
        success: function(products) {
            console.log('Raw API response:', products);
            
            if (!products || products.length === 0) {
                console.log('No games returned from API');
                $('#gamesList').html('<div class="col-12 text-center"><p>No board game data available. Please add games in the admin panel or click the sync button to add sample games.</p></div>');
                allGames = [];
                return;
            }
            
            try {
                // Check if products is an array or needs to be processed
                let productsArray = products;
                
                // Some APIs return data wrapped in another object
                if (!Array.isArray(products) && products.data) {
                    productsArray = products.data;
                    console.log('Unwrapped products from data property:', productsArray);
                }
                
                console.log('Products array type:', typeof productsArray, Array.isArray(productsArray));
                console.log('Products array length:', productsArray ? productsArray.length : 0);
                
                // Debug: Log first item to understand structure
                if (productsArray && productsArray.length > 0) {
                    console.log('First product format:', productsArray[0]);
                    console.log('Is first product an array?', Array.isArray(productsArray[0]));
                }
                
                // Transform API data to match our expected format
                allGames = [];
                
                // Define game images
                const gameImages = [
                    "https://images.unsplash.com/photo-1611371805429-12b88dc40002?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1629756048322-a8f15527edf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1632501641765-e568d28b0015?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1576000244350-974e76e62c0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1612404730960-5c71577fca11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1560714513-0ce2f065eb72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
                ];
                
                // Process each product/game
                for(let i = 0; i < productsArray.length; i++) {
                    const product = productsArray[i];
                    console.log(`Processing product ${i}:`, product);
                    
                    try {
                        // Handle different potential formats
                        let productObj = product;
                        
                        // If product is an array (like from some backend formats)
                        if (Array.isArray(product)) {
                            console.log('Product is array format:', product);
                            // Try to map expected fields from array structure
                            productObj = {
                                id: product[0] || 0,
                                name: product[1] || 'Unknown Game',
                                price: parseFloat(product[2]) || 0,
                                description: product[3] || ''
                            };
                        } else if(typeof product === 'object') {
                            console.log('Product is object format:', product);
                            // Ensure we have the expected properties
                            productObj = {
                                id: product.id || 0,
                                name: product.name || 'Unknown Game',
                                price: parseFloat(product.price) || 0,
                                description: product.description || ''
                            };
                        } else {
                            console.log('Product is in unknown format:', product);
                            continue; // Skip this product
                        }
                        
                        console.log('Processed to productObj:', productObj);
                        
                        // Extract players and duration info from description if available
                        let players = "2-4 players"; // Default
                        let duration = "30-60 minutes"; // Default
                        let description = String(productObj.description || "");
                        let gameImage = ""; // Store image extracted from description
                        
                        console.log('Raw description:', description);
                        
                        if (description) {
                            // Check if there is image data
                            const lines = description.split('\n');
                            const filteredLines = [];
                            
                            for (const line of lines) {
                                const trimmedLine = line.trim();
                                // If it's Base64 image data
                                if (trimmedLine.startsWith('data:image')) {
                                    gameImage = trimmedLine;
                                    continue; // Don't add to filtered lines
                                }
                                // Extract Players information
                                else if (trimmedLine.startsWith('Players:')) {
                                    players = trimmedLine.replace('Players:', '').trim();
                                    continue; // Don't add to filtered lines
                                }
                                // Extract Duration information
                                else if (trimmedLine.startsWith('Duration:')) {
                                    duration = trimmedLine.replace('Duration:', '').trim();
                                    continue; // Don't add to filtered lines
                                }
                                
                                if (trimmedLine) {
                                    filteredLines.push(trimmedLine);
                                }
                            }
                            
                            // Reassemble remaining description text
                            description = filteredLines.join('\n');
                            
                            console.log('Extracted info:', {
                                players: players,
                                duration: duration,
                                hasImage: !!gameImage,
                                cleanedDescription: description
                            });
                        }
                        
                        // Assign a random category for display purposes
                        const categories = ['strategy', 'family', 'party', 'card', 'children'];
                        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                        
                        // Get a random image if no embedded image was found
                        let finalImage = gameImage;
                        if (!finalImage) {
                            finalImage = gameImages[Math.floor(Math.random() * gameImages.length)];
                        }
                        
                        // Create game object
                        const gameObj = {
                            id: productObj.id || Math.floor(Math.random() * 1000),
                            name: productObj.name || 'Unknown Game',
                            category: randomCategory,
                            price: parseFloat(productObj.price) || 0,
                            players: players,
                            duration: duration,
                            description: description.trim() || 'No description available',
                            image: finalImage
                        };
                        
                        console.log('Final game object:', gameObj);
                        allGames.push(gameObj);
                    } catch (error) {
                        console.error(`Error processing product ${i}:`, error);
                    }
                }
                
                console.log(`Successfully processed ${allGames.length} games`);
            } catch (err) {
                console.error('Error processing API data:', err);
                $('#gamesList').html('<div class="col-12 text-center"><p class="text-danger">Error loading board game data. Please refresh the page and try again.</p></div>');
                allGames = [];
                return;
            }
            
            console.log('Final processed games:', allGames);
            
            // Check if we have any games
            if (allGames.length === 0) {
                $('#gamesList').html('<div class="col-12 text-center"><p>No board games available. Please add games in the admin panel.</p></div>');
                return;
            }
            
            // Load games to display
            loadGames();
        },
        error: function(error) {
            console.error('Error fetching games from API:', error);
            $('#gamesList').html('<div class="col-12 text-center"><p class="text-danger">Unable to connect to server. Please refresh the page and try again.</p></div>');
            allGames = [];
        }
    });
}

// Add this function to update the navigation for logged in users
function updateNavForLoggedInUser(username) {
    const $navbarNav = $('#navbarNav');
    const $authButtons = $navbarNav.next('.d-flex');
    
    $authButtons.html(`
        <div class="dropdown">
            <button class="btn btn-outline-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-user-circle me-1"></i>${username}
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a class="dropdown-item" href="#"><i class="fas fa-user me-2"></i>My Profile</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-history me-2"></i>Rental History</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-shopping-cart me-2"></i>My Cart</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
            </ul>
        </div>
    `);
    
    // Add logout event listener
    $('#logoutBtn').click(function(e) {
        e.preventDefault();
        // Handle logout
        handleLogout();
    });
}

// Handle logout
function handleLogout() {
    // In a real application, this would clear the session
    console.log('User logged out');
    
    // Reset navigation
    const $navbarNav = $('#navbarNav');
    const $authButtons = $navbarNav.next('.d-flex');
    
    $authButtons.html(`
        <button class="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#loginModal">
            <i class="fas fa-sign-in-alt me-1"></i>Login
        </button>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#registerModal">
            <i class="fas fa-user-plus me-1"></i>Register
        </button>
    `);
    
    alert('You have been logged out successfully.');
}

/**
 * Synchronize sample games to the database
 */
function syncSampleGamesToDatabase() {
    let successCount = 0;
    let errorCount = 0;
    let totalGames = sampleGames.length;
    
    // Show loading state
    $('#syncSampleGames').html('<i class="fas fa-spinner fa-spin me-1"></i>Syncing...');
    $('#syncSampleGames').prop('disabled', true);
    
    // Create a promise for each game
    const promises = sampleGames.map(game => {
        return new Promise((resolve, reject) => {
            // Convert game format to match the backend API
            const gameData = {
                name: game.name,
                price: game.price,
                description: `Players: ${game.players}\nDuration: ${game.duration}\n${game.description}`
            };
            
            $.ajax({
                url: '/create_product',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(gameData),
                success: function(response) {
                    successCount++;
                    resolve(response);
                },
                error: function(error) {
                    errorCount++;
                    console.error(`Failed to add game ${game.name}:`, error);
                    reject(error);
                }
            });
        });
    });
    
    // Wait for all promises to complete
    Promise.allSettled(promises).then(() => {
        // Reset button state
        $('#syncSampleGames').html('<i class="fas fa-sync me-1"></i>Sync Sample Games to Database');
        $('#syncSampleGames').prop('disabled', false);
        
        // Show results
        alert(`Synchronization complete!\n${successCount} games added successfully.\n${errorCount} games failed.`);
        
        // Refresh games from API
        if (successCount > 0) {
            fetchGames();
        }
    });
} 