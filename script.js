// ==========================================
// WEATHER APP
// ==========================================

const getWeather = async () => {

    // Get city entered by user
    const city = document.getElementById("cityInput").value.trim();

    const result = document.getElementById("weatherResult");

    // Check empty input
    if (city === "") {
        result.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }

    // Show loading message
    result.innerHTML = "<p>Loading weather...</p>";

    try {

        // Step 1: Find city coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to find city.");
        }

        const geoData = await geoResponse.json();

        // Check whether city exists
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found.");
        }

        // Destructuring
        const {
            latitude,
            longitude,
            name,
            country
        } = geoData.results[0];


        // Step 2: Get weather information
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Weather data could not be loaded.");
        }

        const weatherData = await weatherResponse.json();

        // Destructuring
        const {
            temperature_2m,
            relative_humidity_2m,
            wind_speed_10m,
            weather_code
        } = weatherData.current;


        // Display weather
        result.innerHTML = `
            <div class="weather-card">

                <h3>${name}, ${country}</h3>

                <p>
                    🌡️ Temperature:
                    <strong>${temperature_2m} °C</strong>
                </p>

                <p>
                    💧 Humidity:
                    <strong>${relative_humidity_2m}%</strong>
                </p>

                <p>
                    💨 Wind Speed:
                    <strong>${wind_speed_10m} km/h</strong>
                </p>

                <p>
                    ☁️ Weather Code:
                    <strong>${weather_code}</strong>
                </p>

            </div>
        `;

    } catch (error) {

        // Error handling
        result.innerHTML = `
            <p>
                ❌ ${error.message}
            </p>
        `;
    }
};


// ==========================================
// MOVIE SEARCH APP
// ==========================================

// Replace this with YOUR actual OMDb API key
const OMDB_API_KEY = "4a6fa668";


const searchMovies = async () => {

    // Get movie name
    const movieName =
        document.getElementById("movieInput").value.trim();

    const movieResult =
        document.getElementById("movieResult");


    // Check empty input
    if (movieName === "") {

        movieResult.innerHTML =
            "<p>Please enter a movie name.</p>";

        return;
    }


    // Loading message
    movieResult.innerHTML =
        "<p>Searching movies...</p>";


    try {

        // Fetch movie data
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(movieName)}`
        );


        if (!response.ok) {
            throw new Error("Unable to connect to movie API.");
        }


        // Convert response to JSON
        const data = await response.json();


        // Check API response
        if (data.Response === "False") {

            throw new Error(
                data.Error || "No movies found."
            );
        }


        // Create movie cards
        movieResult.innerHTML = data.Search.map(movie => `

            <article class="movie-card">

                <img
                    src="${
                        movie.Poster !== "N/A"
                        ? movie.Poster
                        : "https://via.placeholder.com/300x400?text=No+Poster"
                    }"
                    alt="${movie.Title}"
                >

                <h3>${movie.Title}</h3>

                <p>
                    🎬 Type:
                    ${movie.Type}
                </p>

                <p>
                    📅 Release Year:
                    ${movie.Year}
                </p>

            </article>

        `).join("");


    } catch (error) {

        // Error handling
        movieResult.innerHTML = `
            <p>
                ❌ ${error.message}
            </p>
        `;
    }
};