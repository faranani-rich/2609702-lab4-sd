document.getElementById('search-btn').addEventListener('click', function() {
  const countryName = document.getElementById('country-input').value.trim();
  if (!countryName) {
    alert("Please enter a country name.");
    return;
  }
  fetchCountryData(countryName);
});

async function fetchCountryData(countryName) {
  try {
    // Fetch country data by full name
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
    if (!response.ok) {
      throw new Error("Country not found");
    }
    const data = await response.json();
    const country = data[0]; // using the first result
    displayCountryInfo(country);

    // If the country has bordering countries, display them
    if (country.borders && country.borders.length > 0) {
      displayBorderCountries(country.borders);
    } else {
      document.getElementById('bordering-countries').innerHTML = "<p>No bordering countries found.</p>";
    }
  } catch (error) {
    document.getElementById('country-info').innerHTML = `<p>Error: ${error.message}</p>`;
    document.getElementById('bordering-countries').innerHTML = "";
  }
}

function displayCountryInfo(country) {
  const countryInfoDiv = document.getElementById('country-info');
  const capital = country.capital ? country.capital[0] : 'N/A';
  const population = country.population.toLocaleString();
  const region = country.region;
  const flagUrl = country.flags && country.flags.png ? country.flags.png : '';

  countryInfoDiv.innerHTML = `
    <h2>${country.name.common}</h2>
    <p><strong>Capital:</strong> ${capital}</p>
    <p><strong>Population:</strong> ${population}</p>
    <p><strong>Region:</strong> ${region}</p>
    ${flagUrl ? `<img src="${flagUrl}" alt="Flag of ${country.name.common}" class="flag">` : ''}
  `;
}

async function displayBorderCountries(borders) {
  const borderingDiv = document.getElementById('bordering-countries');
  borderingDiv.innerHTML = "<h3>Bordering Countries:</h3>";

  // For each border code, fetch country data
  for (let code of borders) {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
      if (!response.ok) {
        throw new Error("Border country not found");
      }
      const data = await response.json();
      const borderCountry = data[0];
      const borderCountryName = borderCountry.name.common;
      const borderFlagUrl = borderCountry.flags && borderCountry.flags.png ? borderCountry.flags.png : '';

      const countryCard = document.createElement('div');
      countryCard.classList.add('country-card');
      countryCard.innerHTML = `
        <h4>${borderCountryName}</h4>
        ${borderFlagUrl ? `<img src="${borderFlagUrl}" alt="Flag of ${borderCountryName}" class="flag">` : ''}
      `;
      borderingDiv.appendChild(countryCard);
    } catch (error) {
      console.error("Error fetching border country data:", error);
    }
  }
}
