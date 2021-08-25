const baseUrl = 'https://api.themoviedb.org/3/'
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500'
const apiKey = '8de499325df134207967538caa8f36b5'
const user = '1110010 1100101 1110100 1110011 1100001 1101101'
const pass = '1100101 1110011 1100001 1100101 1101100 1110000'

function text2Binary(string) {
    return string.split('').map(function (char) {
        return char.charCodeAt(0).toString(2);
    }).join(' ');
}
function stringReverse(string) {
    return string.split("").reverse().join("");
}

function login(username, password) {
    if (username == user && password == pass) {
        localStorage.setItem('logindataformovie', `user=${user}&pass=${pass}`);
        console.log(localStorage.getItem('logindataformovie'));
        return true
    } else {
        return false
    }
}



$('input#username').keyup((e) => { 
    document.querySelector('input#username').value = document.querySelector('input#username').value.toLowerCase();
});

$('input#username').change((e) => { 
    document.querySelector('input#username').value = document.querySelector('input#username').value.toLowerCase();
});

$("#login").submit((e)=>{
    e.preventDefault();
    let status = login(text2Binary(stringReverse($("#login").serializeArray()[0].value)), text2Binary(stringReverse($("#login").
    serializeArray()[1].value)));
    if (status) {
        login(text2Binary(stringReverse($("#login").serializeArray()[0].value)), text2Binary(stringReverse($("#login").
    serializeArray()[1].value)));
        window.location.reload()
    } else {
        alert('failure')
        $.each($("input"), (index,value) => {
            value.value = ''
        });
    }
});
$(document).ready(() => {
    if (localStorage.getItem('logindataformovie') == `user=${user}&pass=${pass}`) {
        loggedInUser()
    }
});

function loggedInUser()
{
$(document).ready(() => {
    document.title ="Watch Movies"
    document.body.innerHTML =   `
        
    <nav class="navbar navbar-dark bg-dark">
        <div class="container">
            <div class="navbar-header">
                <a href="" class="navbar-brand">Exortix Movies</a>
            </div>
            <form action="" id="searchForm">
                <input type="text" name="" id="searchText" class="form-control" placeholder="Search Movies">
            </form>
        </div>
    </nav>

    <div class="container" style="visibility: hidden;">
        <div class="jumbotron">
            <h3 class="text-center">My<strong>Movie</strong>Search</h3>
            <form action="" id="searchForm">
                <input type="text" name="" id="searchText" class="form-control" placeholder="Search Movies">
            </form>
        </div>
    </div>

    <div class="container" id="movies">
        <div class="row">
            
        </div>
    </div>
    <!-- Option 1: Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-U1DAWAznBHeqEIlVSCgzq+c9gqGAJn5c/t99JyeKa9xxaYpSvHU5awsuZVVFIhvj" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="js/main.js"></script>
    `


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
            if (movies.length == 0) {
                $('#movies > .row').html(`<h2>No Results Found!</h2>`);
                return;
            }
            let output = '';
            $.each(movies, (index, movie) => {
                if (movie.poster_path == null)
                    return

                output += `
                    <div class="col movie rounded">
                        <a href='movie/?id=${movie.id}')><img class='rounded' src ='${imageBaseUrl}${movie.poster_path}'
                        onerror="this.src='https://dummyimage.com/500x750/ffffff/000000.jpg&text=no+image';"/></a>
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
}