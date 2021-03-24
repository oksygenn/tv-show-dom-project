// let showContainer;
// let show;
let episodesContainer; // <div> for all episodes (container)
let listOfEpisodes; // ul
let allEpisodes;
let quantityOfEpisodes; // <span> to show how many episodes are shown on the page
let selectEl; // <select> (to use in createSelectOptions and for event listener)

const setup = () => {
  // create "containers" for episodes and append them to "root" element
  const rootElem = document.getElementById("root");
  // showContainer = document.createElement("div");
  episodesContainer = document.createElement("div");
  episodesContainer.className += "episodes-container container";
  quantityOfEpisodes = document.createElement("span");
  listOfEpisodes = document.createElement("div");
  listOfEpisodes.className += "row row-cols-md-3 gx-5 list-of-episodes";
  episodesContainer.append(listOfEpisodes);
  rootElem.append(quantityOfEpisodes, episodesContainer);

  // show = getOneShow();
  // renderShow(show);

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

  const showAllButton = document.querySelector("#show-all-episodes");
  showAllButton.addEventListener("click", () =>
    makePageForEpisodes(allEpisodes)
  );
};

// function which takes a list of episodes, creates html tags for each episode and renders those episodes on the page.
const makePageForEpisodes = (episodeList) => {
  listOfEpisodes.innerHTML = "";
  quantityOfEpisodes.innerHTML = `Displaying ${episodeList.length} of ${allEpisodes.length}`;
  for (let episode of episodeList) {
    const episodeItem = document.createElement("div");
    episodeItem.className += "col item";
    const episodeContainer = document.createElement("div");
    episodeContainer.className += "p-3 h-100 inside";
    const episodeInfo = document.createElement("h4");
    episodeInfo.className += "episode-title";

    if (episode.number > 9) {
      episodeInfo.innerText = `${episode.name} - S0${episode.season}E${episode.number}`;
    } else {
      episodeInfo.innerText = `${episode.name} - S0${episode.season}E0${episode.number}`;
    }

    const episodeImage = document.createElement("img");
    episodeImage.className += "episode-image";
    episodeImage.src = episode.image.medium;
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
const createSelectOptions = (episodeList) => {
  selectEl = document.querySelector("#select-episodes");

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
{
  /* <div container>
  <ul row>
    <li col>
      <h4></h4>
      <img />
      <p></p>
    </li>
  </ul>
</div>; */
}

