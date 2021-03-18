let episodesContainer; // <ul> for all episodes
let allEpisodes;
let quantityOfEpisodes; // <span> to show how many episodes are shown on the page
let selectEl; // <select> (to use in createSelectOptions and for event listener)

const setup = () => {
  // create "containers" for episodes and append them to "root" element
  const rootElem = document.getElementById("root");
  episodesContainer = document.createElement("ul");
  episodesContainer.className = "episodes-container";
  quantityOfEpisodes = document.createElement("span");
  rootElem.append(quantityOfEpisodes, episodesContainer);

  const showAllButton = document.querySelector("#show-all-episodes");
  showAllButton.addEventListener("click", () =>
    makePageForEpisodes(allEpisodes)
  );

  // get and render all episodes to the page
  allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  createSelectOptions(allEpisodes);

  // find user input and show all episodes if input field is empty (edge case)
  const searchInput = document.querySelector("#site-search");
  searchInput.addEventListener("input", () => {
    const value = searchInput.value;
    if (value === "") {
      makePageForEpisodes(allEpisodes);
      return;
    }

    // filter all episodes and show only the once that include the same words as user input
    const filteredList = allEpisodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(value.toLowerCase()) ||
        episode.summary.toLowerCase().includes(value.toLowerCase())
      );
    });

    makePageForEpisodes(filteredList);
  });

  // show only chosen episode
  selectEl.addEventListener("change", () => {
    const value = selectEl.value;
    const filteredEpisodes = allEpisodes.filter((episode) => {
      return episode.name.includes(value);
    });

    makePageForEpisodes(filteredEpisodes);
  });
};

// function which takes a list of episodes, creates html tags for each episode and renders those episodes on the page.
const makePageForEpisodes = (episodeList) => {
  episodesContainer.innerHTML = "";
  quantityOfEpisodes.innerHTML = `Displaying ${episodeList.length} of ${allEpisodes.length}`;
  for (let episode of episodeList) {
    const episodeItem = document.createElement("li");
    const episodeInfo = document.createElement("h2");

    if (episode.number > 9) {
      episodeInfo.innerText = `${episode.name} - S0${episode.season}E${episode.number}`;
    } else {
      episodeInfo.innerText = `${episode.name} - S0${episode.season}E0${episode.number}`;
    }

    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image.medium;
    const episodeSummary = document.createElement("p");
    episodeSummary.className += "episode-summary";
    episodeSummary.innerHTML = `${episode.summary}`;

    episodeItem.append(episodeInfo, episodeImage, episodeSummary);
    episodesContainer.append(episodeItem);
  }
};

// creates and adds options to <select> (selectEl) tag
const createSelectOptions = (episodeList) => {
  selectEl = document.querySelector("#episodes");

  for (let episode of episodeList) {
    const option = document.createElement("option");
    option.setAttribute("value", episode.name);

    if (episode.number > 9) {
      option.innerText = `S0${episode.season}E${episode.number} - ${episode.name}`;
    } else {
      option.innerText = `S0${episode.season}E0${episode.number} - ${episode.name}`;
    }
    selectEl.append(option);
  }
};

window.onload = setup;
