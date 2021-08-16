const baseUrl = 'https://api.themoviedb.org/3/'
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500'
const apiKey = '8de499325df134207967538caa8f36b5'

$(document).ready(() => {
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
                        <a href='movie/?id=${movie.id}')><img class='rounded' src ='${imageBaseUrl}${movie.poster_path}'/></a>
                        <h4>${movie.title}</h4>
                        <p class="movie-overview">${(movie.overview != null) ? movie.overview : ''}</p>
                        <a href='movie/?id=${movie.id}') class="btn btn-secondary">Details</a>
                        <a href='movie/?id=${movie.id}') class="btn btn-primary">Watch</a>
                    </div>
                `;
            });
            
            $('#movies > .row').html(output);
        },
        error: function (xhr,status,error) {
            console.log(error);
        }
    });
}
