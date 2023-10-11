let videoId = new URLSearchParams(window.location.search).get("id");

window.addEventListener("load", () => {
    showVideo();
})

let apiKey = "AIzaSyDhMYjvqBAGvfvbzuiE4GuvVC69E1mlGnY";
let parent = document.getElementById("player");
let showVideo = () => {
    getSingleVideo(videoId).then((res) => {
        let {embedHtml} = res.items[0].player;
        let {title} = res.items[0].snippet;

        document.getElementById("title").textContent = title;
        console.log(res)
        // embedHtml = embedHtml.replace("src=", 'src="//www.youtube.com/embed/' + videoId + '?autoplay=1"');
        parent.innerHTML = embedHtml
    })
}

async function getSingleVideo(id) {
  try {
    let res = await fetch(
      "https://www.googleapis.com/youtube/v3/videos?" +
        new URLSearchParams({
          key: apiKey,
          part: "snippet,player", 
          id: id,
        })
    );
    let data = await res.json();
    // console.log(data)
    return data;
  } catch (err) {
    console.log(err);
  }
}
