let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
	initMap();
	/* The following line erases map interaction from the Accessibility Tree: adding accesible interaction might be
	 * a waste of time, as it's redundant with infos that are more well-organized in the rest of the page */
	document.querySelectorAll("#map *, .leaflet-marker-icon").forEach(function(el) {
		el.setAttribute('tabindex', '-1')
	});
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
				scrollWheelZoom: false
			});
			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
				/* Added my mapboxToken to test it */
				mapboxToken: 'pk.eyJ1IjoiZXNjcmFsaWJ1ciIsImEiOiJjamtqazVubHowYmR3M3JwOGpxNWhhYmpqIn0.vNBGuat97Mdwsk1Dem0_wA',
				maxZoom: 18,
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
					'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
					'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				id: 'mapbox.streets'
			}).addTo(newMap);
			fillBreadcrumb();
			DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
		}
	});
}

/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

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
		error = 'No restaurant id in URL'
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
	/* ARIA attribute */
	name.setAttribute('name', restaurant.name);

	const address = document.getElementById('restaurant-address');
	address.innerHTML = restaurant.address;

	const image = document.getElementById('restaurant-img');
	image.className = 'restaurant-img';
	image.src = DBHelper.imageUrlForRestaurant(restaurant);

	const cuisine = document.getElementById('restaurant-cuisine');
	cuisine.innerHTML = restaurant.cuisine_type;

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
		row.appendChild(day);

		const time = document.createElement('td');
		time.innerHTML = operatingHours[key];
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
	container.appendChild(title);

	if (!reviews) {
		const noReviews = document.createElement('p');
		noReviews.innerHTML = 'No reviews yet!';
		container.appendChild(noReviews);
		return;
	}
	const ul = document.getElementById('reviews-list');
	/* Had to refactor this function to be able to number IDs, to add ARIA functionalities */
	for (var i = 0; i < reviews.length; i++) ul.appendChild(createReviewHTML(reviews[i], i));
	/* Previous original code
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
	*/
	container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
/* The function now uses an index to add numbered IDs to the review's contents */
createReviewHTML = (review, i) => {
	const li = document.createElement('li');
	/* A series of ARIA attributes */
	li.setAttribute('tabindex', '0');
	li.setAttribute('role', 'listitem');
	li.setAttribute('aria-label', 'Review by ' + review.name);
	li.setAttribute('aria-describedby', 'review-desc' + i);
	const name = document.createElement('p');
	/* Added a 'heading' class to work with CSS */
	name.className = 'heading';
	name.innerHTML = review.name;
	li.appendChild(name);

	/* Using a new container to hold all descriptive infos, to later be used */
	const content = document.createElement('div');
	content.id = "review-desc" + i;

	const date = document.createElement('p');
	date.innerHTML = review.date;
	content.appendChild(date);

	const rating = document.createElement('p');
	rating.innerHTML = `Rating: ${review.rating}`;
	/* Added a 'rating' class to work with CSS */
	rating.className = 'rating';
	content.appendChild(rating);

	const comments = document.createElement('p');
	comments.innerHTML = review.comments;
	content.appendChild(comments);

	li.appendChild(content);

	return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
	const breadcrumb = document.getElementById('breadcrumb');
	const li = document.createElement('li');
	li.innerHTML = restaurant.name;
	/* Adding ARIA functionalities */
	li.setAttribute('tabindex', '0');
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