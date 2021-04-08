// let showContainer;
let rootElem;
let shows = getAllShows().sort((a, b) => a.name.localeCompare(b.name)); // sorts shows in alphabetical order
let episodesContainer; // <div> for all episodes (container)
let listOfEpisodes; // ul
let allEpisodes;
let quantityOfEpisodes; // <span> to show how many episodes are shown on the page

const generateUrl = (id) => {
  return `https://api.tvmaze.com/shows/${id}/episodes`;
};

const setup = () => {
  setupControls();
  renderAllShows(shows);
  // renderShowOptions(shows);
  // startFetching(generateUrl(shows[0].id));
};

const setupControls = () => {
  // create "containers" for episodes and append them to "root" element
  rootElem = document.getElementById("root");
  // showContainer = document.createElement("div");
  episodesContainer = document.createElement("div");
  episodesContainer.className += "episodes-container container";
  quantityOfEpisodes = document.createElement("span");
  listOfEpisodes = document.createElement("div");
  listOfEpisodes.className += "row row-cols-md-3 gx-5 list-of-episode";
  episodesContainer.append(listOfEpisodes);
  rootElem.append(quantityOfEpisodes, episodesContainer);

  // find user input and show all episodes if input field is empty (edge case)
  const searchInput = document.querySelector("#site-search");
  searchInput.addEventListener("input", () => {
    const value = searchInput.value;
    if (value === "") {
      makePageForEpisodes(allEpisodes);
      return;
    }

    // filter all episodes and show only the ones that include the same words as user input
    const filteredList = allEpisodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(value.toLowerCase()) ||
        episode.summary.toLowerCase().includes(value.toLowerCase())
      );
    });

    makePageForEpisodes(filteredList);
  });

  const showAllButton = document.querySelector("#show-all-episodes");
  showAllButton.addEventListener("click", () =>
    makePageForEpisodes(allEpisodes)
  );
};

const startFetching = (url) => {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw response.status;
      }
    })
    .then((episodes) => {
      allEpisodes = episodes;
      makePageForEpisodes(episodes);
      renderEpisodeOptions(episodes);
    })
    .catch((error) => {
      alert(`Error: ${error}`);
    });
};

// takes a list of episodes, creates html tags for each episode and renders those episodes on the page.
const makePageForEpisodes = (episodeList) => {
  listOfEpisodes.innerHTML = "";
  quantityOfEpisodes.innerHTML = `Displaying ${episodeList.length} of ${allEpisodes.length}`;
  for (let episode of episodeList) {
    // if (episode.image == null || episode.summary == null) {
    //   continue;
    // }
    const episodeItem = document.createElement("div");
    episodeItem.className += "col item";
    const episodeContainer = document.createElement("div");
    episodeContainer.className += "p-3 h-100 inside";
    const episodeTitle = document.createElement("h4");
    episodeTitle.className += "episode-title";

    if (episode.number > 9) {
      episodeTitle.innerText = `${episode.name} - S0${episode.season}E${episode.number}`;
    } else {
      episodeTitle.innerText = `${episode.name} - S0${episode.season}E0${episode.number}`;
    }

    // Creating episodeImage only if there is a valid episode.image
    let episodeImage;
    if (episode.image != null) {
      episodeImage = document.createElement("img");
      episodeImage.className += "episode-image";
      episodeImage.src = episode.image.medium;
    }
    const episodeSummary = document.createElement("div");
    episodeSummary.className += "episode-summary";
    episodeSummary.innerHTML = `${episode.summary}`;

    episodeItem.append(episodeContainer);
    episodeContainer.append(episodeTitle);
    if (episodeImage !== undefined) {
      episodeContainer.append(episodeImage);
    }
    episodeContainer.append(episodeSummary);
    listOfEpisodes.append(episodeItem);
  }
};

const renderAllShows = (listOfShows) => {
  const allShowsContainer = document.createElement("section");
  allShowsContainer.setAttribute("id", "all-shows");

  for (const show of listOfShows) {
    const showContainer = document.createElement("article");
    showContainer.className += "show";
    showContainer.setAttribute("id", show.id);

    const aboutShowContainer = document.createElement("div");
    aboutShowContainer.className += "row about-show-container";

    // title of the show
    const showName = document.createElement("div");
    showName.className += "show-name";
    const showHeader = document.createElement("h1");
    showHeader.innerText = show.name;
    showName.append(showHeader);

    // cover of the show
    const showImageContainer = document.createElement("div");
    showImageContainer.className += "col-md-3 col-12 show-image";
    const showImage = document.createElement("img");
    if (show.image == null) {
      continue;
    }
    showImage.src = show.image.original;

    showImageContainer.append(showImage);

    // summary of the show
    const showSummaryContainer = document.createElement("div");
    showSummaryContainer.className += "col-md-3 col-12 show-summary";
    showSummaryContainer.innerHTML = show.summary;

    // details of the show
    const showDetails = document.createElement("div");
    showDetails.className += "col-md-3 col-12 show-details";

    // const createPEl = ({
    //   genres,
    //   status,
    //   rating: { average: rating },
    //   runtime,
    // }) => {
    //   for (let i = 0; i < 4; i++) {
    //     const p = document.createElement("p");
    //     p.innerText = genres;

    //     showDetails.append(p);
    //   }
    // };

    // createPEl(show);

    const {
      genres,
      status,
      rating: { average: rating },
      runtime,
    } = show;

    const genresP = document.createElement("p");
    genresP.innerText = genres;
    const statusP = document.createElement("p");
    statusP.innerText = status;
    const ratingP = document.createElement("p");
    ratingP.innerText = rating;
    const runtimeP = document.createElement("p");
    runtimeP.innerText = runtime;

    showDetails.append(genresP, statusP, ratingP, runtimeP);

    showContainer.append(showName, aboutShowContainer);
    aboutShowContainer.append(
      showImageContainer,
      showSummaryContainer,
      showDetails
    );

    allShowsContainer.append(showContainer);
  }

  rootElem.appendChild(allShowsContainer);
};

// creates and adds options to <select> (selectEl) tag
const renderEpisodeOptions = (episodeList) => {
  const episodeSelect = document.querySelector("#select-episodes");
  // show only chosen episode
  episodeSelect.addEventListener("change", (event) => {
    // const value = episodeSelect.value;
    const episodeID = Number(event.target.value);
    const filteredEpisodes = episodeList.filter(
      (episode) => episode.id === episodeID
    );

    makePageForEpisodes(filteredEpisodes);
  });

  episodeSelect.innerText = "";

  for (let episodeItem of episodeList) {
    const episodeOption = document.createElement("option");
    episodeOption.setAttribute("value", episodeItem.id);
    const season = `${episodeItem.season}`.padStart(2, "0");
    const episode = `${episodeItem.number}`.padStart(2, "0");
    episodeOption.innerText = `S${season}E${episode} - ${episodeItem.name}`;
    episodeSelect.append(episodeOption);
  }
};

const renderShowOptions = (showList) => {
  const showSelect = document.querySelector("#select-shows");

  for (let show of showList) {
    const showOption = document.createElement("option");
    showOption.setAttribute("value", show.id);
    showOption.innerText = show.name;
    showSelect.append(showOption);
  }

  showSelect.addEventListener("change", (event) => {
    const showID = event.target.value;
    const URL = generateUrl(showID);
    startFetching(URL);
  });
};

window.onload = setup;
