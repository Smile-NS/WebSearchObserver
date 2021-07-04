console.log('start "content.js"...');

chrome.runtime.connect({name: "browsing_perm_auth"})
.onMessage.addListener(response => {
  console.log("allow_browsing: " + response.allowBrowsing);
  if (!response.allowBrowsing) rejectAccess();
});

function rejectAccess() {
  chrome.runtime.connect({name: "reject_access"})
  .onMessage.addListener(response => {
  
    console.log("received");
    let element = response.element;
    console.log(`${JSON.stringify(element)}`);

    let now = new Date();
    let waitTime;
    for (let value of element.time) {
  
      let startTime = value[0].split(':');    
      let endTime = value[1].split(':');
  
      if (isInvalidTime(startTime, endTime, now)) {
        hidePage();
        return;
      }
      waitTime = getWaitTime(startTime, now);
    }

    if (waitTime <= 0 || waitTime == null) return;
    setTimeout(() => hidePage(), waitTime);
  });  
}

function getWaitTime(nextTime, now) {
  let hours = now.getHours() * 60 * 60;
  let minutes = now.getMinutes() * 60;
  let seconds = now.getSeconds();

  let nextHours = nextTime[0] * 60 * 60;
  let nextMinutes = nextTime[1] * 60;

  return ((nextHours + nextMinutes) - (hours + minutes + seconds)) * 1000;
}

function hidePage() {
  let elements = document.getElementsByTagName('*');
  for(let i = 0; i < elements.length; i++)
      elements[i].remove();

  document.write("サイトは表示できません");
}

function isInvalidTime(startTime, endTime, now) {
  let hours = now.getHours();
  let minutes = now.getMinutes();

 return (
  (
    startTime[0] < hours ||
    (
      startTime[0] == hours &&
      startTime[1] <= minutes 
    )
  ) && (
  (
    endTime[0] > hours || 
    (
      endTime[0] == hours && 
      endTime[1] > minutes
    )
  )));    
}
