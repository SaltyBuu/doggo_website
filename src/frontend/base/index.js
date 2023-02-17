window.onSpotifyIframeApiReady = (IFrameAPI) => {
  let element = document.getElementById("embed-iframe");
  let options = {
    uri: "spotify:track:67PWiuodhQW3lAANwQpYjY",
  };
  let callback = (EmbedController) => {};
  IFrameAPI.createController(element, options, callback);
};
