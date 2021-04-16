const helper = () => {
  const episodesRoot = document.getElementById("episodes-root");
  const episodesContainer = document.querySelector(".episodes-container"); // <div> for all episodes (container)
  const listOfEpisodes = document.querySelector(".list-of-episodes"); // ul for episodes
  const displayingEpisodesSpan = document.querySelector(".displaying-episodes"); // <span> to show how many episodes are shown on the page
  const showsRoot = document.getElementById("shows-root");
  const allShowsContainer = document.getElementById("all-shows");

  return {
    episodesRoot,
    episodesContainer,
    listOfEpisodes,
    displayingEpisodesSpan,
    showsRoot,
    allShowsContainer,
  };
};
