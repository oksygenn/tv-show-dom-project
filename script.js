//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  for (let episode of episodeList) {
    const episodeContainer = document.createElement("div");
    episodeContainer.className = "episode-container";

    const header = document.createElement("h1");
    header.innerText = `${episode.name} - S0${episode.season}E0${episode.number}`;

    const image = document.createElement("img");
    image.src = episode.image.medium;

    const episodeSummary = document.createElement("p");
    // episodeSummary.className += "episode-description";
    episodeSummary.innerHTML = `${episode.summary}`;
    episodeContainer.append(header, episodeSummary, image);
    rootElem.append(episodeContainer);
  }
}

window.onload = setup;

// {
//   <div id="root">
//     <label for="episode-search">Search the site:</label>
//     <input type="search" id="episode-search" aria-label="Search through site content">
//     <div class="episode-container">
//       <h1>Name</h1>
//       <img />
//       <p class="episode-description"></p>
//     </div>
//   </div>;
// }
