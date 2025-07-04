document.addEventListener('DOMContentLoaded', () => {
    const phonesContainer = document.getElementById('phones-container');
    const comparisonCheckboxes = document.getElementById('comparison-checkboxes');
    const compareBtn = document.getElementById('compare-btn');
    const comparisonTableContainer = document.getElementById('comparison-table');
    
    const modal = document.getElementById('myModal');
    const modalPhoneDetails = document.getElementById('modal-phone-details');
    const closeModal = document.getElementsByClassName('close')[0];

    const loginBtn = document.getElementById('login-btn');
    const cartBtn = document.getElementById('cart-btn');
    const cartCount = document.getElementById('cart-count');
    const loginModal = document.getElementById('login-modal');
    const closeLoginModal = loginModal.getElementsByClassName('close')[0];
    const loginSubmitBtn = document.getElementById('login-submit-btn');

    let phonesData = [];
    let cart = [];

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            phonesData = data.phones;
            displayPhones();
            populateComparisonCheckboxes();
        });

    function displayPhones() {
        phonesContainer.innerHTML = '';
        phonesData.forEach(phone => {
            const phoneCard = document.createElement('div');
            phoneCard.className = 'phone-card';
            
            let specsHTML = '<div class="specs">';
            for (const [key, value] of Object.entries(phone.specs)) {
                specsHTML += `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</p>`;
            }
            specsHTML += '</div>';

            phoneCard.innerHTML = `
                <img src="${phone.image}" alt="${phone.name}">
                <h3>${phone.name}</h3>
                <p class="brand">${phone.brand}</p>
                ${specsHTML}
                <button class="add-to-cart-btn">Add to Cart</button>
            `;
            
            phoneCard.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(phone);
            });

            phoneCard.addEventListener('click', () => openModal(phone));
            phonesContainer.appendChild(phoneCard);
        });
    }

    function addToCart(phone) {
        cart.push(phone);
        updateCartCount();
    }

    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    function populateComparisonCheckboxes() {
        phonesData.forEach(phone => {
            const checkbox = document.createElement('label');
            checkbox.innerHTML = `
                <input type="checkbox" name="compare" value="${phone.name}">
                ${phone.name}
            `;
            comparisonCheckboxes.appendChild(checkbox);
        });
    }

    compareBtn.addEventListener('click', () => {
        const selectedPhones = Array.from(document.querySelectorAll('input[name="compare"]:checked'))
            .map(checkbox => checkbox.value);

        if (selectedPhones.length > 1) {
            displayComparisonTable(selectedPhones);
        } else {
            alert('Please select at least two phones to compare.');
        }
    });

    function displayComparisonTable(selectedPhoneNames) {
        const phonesToCompare = phonesData.filter(phone => selectedPhoneNames.includes(phone.name));
        
        let tableHTML = '<table>';
        tableHTML += '<tr><th>Feature</th>';
        phonesToCompare.forEach(phone => {
            tableHTML += `<th>${phone.name}</th>`;
        });
        tableHTML += '</tr>';

        const specs = ['display', 'camera', 'processor', 'battery', 'storage'];
        specs.forEach(spec => {
            tableHTML += `<tr><td><strong>${spec.charAt(0).toUpperCase() + spec.slice(1)}</strong></td>`;
            phonesToCompare.forEach(phone => {
                tableHTML += `<td>${phone.specs[spec]}</td>`;
            });
            tableHTML += '</tr>';
        });

        tableHTML += '</table>';
        comparisonTableContainer.innerHTML = tableHTML;
    }

    function openModal(phone) {
        let modalHTML = `
            <img src="${phone.image}" alt="${phone.name}" style="width:100%; max-width:400px; display:block; margin:auto;">
            <h2>${phone.name}</h2>
            <p><strong>Brand:</strong> ${phone.brand}</p>
        `;
        let specsHTML = '<div class="specs">';
        for (const [key, value] of Object.entries(phone.specs)) {
            specsHTML += `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</p>`;
        }
        specsHTML += '</div>';
        modalPhoneDetails.innerHTML = modalHTML + specsHTML;
        modal.style.display = "block";
    }

    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        if (event.target == loginModal) {
            loginModal.style.display = "none";
        }
    }

    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    closeLoginModal.onclick = function() {
        loginModal.style.display = "none";
    }

    loginSubmitBtn.addEventListener('click', () => {
        alert('Logged in successfully! (This is a mock login)');
        loginModal.style.display = 'none';
    });
});
