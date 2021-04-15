let episodesRoot;
let showsRoot;
let shows = getAllShows().sort((a, b) => a.name.localeCompare(b.name)); // sorts shows in alphabetical order
let episodesContainer; // <div> for all episodes (container)
let listOfEpisodes; // ul for episodes
let allEpisodes;
let allShowsContainer;
let quantityOfEpisodes; // <span> to show how many episodes are shown on the page

const setup = () => {
  episodesRoot = document.getElementById("episodes-root");
  showsRoot = document.querySelector("#shows-root");
  setupShowsControls();
  setupEpisodesScreen();
  renderAllShows(shows);
  renderShowOptions(shows);
};

const switchToEpisodesPage = (showID) => {
  showsRoot.classList.add("hidden");
  episodesRoot.classList.remove("hidden");
  fetchEpisodes(showID);
};

const switchToShowsPage = () => {
  episodesRoot.classList.add("hidden");
  showsRoot.classList.remove("hidden");
};

const setupEpisodesScreen = () => {
  // create "containers" for episodes and append them to "root" element
  episodesContainer = document.createElement("div");
  episodesContainer.classList.add("episodes-container", "container");
  quantityOfEpisodes = document.createElement("span");
  listOfEpisodes = document.createElement("div");
  listOfEpisodes.classList.add(
    "row",
    "row-cols-md-3",
    "gx-5",
    "list-of-episodes"
  );
  episodesContainer.append(listOfEpisodes);
  episodesRoot.append(quantityOfEpisodes, episodesContainer);

  // find user input and show all episodes if input field is empty
  const searchInput = document.querySelector("#episodes-search");
  searchInput.addEventListener("input", () => {
    const value = searchInput.value;
    if (value === "") {
      makePageForEpisodes(allEpisodes);
      return;
    }

    // filter all episodes and show only the ones that include the same words as user input
    const filteredList = filterByUserInput(allEpisodes, value);
    makePageForEpisodes(filteredList);
  });

  // shows all episodes
  const showAllButton = document.querySelector("#episodes-show-all");
  showAllButton.addEventListener("click", () =>
    makePageForEpisodes(allEpisodes)
  );

  // goes back to shows page
  const backToShowsButton = document.querySelector("#back-button");
  backToShowsButton.addEventListener("click", () => {
    switchToShowsPage();
  });
};

// filters episodes
const filterByUserInput = (list, value) => {
  return list.filter((element) => {
    return (
      element.name.toLowerCase().includes(value.toLowerCase()) ||
      element.summary.toLowerCase().includes(value.toLowerCase())
    );
  });
};

const fetchEpisodes = (showID) => {
  const url = `https://api.tvmaze.com/shows/${showID}/episodes`;
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
    episodeItem.classList.add("col", "item");
    const episodeContainer = document.createElement("div");
    episodeContainer.classList.add("p-3", "h-100", "inside");
    const episodeTitle = document.createElement("h4");
    episodeTitle.classList.add("episode-title");

    if (episode.number > 9) {
      episodeTitle.innerText = `${episode.name} - S0${episode.season}E${episode.number}`;
    } else {
      episodeTitle.innerText = `${episode.name} - S0${episode.season}E0${episode.number}`;
    }

    // Creating episodeImage only if there is a valid episode.image
    let episodeImage;
    if (episode.image != null) {
      episodeImage = document.createElement("img");
      episodeImage.classList.add("episode-image");
      episodeImage.src = episode.image.medium;
    }

    const episodeSummary = document.createElement("div");
    episodeSummary.classList.add("episode-summary");
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
  allShowsContainer.innerHTML = "";

  for (const show of listOfShows) {
    const showContainer = document.createElement("article");
    showContainer.classList.add("show");

    const aboutShowContainer = document.createElement("div");
    aboutShowContainer.classList.add("row", "about-show-container");

    // title of the show
    const showHeader = document.createElement("h1");
    showHeader.classList.add("show-name");
    const showHeaderLink = document.createElement("a");
    showHeaderLink.href = "#";
    showHeaderLink.innerText = show.name;

    showHeader.append(showHeaderLink);

    showHeaderLink.addEventListener("click", () => {
      switchToEpisodesPage(show.id);
    });

    // cover of the show
    const showImageContainer = document.createElement("div");
    showImageContainer.classList.add("col-md-3", "col-12", "show-image");
    const showImage = document.createElement("img");
    showImage.src = show.image?.medium;

    showImageContainer.append(showImage);

    // summary of the show
    const showSummaryContainer = document.createElement("div");
    showSummaryContainer.classList.add("col-md-3", "col-12", "show-summary");
    showSummaryContainer.innerHTML = show.summary;

    // details of the show
    const showDetails = document.createElement("div");
    showDetails.classList.add("col-md-3", "col-12", "show-details");

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

    showContainer.append(showHeader, aboutShowContainer);
    aboutShowContainer.append(
      showImageContainer,
      showSummaryContainer,
      showDetails
    );

    allShowsContainer.append(showContainer);
  }
};

// creates and adds options to <select> (selectEl) tag
const renderEpisodeOptions = (episodeList) => {
  const episodeSelect = document.querySelector("#episodes-select");
  // show only chosen episode
  episodeSelect.addEventListener("change", (event) => {
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
  const showSelect = document.querySelector("#shows-select");
  showSelect.innerHTML = "";

  for (let show of showList) {
    const showOption = document.createElement("option");
    showOption.setAttribute("value", show.id);
    showOption.innerText = show.name;
    showSelect.append(showOption);
  }

  showSelect.addEventListener("change", (event) => {
    const showID = Number(event.target.value);
    const filteredShows = showList.filter((show) => show.id === showID);
    renderAllShows(filteredShows);
  });
};

const setupShowsControls = () => {
  const showsSearchInput = document.querySelector("#shows-search");
  showsSearchInput.addEventListener("input", () => {
    if (showsSearchInput.value === "") {
      renderAllShows(shows);
      return;
    }

    // const filteredShows = filterByUserInput(shows, showsSearchInput.value);
    const value = showsSearchInput.value.toLowerCase();
    const filteredShows = shows.filter((element) => {
      return (
        element.name.toLowerCase().includes(value) ||
        element.summary.toLowerCase().includes(value) ||
        element.genres.join(",").toLowerCase().includes(value)
      );
    });
    renderAllShows(filteredShows);
    renderShowOptions(filteredShows);
  });

  allShowsContainer = document.createElement("section");
  allShowsContainer.setAttribute("id", "all-shows");
  showsRoot.appendChild(allShowsContainer);
};

window.onload = setup;
