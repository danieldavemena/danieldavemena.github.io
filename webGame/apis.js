const movieData = async (imdbID) => {
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?i=${imdbID}&apikey=1a5bb55a`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

const movieSearch = async (title) => {
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?s=${title}&page=1&apikey=1a5bb55a`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

let movieArray = [];

document.querySelector(".movieForm").addEventListener("submit", (e) => {
  e.preventDefault();

  let movieTitle = document.querySelector(".movieForm").searchMovie.value;
  document.querySelector(".movieForm").reset();

  console.log(movieTitle);

  movieSearch(movieTitle)
    .then((data) => {
      movieData(data.Search[0].imdbID).then((movieResponse) => {
        if (movieResponse.Title == undefined) {
          document.querySelector(".movieResponse").src = "";
          document.querySelector(
            ".movieInfo"
          ).innerHTML = `<div class="responseError"><p>Reponse Error</p><h2>${movieResponse.Error}</h2></div>`;
        } else if (movieResponse.Title != undefined) {
          console.log(movieResponse);
          document.querySelector(".movieResponse").src = movieResponse.Poster;
          document.querySelector(
            ".movieInfo"
          ).innerHTML = `<h1>${movieResponse.Title}<br><p style="font-size: 8pt">(${movieResponse.Released})</p></h1><p style="font-size: 10pt;"><b>Directed by:</b><br>${movieResponse.Director}</p><p style="font-size: 10pt;"><b>Actors:</b><br>${movieResponse.Actors}</p>`;
        }
      });

      data.Search.forEach((search) => {
        movieData(search.imdbID).then((movieResponse) => {
          let data = {
            Title: movieResponse.Title,
            Poster: movieResponse.Poster,
            Release: movieResponse.Released,
            Director: movieResponse.Director,
            Actors: movieResponse.Actors,
          };

          movieArray.push(data);

          window.movies = movieArray;
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

document.querySelectorAll(".close").forEach((close) => {
  close.addEventListener("click", () => {
    document.querySelector(".movieResponse").src = "";
    document.querySelector(".movieInfo").innerHTML = "";

    document.querySelector(".tvPopup").style.top = "150%";
    document.querySelector(".signupPopup").style.top = "150%";
    document.querySelector(".loginPopup").style.top = "150%";
    setTimeout(() => {
      document.querySelector(".tvPopup").classList.add("hide");
      document.querySelector(".signupPopup").classList.add("hide");
      document.querySelector(".loginPopup").classList.add("hide");
    }, 200);

    console.log(window.movies);

    movieArray = [];
    window.popUp = false;
  });
});

document.addEventListener("keydown", (e) => {
  if (window.popUp == true && e.key == "Escape") {
    document.querySelector(".movieResponse").src = "";
    document.querySelector(".movieInfo").innerHTML = "";

    document.querySelector(".tvPopup").style.top = "150%";
    document.querySelector(".signupPopup").style.top = "150%";
    document.querySelector(".loginPopup").style.top = "150%";
    document.querySelector(".chatSection").style.left = "-500px";
    setTimeout(() => {
      document.querySelector(".tvPopup").classList.add("hide");
      document.querySelector(".signupPopup").classList.add("hide");
      document.querySelector(".loginPopup").classList.add("hide");
    }, 200);

    movieArray = [];
    window.popUp = false;
  }
});
