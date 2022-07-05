const baseUrl = 'https://api.themoviedb.org/3/'
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500'
const apiKey = '8de499325df134207967538caa8f36b5'
const user = '1110010 1100101 1110100 1110011 1100001 1101101'
const pass = '1100101 1110011 1100001 1100101 1101100 1110000'



$(document).ready(() => {
    if (!(localStorage.getItem('logindataformovie') == `user=${user}&pass=${pass}`)) {
        window.location.href = "../";
    }
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('id')) {
        let movieId = searchParams.get('id') ;
        getMovie(movieId);
    } else {
        window.location.href = "../";
    }
});



function getMovie(movieId) {
    let getMovieUrl = `${baseUrl}movie/${movieId}?api_key=${apiKey}`;
    $.ajax({
        type: "GET",
        url: getMovieUrl,
        success: function (response) {
            let movie = response;
            let genres = movie.genres.map(a => a.name);
            let producers = movie.production_companies.map(a => a.name);
            let output = `
                <div class="row">
                    <div class="col-sm col-lg-4">
                        <img src="${imageBaseUrl}${movie.poster_path}" class="thumbnail"
                        onerror="this.src='https://dummyimage.com/500x750/ffffff/000000.jpg&text=no+image'; this.style.border='1px solid'; ">
                    </div>
                    <div class="col-sm col-lg-8">
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
                        <a href="#embedContainer" class="btn btn-default">Watch Now</a>
                        <a href="../" class="btn btn-default">Back to Search</a>
                     
            `;
            $('#movie').html(output);
            if (movie.title == movie.original_title)
                $('#originalTitle').css('display', 'none');
            output = `<iframe id="iframe" src="https://www.2embed.to/embed/imdb/movie?id=${movie.imdb_id}"  height="100%" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" frameborder="0"></iframe>`
            $('#embed').html(output);
        },
        error: function (xhr,status,error) {
            console.log(error);
            window.location.href = "../";
        }
    });
}