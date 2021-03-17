let episodesContainer;
let allEpisodes;
let quantityOfEpisodes;

const setup = () => {
  const rootElem = document.getElementById("root");
  episodesContainer = document.createElement("ul");
  episodesContainer.className = "episodes-container";
  quantityOfEpisodes = document.createElement("span");

  rootElem.append(quantityOfEpisodes, episodesContainer);

  // get and render all episodes to the page
  allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  createSelectOptions(allEpisodes);

  const searchInput = document.querySelector("#site-search");

  searchInput.addEventListener("input", () => {
    const value = searchInput.value;
    if (value === "") {
      makePageForEpisodes(allEpisodes);
      return;
    }

    const filteredList = allEpisodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(value.toLowerCase()) ||
        episode.summary.toLowerCase().includes(value.toLowerCase())
      );
    });

    makePageForEpisodes(filteredList);
  });
};

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

// add <option> to <select>
const createSelectOptions = (episodeList) => {
  const selectEl = document.querySelector("#episodes");
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

// {
//   <div id="root">
//     <label for="episode-search">Search the site:</label>
//     <input type="search" id="episode-search" aria-label="Search through site content">
//     <ul class="episodes-container">
//       <li class="episode">
//         <h1>Name</h1>
//         <img src="" alt="" />
//         <p class="episode-description"></p>
//       </li>
//     </ul>
//   </div>;
// }
