var allowBrowsing = false;

chrome.runtime.onConnect.addListener(port => {
  const channel = port.name;
  let data;
  switch (channel) {
    case "reject_access":
      data = { channel: channel };
      send(data, port);
      break;
    case "password_auth":
      port.onMessage.addListener(request => {

        data = {
           channel: channel,
           password: request.password 
        };
  
        send(data, port);
      });  
      break;
    case "browsing_perm_auth":
      port.postMessage({allowBrowsing: allowBrowsing});
      break;
  }
});

function send(data, port) {
  const gasUrl =
   "https://script.google.com/macros/s/**************************************************************************/exec";

  $.ajax({
    type: "GET",
    url: gasUrl,
    dataType: "json",
    data: data,

    success: element => {
      console.log("sent");
      allowBrowsing = port.name == "password_auth" ? element.success : allowBrowsing;
      console.log(element);
      port.postMessage({element: element});
    }
  });
}
