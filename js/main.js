const baseUrl = 'https://api.themoviedb.org/3/'
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500'
const apiKey = '8de499325df134207967538caa8f36b5'

$(document).ready(() => {
    if (document.title ==="Watch Movies")
    {
        $('#searchForm').submit( function(e){ 
            e.preventDefault();
        })
        let searchText = $('#searchText').val();
        getMovies(searchText);
        $('#searchForm').on("input", (e) => {
            searchText = $('#searchText').val();
            getMovies(searchText);
            e.preventDefault();
        });
    }
});

function getMovies(searchText) {
    let searchUrl;
    if (searchText.length < 3)
        searchUrl = `${baseUrl}movie/popular?api_key=${apiKey}&language=en-US&page=1`
    else
        searchUrl = `${baseUrl}search/movie?api_key=${apiKey}&language=en-US&query=${searchText}&page=1&include_adult=false&external_source=imdb_id&append_to_response=external_ids` 
    $.ajax({
        type: "GET",
        url: searchUrl,
        success: function (response) {
            let movies = response.results;
            let output = '';
            $.each(movies, (index, movie) => {
                if (movie.poster_path == null)
                    return
                output += `
                    <div class="col movie rounded">
                        <a onclick="movieSelected('${movie.id}')"><img class='rounded' src ='${imageBaseUrl}${movie.poster_path}'/></a>
                        <h4>${movie.title}</h4>
                        <p class="movie-overview">${(movie.overview != null) ? movie.overview : ''}</p>
                        <a onclick="movieSelected('${movie.id}')" class="btn btn-secondary">Details</a>
                        <a onclick="movieSelected('${movie.id}')" class="btn btn-primary">Watch</a>
                    </div>
                `;
            });
            
            $('#movies > .row').html(output);
        },
        error: function (xhr,status,error) {
            console.log(error)
        }
    });
}

function movieSelected(id) {
    sessionStorage.setItem('movieId', id);
    window.location = `movie.html`;
    return false;
}

function getMovie() {
    let movieId = sessionStorage.getItem('movieId');
    let getMovieUrl = `${baseUrl}movie/${movieId}?api_key=${apiKey}`
    $.ajax({
        type: "GET",
        url: getMovieUrl,
        success: function (response) {
            let movie = response;
            let genres = movie.genres.map(a => a.name);
            let producers = movie.production_companies.map(a => a.name);
            let output = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="${imageBaseUrl}${movie.poster_path}" class="thumbnail">
                    </div>
                    <div class="col-md-8">
                        <h2>${movie.title}</h2>
                        <h2 id='originalTitle'>${movie.original_title}</h2>
                        <ul class="list-group">
                            <li class="list-group-item"><strong>Genre:</strong> ${genres}</li>
                            <li class="list-group-item"><strong>Released:</strong> ${movie.release_date}</li>
                            <li class="list-group-item"><strong>Vote Average:</strong> ${movie.vote_average}</li>
                            <li class="list-group-item"><strong>Vote Count:</strong> ${movie.vote_count}</li>
                            <li class="list-group-item"><strong>Produced By:</strong> ${producers}</li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <h3>Overview</h3>
                        ${movie.overview}
                        <hr>
                        <a href="#embed" class="btn btn-default">Watch Now</a>
                        <a href="index.html" class="btn btn-default">Back to Search</a>
                     
            `;
            $('#movie').html(output);
            if (movie.title == movie.original_title)
                $('#originalTitle').css('display', 'none');
            output = `<iframe allowfullscreen="allowfullscreen" id="iframe" sandbox = "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation" src="https://www.2embed.ru/embed/imdb/movie?id=${movie.imdb_id}" width="100%" height="100%" frameborder="0"></iframe>`
            $('#embed').html(output);
        },
        error: function (xhr,status,error) {
            console.log(error)
        }
    });
}
