const CUSTOMER_ENDPOINT = '/customers/';
var last_page = 1;

function getCookie(name) {
    // function to get cookie value
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function notify(msg, type) {
    document.querySelector('#notify-msg').innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${msg}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `;
}

function getPlanBadge(plan) {
    switch (plan) {
        case 'free':
            return '<span class="badge bg-success">Free</span>';
        case 'plus':
            return '<span class="badge bg-warning">Plus</span>';
        case 'pro':
            return '<span class="badge bg-info">Pro</span>';
        default:
            return '<span class="badge bg-success">Free</span>';
    }
}
function createCustomerPagination(count, page_count, page_number) {
    if(page_count < 2) return;

    link_htmls = page_number > 1 ? `
        <li class="page-item">
            <span class="page-link" onclick="handlePagination(${i})">Previous</span>
        </li>
    ` : '';

    var i;
    for(i=1; i<=page_count; i++) {
        link_htmls += `
            <li class="page-item ${i===page_number? 'active' : '' }">
                <a class="page-link" href="javascript:void(0)" onclick="handlePagination(${i})">${i}</a>
            </li>
        `;
    }
    last_page = i;

    link_htmls += page_number < page_count ? `
        <li class="page-item">
            <span class="page-link" onclick="handlePagination(${i})">Next</span>
        </li>
    ` : '';

    html = `
    <nav aria-label="...">
        <ul class="pagination">
            ${link_htmls}
        </ul>
    </nav>
    `

    document.getElementById('customer-list-pagination').innerHTML = html;
}

function createCustomerRow(customer) {
    tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${customer.id}</td>
        <td>${customer.name}</td>
        <td>${customer.email}</td>
        <td>${customer.created_date}</td>
        <td>${getPlanBadge(customer.subscription_type)}</td>
    `;
    return tr
}

function addToList(data) {
    document.querySelector('#customer-list tbody').appendChild(createCustomerRow(data));
}
function clearCustomerList() {
    document.querySelector('#customer-list tbody').innerHTML = '';
}

function loadCustomers(page_number=1) {
    // function to list customers from the customer api
    clearCustomerList();
    fetch(`${CUSTOMER_ENDPOINT}?page=${page_number}`)
    .then(response => response.json())
    .then(data => {
        data.results.map(customer => {
            // append list element of each customer
            addToList(customer);
        });

        createCustomerPagination(data.count, data.page_count, data.page_number);
    })
    .catch(err => alert(err));
}

function handleError(errors) {
    document.querySelector('#notify-msg').innerHTML = '';
    if (errors.name) {
        errorEl = document.getElementById('nameError');
        errorEl.innerHTML = errors.name[0]
    }
    if (errors.email) {
        errorEl = document.getElementById('emailError');
        errorEl.innerHTML = errors.email[0]
    }
    if (errors.subscription_type) {
        errorEl = document.getElementById('subTypeError');
        errorEl.innerHTML = errors.subscription_type[0]
    }
}

function clearError() {
    document.querySelectorAll('.error').forEach(el => el.innerHTML = '');
}

function resetForm() {
    document.forms.namedItem('customerForm').reset();
    clearError();
}

function addCustomer(event) {
    event.preventDefault();
    clearError();
    form = event.target;
    var formData = {};
    for(var el of form.querySelectorAll('input, select')) {
        formData[el.name] = el.value;
    }
    fetch(CUSTOMER_ENDPOINT, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(formData) // body data type must match "Content-Type" header
    })
    .then(async response => {
        console.log(response);
        if (response.ok) {
            customer = await response.json();
            loadCustomers(last_page);
            resetForm();
            notify('Customer added successfully.', 'success');
        } else {
            errors = await response.json();
            handleError(errors);
        }

    })
    .catch(err => alert(err));
}

function handlePagination(page_number) {
    loadCustomers(page_number);
}

var customerForm = document.forms.namedItem('customerForm');
customerForm.addEventListener("submit", addCustomer);




loadCustomers();