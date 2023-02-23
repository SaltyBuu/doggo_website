window.onSpotifyIframeApiReady = (IFrameAPI) => {
  let element = document.getElementById("embed-iframe");
  let options = {
    width: "50%",
    height: "100%",
    uri: "spotify:track:67PWiuodhQW3lAANwQpYjY",
  };
  let callback = () => {};
  IFrameAPI.createController(element, options, callback);
};
