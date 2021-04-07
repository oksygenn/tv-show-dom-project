// let showContainer;
let shows = getAllShows();
let episodesContainer; // <div> for all episodes (container)
let listOfEpisodes; // ul
let allEpisodes;
let quantityOfEpisodes; // <span> to show how many episodes are shown on the page

const filteredShows = shows.sort((a, b) => a.name.localeCompare(b.name));
//.map((show) => show.name).sort();

console.log(filteredShows);

const generateUrl = (id) => {
  return `https://api.tvmaze.com/shows/${id}/episodes`;
};

const setup = () => {
  renderShowOptions(filteredShows);
  setupControls();
  startFetching(generateUrl(filteredShows[0].id));
};

const setupControls = () => {
  // create "containers" for episodes and append them to "root" element
  const rootElem = document.getElementById("root");
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

// function which takes a list of episodes, creates html tags for each episode and renders those episodes on the page.
const makePageForEpisodes = (episodeList) => {
  listOfEpisodes.innerHTML = "";
  quantityOfEpisodes.innerHTML = `Displaying ${episodeList.length} of ${allEpisodes.length}`;
  for (let episode of episodeList) {
    // if (episode.image == null) {
    //   continue;
    // }
    const episodeItem = document.createElement("div");
    episodeItem.className += "col item";
    const episodeContainer = document.createElement("div");
    episodeContainer.className += "p-3 h-100 inside";
    const episodeInfo = document.createElement("h4");
    episodeInfo.className += "episode-title";

    // if (episode.number > 9) {
    //   episodeInfo.innerText = `${episode.name} - S0${episode.season}E${episode.number}`;
    // } else {
    //   episodeInfo.innerText = `${episode.name} - S0${episode.season}E0${episode.number}`;
    // }

    const episodeImage = document.createElement("img");
    episodeImage.className += "episode-image";
    episodeImage.src = episode.image?.medium;
    const episodeSummary = document.createElement("div");
    episodeSummary.className += "episode-summary";
    episodeSummary.innerHTML = `${episode.summary}`;

    episodeItem.append(episodeContainer);
    episodeContainer.append(episodeInfo, episodeImage, episodeSummary);
    listOfEpisodes.append(episodeItem);
  }
};

// const renderShow = () => {
//   const nameOfTheShow = document.createElement("h1");
//   const showImage = document.createElement("img");
//   nameOfTheShow.innerText = show.name;
//   showImage.src = show.image.medium;

//   showContainer.append(nameOfTheShow, showImage);
// };

// creates and adds options to <select> (selectEl) tag
const renderEpisodeOptions = (episodeList) => {
  const selectEl = document.querySelector("#select-episodes");
  // show only chosen episode
  selectEl.addEventListener("change", () => {
    const value = selectEl.value;
    const filteredEpisodes = allEpisodes.filter((episode) => {
      return episode.name.includes(value);
    });

    makePageForEpisodes(filteredEpisodes);
  });

  selectEl.innerText = "";

  for (let episodeItem of episodeList) {
    const option = document.createElement("option");
    option.setAttribute("value", episodeItem.name);

    const season = `${episodeItem.season}`.padStart(2, "0");
    const episode = `${episodeItem.number}`.padStart(2, "0");
    option.innerText = `S${season}E${episode} - ${episodeItem.name}`;
    selectEl.append(option);
  }
};

const renderShowOptions = (showList) => {
  const selectEl = document.querySelector("#select-shows");

  for (let show of showList) {
    const option = document.createElement("option");
    option.setAttribute("value", show.id);
    option.innerText = show.name;
    selectEl.append(option);
  }

  selectEl.addEventListener("change", (event) => {
    const showID = event.target.value;
    const URL = generateUrl(showID);
    startFetching(URL);
  });
};

window.onload = setup;
