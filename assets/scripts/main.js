const input = document.querySelector('#address-input');
const propertiesContainer = document.querySelector('.properties-content');
const searchContainer = document.querySelector('.search-description-container');
const selectedCity = document.querySelector('.selected-city-container');

const amenitiesDictionary = {
	AIR_CONDITIONING: 'Ar Condicionado',
	AMERICAN_KITCHEN: 'Cozinha Americana',
	BARBECUE_GRILL: 'Churrasqueira',
	BICYCLES_PLACE: 'Bicicletário',
	CINEMA: 'Cinema',
	ELECTRONIC_GATE: 'Portaria Eletrônica',
	ELEVATOR: 'Elevador',
	FIREPLACE: 'Lareira',
	FURNISHED: 'Mobiliado',
	GARDEN: 'Jardim',
	GATED_COMMUNITY: 'Condomínio Fechado',
	GYM: 'Academia',
	LAUNDRY: 'Lavanderia',
	PARTY_HALL: 'Salão de Festas',
	PETS_ALLOWED: 'Aceita PETS',
	PLAYGROUND: 'Playground',
	POOL: 'Piscina',
	SAUNA: 'Sauna',
	SPORTS_COURT: 'Quadra de Esportes',
	TENNIS_COURT: 'Quadra de Tênis',
};

function numberWithDots(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

async function getPropertiesFromApi(state, city) {
	const response = await fetch(
		`https://private-9e061d-piweb.apiary-mock.com/venda?state=${state}&city=${city}`
	);
	return response.json();
}

async function handleProporties(state, city) {
	const answer = await getPropertiesFromApi(state, city);

	let properties = [];
	const totalFoundedProperties = answer.search.totalCount;

	answer.search.result.listings.map((propertie) => {
		properties.push({
			name: propertie.link.name,
			address: propertie.listing.address,
			price: propertie.listing.pricingInfos,
			amenities: propertie.listing.amenities,
			usableArea: propertie.listing.usableAreas,
			bedrooms: propertie.listing.bedrooms,
			bathrooms: propertie.listing.bathrooms,
			parkingSpaces: propertie.listing.parkingSpaces,
			img: propertie.medias,
		});
	});

	return { properties, totalFoundedProperties };
}

function htmlInsertCityStats(state, city) {
	if (state && city) {
		selectedCity.innerHTML = `
	<p class="selected-city">
		${city} - ${state} <span class="end-search">x</span>
	</p>
	`;
	} else {
		selectedCity.innerHTML = '';
	}
}

function htmlInsertpropertiesQuantity(propertiesQuantity, city, state) {
	if (propertiesQuantity && city) {
		searchContainer.innerHTML = `
	<p class="search-description">
		<span class="bold-span">${propertiesQuantity}</span> Ofertas de imóveis à
		venda em ${city} - ${state}
	</p>
	`;
	} else {
		searchContainer.innerHTML = '';
	}
}

function htmlPropertyCardConstructor(properties) {
	let cardsToInsert = '';

	if (properties) {
		properties.forEach((property) => {
			cardsToInsert += `
		<div class="property-card">
			<div class="property-img-container">
				<img src="${property.img[0].url}" alt="" />
			</div>
			<div class="property-text-container">
				<p class="property-addres">
					${property.address.street}, ${property.address.streetNumber} - ${property.address.neighborhood}, ${property.address.city} - ${property.address.stateAcronym}
				</p>
				<h3 class="property-name">
					${property.name}
				</h3>
				<ul class="property-details">
					<li><span class="bold-span">${property.usableArea[0]}</span> m²</li>
					<li><span class="bold-span">${property.bedrooms[0]}</span> Quartos</li>
					<li><span class="bold-span">${property.bathrooms[0]}</span> Banheiro</li>
					<li><span class="bold-span">${property.parkingSpaces[0]}</span> Vaga</li>
				</ul>
				<ul class="amenities-list">
				`;

			try {
				property.amenities.forEach((amenity) => {
					cardsToInsert += `
			<li>${amenitiesDictionary[amenity]}</li>
			`;
				});
			} catch {
				console.log('não possui ameneties');
			}

			cardsToInsert += `
				</ul>
				<div class="property-price">
					<span class="bold-span">R$ ${numberWithDots(property.price[0].price)}</span>
					<span
						>Condomínio: <span class="bold-span">R$ ${
							property.price[0].monthlyCondoFee
								? property.price[0].monthlyCondoFee
								: 0
						}</span></span
					>
				</div>
			</div>
		</div>
		`;
		});

		propertiesContainer.innerHTML = cardsToInsert;
	} else {
		propertiesContainer.innerHTML = `<div>
		<p
			style="
				font-size: 100px;
				color: #aaa;
				margin: 100px 0 0;
				text-align: center;
			"
		>
			500
		</p>
		<p
			style="
				font-size: 50px;
				color: #000;
				margin: 0;
				text-align: center;
			"
		>
			Ops!
		</p>
		<p
			style="
				font-size: 20px;
				color: #000;
				margin: 0;
				text-align: center;
			"
		>
			Algo deu errado na sua busca por favor, tente novamente!
		</p>
	</div>`;
	}
}

async function searchProperties(state, city, visualState, visualCity) {
	try {
		const searchResult = await handleProporties(state, city);

		htmlInsertCityStats(visualState, visualCity);

		htmlInsertpropertiesQuantity(
			searchResult.totalFoundedProperties,
			visualCity,
			visualState
		);

		htmlPropertyCardConstructor(searchResult.properties);
	} catch {
		htmlInsertCityStats();
		htmlInsertpropertiesQuantity();
		htmlPropertyCardConstructor();
	}
}

function handleInputValue(value) {
	if (value[0].toUpperCase() === 'S') {
		searchProperties('sp', 'sao-paulo', 'SP', 'São Paulo');
	} else if (value[0].toUpperCase() === 'R') {
		searchProperties('rj', 'rio-de-janeiro', 'RJ', 'Rio de janeiro');
	} else {
		searchProperties(value);
	}
}

input.addEventListener('keyup', (e) => {
	if (e.key === 'Enter') {
		handleInputValue(input.value);
	}
});
