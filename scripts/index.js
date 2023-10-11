window.addEventListener("load", () => {
  displayPopular();
});

let apiKey = "AIzaSyDhMYjvqBAGvfvbzuiE4GuvVC69E1mlGnY";
let parent = document.getElementById("results");
parent.innerHTML = "";


let displayPopular = () => {
  let sortByNameOption = document.getElementById("sortByName").value;
  let sortByTimeOption = document.getElementById("sortByTime").value;

  getPopular().then((res) => {
    let data = res.items;
    data.sort((a, b) => {
      console.log(a.snippet.title, b.snippet.title)
    })
    if (sortByNameOption === "atz") {
      data.sort((a, b) => {
        if (a.snippet.title > b.snippet.title) {
          return 1
        }
        if (b.snippet.title > a.snippet.title) {
          return -1
        }
        return 0;
      })
    } if (sortByNameOption === "zta") {
      data.sort((a, b) => {
        if (a.snippet.title > b.snippet.title) {
          return -1
        }
        if (b.snippet.title > a.snippet.title) {
          return 1
        }
        return 0;
      })
    }

    if (sortByTimeOption === "new") {
      data.sort(
        (a, b) =>
          new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt)
      );
    } else if (sortByTimeOption === "old") {
      data.sort(
        (a, b) =>
          new Date(a.snippet.publishedAt) - new Date(b.snippet.publishedAt)
      );
    }

    console.log(data);
    parent.innerHTML = ""
    data.forEach((el) => {
      let { title, publishedAt, channelTitle, channelId } = el.snippet;
      let { url } = el.snippet.thumbnails.high;
      let { viewCount } = el.statistics;

      let numberFormatter = new Intl.NumberFormat("en-US", {
        notation: "compact",
        compactDisplay: "short",
      });

      getChannelIcon(channelId).then((res) => {
        let card = document.createElement("div");
        card.setAttribute("class", "col-lg-4 col-md-6 col-sm-12");
        card.innerHTML = `<a href="video.html?id=${el.id}" rel="noopener">
        <img
                class="img-fluid thumb"
                src=${url}
                alt=""
              />
              </a>
              <div class="row mt-2 g-3">
                <div class="col-2">
                    <img class="img-fluid channel-logo" src=${res}>
                </div>
                <div class="col-10">
                    <h4 class="title">${truncateTitle(title, 40)}</h4>
                    <p class="channel-name">${channelTitle}</p>
                    <p class="stats"><span>${numberFormatter.format(
                      viewCount
                    )} </span> &#9702; <span> ${formatTimeAgo(
          publishedAt
        )}</span></p>
                </div>
              </div>
              `;
        // console.log(data);
        parent.append(card);
      });
    });
  });
};

document.getElementById("sortByName").addEventListener("change", displayPopular);
document.getElementById("sortByTime").addEventListener("change", displayPopular);

let search = () => {
  let searchQuery = document.getElementById("searchQuery").value;
  if (searchQuery != "") {
    parent.innerHTML = "";
    displaySearch();
  }
};

let displaySearch = () => {
  document.getElementsByClassName("filters")[0].innerHTML = ""
  let searchQuery = document.getElementById("searchQuery").value;
  getSearch(searchQuery).then((res) => {
    let data = res.items;
    data.forEach((el) => {
      console.log(el);
      let { title, publishedAt, channelTitle, channelId, description } =
        el.snippet;
      let { url } = el.snippet.thumbnails.high;
      // let { viewCount } = el.statistics;

      getChannelIcon(channelId).then((res) => {
        let card = document.createElement("div");
        card.innerHTML = `
        <div class="v-card row">
        <div class="col-lg-4 col-md-12 col-sm-12">
        <a href="video.html?id=${el.id.videoId}" rel="noopener">
          <img
            class="thumb img-fluid"
            src=${url}
            alt=""
          />
          </a>
        </div>
        <div class="col-8">
          <h3 class="s-title">${title}</h3>
          <p class="stats">${formatTimeAgo(publishedAt)}</p>
          <div class="d-inline-flex gap-2 mt-2">
            <img class="channel-icon" src=${res} alt="">
            <p class="channel-name">${channelTitle}</p>
          </div>
          <p class="desc mt-4">${description}</p>
        </div>
      </div>`;
        parent.append(card);
      });
    });
  });
};

let formatViewCount = (viewCount) => {
  let count = parseInt(viewCount);
  if (count >= 1e9) {
    return (count / 1e9).toFixed(1) + "B";
  } else if (count >= 1e6) {
    return (count / 1e6).toFixed(1) + "M";
  } else {
    return count.toString();
  }
};

let formatTimeAgo = (timestamp) => {
  let date = new Date(timestamp);
  let currentDate = new Date();

  let secondsAgo = Math.floor((currentDate - date) / 1000);

  let rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  switch (true) {
    case secondsAgo < 60:
      return rtf.format(-secondsAgo, "second");
    case secondsAgo < 3600:
      let minutesAgo = Math.floor(secondsAgo / 60);
      return rtf.format(-minutesAgo, "minute");
    case secondsAgo < 86400:
      let hoursAgo = Math.floor(secondsAgo / 3600);
      return rtf.format(-hoursAgo, "hour");
    case secondsAgo < 604800:
      let daysAgo = Math.floor(secondsAgo / 86400);
      return rtf.format(-daysAgo, "day");
    case secondsAgo < 2419200:
      let weeksAgo = Math.floor(secondsAgo / 604800);
      return rtf.format(-weeksAgo, "week");
    case secondsAgo < 29030400:
      let monthsAgo = Math.floor(secondsAgo / 2419200);
      return rtf.format(-monthsAgo, "month");
    default:
      let yearsAgo = Math.floor(secondsAgo / 29030400);
      return rtf.format(-yearsAgo, "year");
  }
};

let getChannelIcon = async (id) => {
  try {
    let res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?` +
        new URLSearchParams({
          key: apiKey,
          part: "snippet",
          id: id,
        })
    );
    let data = await res.json();
    return data.items[0].snippet.thumbnails.default.url;
  } catch (error) {
    console.error(error);
  }
};

let goHome = () => {
  parent.innerHTML = "";
  displayPopular();
};

let truncateTitle = (title, maxLength) => {
  if (title.length > maxLength) {
    return title.slice(0, maxLength - 3) + "...";
  }
  return title;
};

async function getPopular() {
  try {
    let res = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=IN&maxResults=20&key=${apiKey}`
    );
    let data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function getSearch(search) {
  try {
    let res = await fetch(
      "https://www.googleapis.com/youtube/v3/search?" +
        new URLSearchParams({
          key: apiKey,
          type: "video",
          part: "snippet",
          maxResults: "20",
          q: search,
          relatedToVideoId:"6Nb-prB-4P0&"
        })
    );
    let data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}
