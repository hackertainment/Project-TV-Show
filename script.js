//You can edit ALL of the code here
//function setup() {
//  const allEpisodes = getAllEpisodes();
//  makePageForEpisodes(allEpisodes);
//}

const tvshowList = [];
const episodeLists = [];

async function requestTvshow() {
  //const tvshowUrl = "https://simulatehttpcode.vercel.app/statuscode?q=404";
  const tvshowUrl = "https://api.tvmaze.com/shows";
  const tvshowResponse = await fetch(tvshowUrl);
  const tvshowJson = tvshowResponse.json();
  //const tvshowJson = await tvshowResponse.json();

  return tvshowJson;
}

async function requestEpisode(tvshowId) {
  //const episodeUrl = "https://simulatehttpcode.vercel.app/statuscode?q=404";
  const episodeUrl = `https://api.tvmaze.com/shows/${tvshowId}/episodes`;
  const episodeResponse = await fetch(episodeUrl);
  const episodeJson = await episodeResponse.json();

  return episodeJson;
};

function setup() {
  document.getElementById("root").textContent = `LOADING...`;
  // when website loaded, fetch TV shows (and cache shows and render show selector)
  const promise = requestTvshow()
    .then((json) => {
      const tvshows = json.sort((a, b) => a.name.localeCompare(b.name));
      tvshowList.push(...tvshows);
      makePageForTvshows();
      document.getElementById("container-tvshow").classList.remove("invisible");
    })
    .catch((error) => {
      console.error(error.message);
      document.getElementById("root").textContent = `ERROR: ${error.message}!`;
    });
}

function makePageForTvshows() {
  const filterTerm = document.getElementById("input-filter").value.toLowerCase();
  const tvshows = tvshowList.filter((tvshow) => tvshow.name.toLowerCase().includes(filterTerm) || tvshow.genres.map((str) => str.toLowerCase()).includes(filterTerm) || tvshow.summary.toLowerCase().includes(filterTerm));
  const optionElems = tvshows.map(makeOptionForTvshow);
  const articleElems = tvshows.map(makeArticleForTvshow);
  const selectElem = document.getElementById("select-tvshow");
  const sectionElem = document.getElementById("section-tvshow");

  // when display cards, render tvshow selector and the cards
  for (let i=selectElem.options.length-1; i>=1; i--) {
    selectElem.remove(i);
  }
  while (sectionElem.firstChild) { 
    sectionElem.firstChild.remove(); 
  }
  selectElem.append(...optionElems);
  sectionElem.append(...articleElems);
  document.getElementById("message-tvshow").innerHTML = `found ${tvshows.length} shows`;
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  const searchTerm = document.getElementById("input-search").value.toLowerCase();
  const episodes = episodeList.filter((episode) => episode.name.toLowerCase().includes(searchTerm) || episode.summary.toLowerCase().includes(searchTerm));
  const optionElems = episodes.map(makeOptionForEpisode);
  const articleElems = episodes.map(makeArticleForEpisode);
  const selectElem = document.getElementById("select-episode");
  const sectionElem = document.getElementById("section-episode");

  // when display cards, render episode selector and the cards
  for (let i=selectElem.options.length-1; i>=1; i--) {
    selectElem.remove(i);
  }
  while (sectionElem.firstChild) { 
    sectionElem.firstChild.remove(); 
  }
  selectElem.append(...optionElems);
  sectionElem.append(...articleElems);
  document.getElementById("message-episode").innerHTML = `Displaying ${episodes.length}/${episodeList.length} episodes`;
}

function makeOptionForTvshow(tvshow) {
  const optionElem = document.createElement('option');

  optionElem.value = tvshow.id;
  optionElem.textContent = tvshow.name;

  return optionElem;
}

function makeOptionForEpisode(episode) {
  const optionElem = document.createElement('option');

  optionElem.value = episode.id;
  optionElem.textContent = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${episode.name}`;

  return optionElem;
}

function makeArticleForTvshow(tvshow) {
  const card = document.getElementById("template-tvshow").content.cloneNode(true);
  const ratingElem = document.createElement("li");
  const genresElem = document.createElement("li");
  const statusElem = document.createElement("li");
  const runtimeElem = document.createElement("li");

  card.querySelector("article").id = tvshow.id;
  card.querySelector("h2").textContent = tvshow.name;
  card.querySelector("img").src = tvshow.image.medium;
  card.querySelector("img").alt = tvshow.name;
  card.querySelector("span").innerHTML = tvshow.summary;
  ratingElem.innerHTML = `<b>Rated:</b> ${tvshow.rating.average}`;
  genresElem.innerHTML = `<b>Genres:</b> ${tvshow.genres.join(" | ")}`;
  statusElem.innerHTML = `<b>Status:</b> ${tvshow.status}`;
  runtimeElem.innerHTML = `<b>Runtime:</b> ${tvshow.runtime}`;
  card.querySelector("ul").append(ratingElem);
  card.querySelector("ul").append(genresElem);
  card.querySelector("ul").append(statusElem);
  card.querySelector("ul").append(runtimeElem);

  return card;
}

function makeArticleForEpisode(episode) {
  const card = document.getElementById("template-episode").content.cloneNode(true);
  const selectElem = document.getElementById("select-tvshow");

  card.querySelector("article").id = episode.id;
  card.querySelector("h3").textContent = `${episode.name} - S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
  card.querySelector("img").src = episode.image.medium;
  card.querySelector("img").alt = selectElem.options[selectElem.selectedIndex].text;
  card.querySelector("p").outerHTML = episode.summary;

  return card;
}

function tvshowChangeHandler(event) {
  const tvshowId = event.target.value;

  if (!episodeLists[tvshowId]) {  // if new TV show is chosen, then fetch its episodes (and cache episodes and display cards)
    const promise = requestEpisode(tvshowId)
      .then((json) => {
        episodeLists[tvshowId] = (tvshowId=="0" ? [json] : json);
        makePageForEpisodes(tvshowId=="0" ? [] : json);
        if (tvshowId!="0") {
          document.getElementById("container-tvshow").classList.add("invisible");          
          document.getElementById("container-episode").classList.remove("invisible");          
        }
      })
      .catch((error) => {
        console.error(error.message);
        document.getElementById("root").textContent = `ERROR: ${error.message}!`;
        document.getElementById("container-tvshow").classList.add("invisible");
      });
  }
  else if (tvshowId=="0") {  // if no TV show is chosen, then clear screen
    makePageForEpisodes([]);
  }
  else {  // if old TV show is chosen, then display cards (from cache episodes)
    makePageForEpisodes(episodeLists[tvshowId]);
    document.getElementById("container-tvshow").classList.add("invisible");          
    document.getElementById("container-episode").classList.remove("invisible");          
  }
}

function episodeChangeHandler(event) {
  const episodeId = event.target.value;
  const articleElem = (episodeId=="0" ? null : document.getElementById(episodeId));
  const articleOffset = (episodeId=="0" ? 0 : window.pageYOffset+articleElem.getBoundingClientRect().top-document.getElementById("container-episode").querySelector('header').offsetHeight)-5-5;  // - section padding top px - section margin top px

  // when episode is chosen, hightlight its card and jump to the card
  for (const child of document.getElementById("section-episode").children) {
    child.classList.remove("highlight");
  }
  if (articleElem!=null) {
    articleElem.classList.add("highlight");
  }
  window.scrollTo({top: articleOffset, behavior: "smooth"});
}

function searchInputHandler(event) {
  const tvshowId = document.getElementById("select-tvshow").value;

  // when typing in search box, live update display cards
  makePageForEpisodes(tvshowId=="0" ? [] : episodeLists[tvshowId]);
}

function listingClickHandler(event) {
  document.getElementById("container-tvshow").classList.remove("invisible");          
  document.getElementById("container-episode").classList.add("invisible");          
}

window.addEventListener("load", () => {
  document.getElementById("input-filter").addEventListener("input", makePageForTvshows);
  document.getElementById("select-tvshow").addEventListener("change", tvshowChangeHandler);
  document.getElementById("select-episode").addEventListener("change", episodeChangeHandler);
  document.getElementById("input-search").addEventListener("input", searchInputHandler);
  document.getElementById("button-listing").addEventListener("click", listingClickHandler);
});

window.onload = setup;
