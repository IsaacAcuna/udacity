let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
    fetchRestaurantFromURL((error, restaurant) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.newMap = L.map('map', {
                center: [restaurant.latlng.lat, restaurant.latlng.lng],
                zoom: 16,
                scrollWheelZoom: false,
                attributionControl: false
            });
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
                    mapboxToken: 'pk.eyJ1IjoiaWFjdW5hIiwiYSI6ImNqbm5sZ20yczI3dnkzd216NnVpZWQ3MnEifQ.SoSoFIX5fo64U5Hvk8FMSg',
                    maxZoom: 18,
                    attribution: '<span aria-hidden="true" tabindex="-1">Map data &copy; <a href="https://www.openstreetmap.org/" tabindex="-1">OpenStreetMap</a> contributors, ' +
                        '<a href="https://creativecommons.org/licenses/by-sa/2.0/" tabindex="-1">CC-BY-SA</a>, ' +
                        'Imagery © <a href="https://www.mapbox.com/" tabindex="-1">Mapbox</a></span>',
                    id: 'mapbox.streets'
                })
                .addTo(newMap);
            fillBreadcrumb();
            DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
        }
    });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
    if (self.restaurant) { // restaurant already fetched!
        callback(null, self.restaurant)
        return;
    }
    const id = getParameterByName('id');
    if (!id) { // no id found in URL
        error = 'Opps! Something must\'ve broken, please try that again. <a href="javascript:history.back()" role="button">Go Back</a>';
        callback(error, null);
    } else {
        DBHelper.fetchRestaurantById(id, (error, restaurant) => {
            self.restaurant = restaurant;
            if (!restaurant) {
                console.error(error);
                return;
            }
            fillRestaurantHTML();
            callback(null, restaurant)
        });
    }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;

    const address = document.getElementById('restaurant-address');
    address.innerHTML = "Address: " + restaurant.address;

    const image = document.getElementById('restaurant-img');
    image.className = 'restaurant-img'
    image.src = DBHelper.imageUrlForRestaurant(restaurant);

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = "cuisine: " + restaurant.cuisine_type;

    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }
    // fill reviews
    fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
    const hours = document.getElementById('restaurant-hours');
    for (let key in operatingHours) {
        const row = document.createElement('tr');

        const day = document.createElement('td');
        day.innerHTML = key;
        day.tabIndex = '0';
        row.appendChild(day);

        const time = document.createElement('td');
        time.innerHTML = operatingHours[key];
        time.tabIndex = '0';
        row.appendChild(time);

        hours.appendChild(row);
    }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
    const container = document.getElementById('reviews-container');
    const title = document.createElement('h2');
    title.innerHTML = 'Reviews';
    title.tabIndex = "0";
    container.appendChild(title);

    if (!reviews) {
        const noReviews = document.createElement('p');
        noReviews.innerHTML = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
    }
    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
        ul.appendChild(createReviewHTML(review));
    });
    container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
    const li = document.createElement('li');
    li.tabIndex = '0';
    li.setAttribute('aria-label', 'Review');
    const name = document.createElement('p');
    name.innerHTML = '<span class="strong">Reviewer\'s name: </span>' + review.name;
    name.tabIndex = '0';
    li.appendChild(name);

    const date = document.createElement('p');
    date.innerHTML = '<span class="strong">Review date: </span>' + review.date;
    date.tabIndex = '0';
    li.appendChild(date);

    const rating = document.createElement('p');
    rating.innerHTML = '<span class="strong">Reviewer\'s Rating: </span>' + review.rating;
    rating.tabIndex = '0';
    li.appendChild(rating);

    const comments = document.createElement('p');
    comments.tabIndex = '0';
    comments.innerHTML = review.comments;
    li.appendChild(comments);

    return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
    const breadcrumb = document.getElementById('breadcrumb');
    const li = document.createElement('li');
    li.tabIndex = "-1";
    li.innerHTML = restaurant.name;
    breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}