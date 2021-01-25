{
  var target = document.getElementById('target');
var watchId;

  // TODO add service worker code here
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

  function getUserMedia(constraints) {
    // if Promise-based API is available, use it
    if (navigator.mediaDevices) {
      return navigator.mediaDevices.getUserMedia(constraints);
    }
      
    // otherwise try falling back to old, possibly prefixed API...
    var legacyApi = navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia;
      
    if (legacyApi) {
      // ...and promisify it
      return new Promise(function (resolve, reject) {
        legacyApi.bind(navigator)(constraints, resolve, reject);
      });
    }
  }

  // geolocation

var target = document.getElementById('target');
var watchId;

function appendLocation(location, verb) {
  verb = verb || 'updated';
  var newLocation = document.createElement('p');
  newLocation.innerHTML = 'Location ' + verb + ': ' + location.coords.latitude + ', ' + location.coords.longitude + '';
  target.appendChild(newLocation);
}

if ('geolocation' in navigator) {
  document.getElementById('askButton').addEventListener('click', function () {
    navigator.geolocation.getCurrentPosition(function (location) {
      appendLocation(location, 'fetched');
    });
    watchId = navigator.geolocation.watchPosition(appendLocation);
  });
} else {
  target.innerText = 'Geolocation API not supported.';
}


// camera

function getUserMedia(constraints) {
  // if Promise-based API is available, use it
  if (navigator.mediaDevices) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }
    
  // otherwise try falling back to old, possibly prefixed API...
  var legacyApi = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
    
  if (legacyApi) {
    // ...and promisify it
    return new Promise(function (resolve, reject) {
      legacyApi.bind(navigator)(constraints, resolve, reject);
    });
  }
}

function getStream (type) {
  if (!navigator.mediaDevices && !navigator.getUserMedia && !navigator.webkitGetUserMedia &&
    !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
    alert('User Media API not supported.');
    return;
  }

  var constraints = {};
  constraints[type] = true;
  
  getUserMedia(constraints)
    .then(function (stream) {
      var mediaControl = document.querySelector(type);
      
      if ('srcObject' in mediaControl) {
        mediaControl.srcObject = stream;
      } else if (navigator.mozGetUserMedia) {
        mediaControl.mozSrcObject = stream;
      } else {
        mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
      }
      
      mediaControl.play();
    })
    .catch(function (err) {
      alert('Error: ' + err);
    });
  }

  //fullscreen
  var $ = document.querySelector.bind(document);
var $$ = function (selector) {
  return [].slice.call(document.querySelectorAll(selector), 0);
}
var target = $('#logTarget');

function logChange (event) {
  var timeBadge = new Date().toTimeString().split(' ')[0];
  var newState = document.createElement('p');
  newState.innerHTML = '' + timeBadge + ' ' + event + '.';
  target.appendChild(newState);
}

var prefix = null;
if ('requestFullscreen' in document.documentElement) {
  prefix = 'fullscreen';
} else if ('mozRequestFullScreen' in document.documentElement) {
  prefix = 'mozFullScreen';
} else if ('webkitRequestFullscreen' in document.documentElement) {
  prefix = 'webkitFullscreen';
} else if ('msRequestFullscreen') {
  prefix = 'msFullscreen';
}

var onFullscreenChange = function () {
  var elementName = 'not set';
  if (document[prefix + 'Element']) {
    elementName = document[prefix + 'Element'].nodeName;
  }
  logChange('New fullscreen element is ' + elementName + '');
  onFullscreenHandler(!!document[prefix + 'Element']);
}

if (document[prefix + 'Enabled']) {
  var onFullscreenHandler = function (started) {
    $('#exit').style.display = started ? 'inline-block' : 'none';
    $$('.start').forEach(function (x) {
      x.style.display = started ? 'none' : 'inline-block';
    });
  };

  document.addEventListener(prefix.toLowerCase() + 'change', onFullscreenChange);

  var goFullScreen = null;
  var exitFullScreen = null;
  if ('requestFullscreen' in document.documentElement) {
    goFullScreen = 'requestFullscreen';
    exitFullScreen = 'exitFullscreen';
  } else if ('mozRequestFullScreen' in document.documentElement) {
    goFullScreen = 'mozRequestFullScreen';
    exitFullScreen = 'mozCancelFullScreen';
  } else if ('webkitRequestFullscreen' in document.documentElement) {
    goFullScreen = 'webkitRequestFullscreen';
    exitFullScreen = 'webkitExitFullscreen';
  } else if ('msRequestFullscreen') {
    goFullScreen = 'msRequestFullscreen';
    exitFullScreen = 'msExitFullscreen';
  }

  var goFullscreenHandler = function (element) {
    return function () {
      var maybePromise = element[goFullScreen]();
      if (maybePromise && maybePromise.catch) {
        maybePromise.catch(function (err) {
          logChange('Cannot acquire fullscreen mode: ' + err);
        });
      }
    };
  };

  $('#startFull').addEventListener('click', goFullscreenHandler(document.documentElement));
  $('#startBox').addEventListener('click', goFullscreenHandler($('#box')));

  $('#exit').addEventListener('click', function () {
    document[exitFullScreen]();
  });
}

//persistant storage

if ('storage' in navigator && 'estimate' in navigator.storage) {
  navigator.storage.estimate()
    .then(estimate => {
      document.getElementById('usage').innerHTML = estimate.usage;
      document.getElementById('quota').innerHTML = estimate.quota;
      document.getElementById('percent').innerHTML = (estimate.usage * 100 / estimate.quota).toFixed(0);
    });
}

if ('storage' in navigator && 'persisted' in navigator.storage) {
  navigator.storage.persisted()
    .then(persisted => {
      document.getElementById('persisted').innerHTML = persisted ? 'persisted' : 'not persisted';
    });
}

function requestPersistence() {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    navigator.storage.persist()
      .then(persisted => {
        document.getElementById('persisted').innerHTML = persisted ? 'persisted' : 'not persisted';
      });
  }
}

//online state

document.getElementById('status').innerHTML = navigator.onLine ? 'online' : 'offline';

var target = document.getElementById('target');

function handleStateChange() {
  var timeBadge = new Date().toTimeString().split(' ')[0];
  var newState = document.createElement('p');
  var state = navigator.onLine ? 'online' : 'offline';
  newState.innerHTML = '' + timeBadge + ' Connection state changed to ' + state + '.';
  target.appendChild(newState);
}

window.addEventListener('online', handleStateChange);
window.addEventListener('offline', handleStateChange);

//battery
if ('getBattery' in navigator || ('battery' in navigator && 'Promise' in window)) {
  var target = document.getElementById('target');

  function handleChange(change) {
    var timeBadge = new Date().toTimeString().split(' ')[0];
    var newState = document.createElement('p');
    newState.innerHTML = '' + timeBadge + ' ' + change + '.';
    target.appendChild(newState);
  }
  
  function onChargingChange() {
    handleChange('Battery charging changed to ' + (this.charging ? 'charging' : 'discharging') + '')
  }
  function onChargingTimeChange() {
    handleChange('Battery charging time changed to ' + this.chargingTime + ' s');
  }
  function onDischargingTimeChange() {
    handleChange('Battery discharging time changed to ' + this.dischargingTime + ' s');
  }
  function onLevelChange() {
    handleChange('Battery level changed to ' + this.level + '');
  }

  var batteryPromise;
  
  if ('getBattery' in navigator) {
    batteryPromise = navigator.getBattery();
  } else {
    batteryPromise = Promise.resolve(navigator.battery);
  }
  
  batteryPromise.then(function (battery) {
    document.getElementById('charging').innerHTML = battery.charging ? 'charging' : 'discharging';
    document.getElementById('chargingTime').innerHTML = battery.chargingTime + ' s';
    document.getElementById('dischargingTime').innerHTML = battery.dischargingTime + ' s';
    document.getElementById('level').innerHTML = battery.level;
    
    battery.addEventListener('chargingchange', onChargingChange);
    battery.addEventListener('chargingtimechange', onChargingTimeChange);
    battery.addEventListener('dischargingtimechange', onDischargingTimeChange);
    battery.addEventListener('levelchange', onLevelChange);
  });
}

//cut paste

var logTarget = document.getElementById('logTarget');

function useAsyncApi() {
  return document.querySelector('input[value=async]').checked;
}

function log(event) {
  var timeBadge = new Date().toTimeString().split(' ')[0];
  var newInfo = document.createElement('p');
  newInfo.innerHTML = '' + timeBadge + ' ' + event + '.';
  logTarget.appendChild(newInfo);
}

function performCopyEmail() {
  var selection = window.getSelection();
  var emailLink = document.querySelector('.js-emaillink');

  if (useAsyncApi()) {
    navigator.clipboard.writeText(emailLink.textContent)
      .then(() => log('Async writeText successful, "' + emailLink.textContent + '" written'))
      .catch(err => log('Async writeText failed with error: "' + err + '"'));
  } else {
    selection.removeAllRanges();
    var range = document.createRange();
    range.selectNode(emailLink);
    selection.addRange(range);
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      log('Copy email command was ' + msg);
    } catch (err) {
      log('execCommand Error', err);
    }
    
    selection.removeAllRanges();
  }
}

function performCutTextarea() {
  var cutTextarea = document.querySelector('.js-cuttextarea');

  if (useAsyncApi()) {
    navigator.clipboard.writeText(cutTextarea.textContent)
      .then(() => {
        log('Async writeText successful, "' + cutTextarea.textContent + '" written');
        cutTextarea.textContent = '';
      })
      .catch(err => log('Async writeText failed with error: "' + err + '"'));
  } else {
    var hasSelection = document.queryCommandEnabled('cut');
    cutTextarea.select();
  
    try {
      var successful = document.execCommand('cut');
      var msg = successful ? 'successful' : 'unsuccessful';
      log('Cutting text command was ' + msg);
    } catch (err) {
      log('execCommand Error', err);
    }
  }
}

function performPaste() {
  var pasteTextarea = document.querySelector('.js-cuttextarea');
  
  if (useAsyncApi()) {
    navigator.clipboard.readText()
      .then((text) => {
        pasteTextarea.textContent = text;
        log('Async readText successful, "' + text + '" written');
      })
      .catch((err) => log('Async readText failed with error: "' + err + '"'));
  } else {
    pasteTextarea.focus();
    try {
      var successful = document.execCommand('paste');
      var msg = successful ? 'successful' : 'unsuccessful';
      log('Pasting text command was ' + msg);
    } catch (err) {
      log('execCommand Error', err);
    }
  }
}

// Get the buttons
var cutTextareaBtn = document.querySelector('.js-textareacutbtn');
var copyEmailBtn = document.querySelector('.js-emailcopybtn');
var pasteTextareaBtn = document.querySelector('.js-textareapastebtn');

// Add click event listeners
copyEmailBtn.addEventListener('click', performCopyEmail);
cutTextareaBtn.addEventListener('click', performCutTextarea);
pasteTextareaBtn.addEventListener('click', performPaste);

function logUserOperation(event) {
  log('User performed ' + event.type + ' operation. Payload is: ' + event.clipboardData.getData('text/plain') + '');
}

document.addEventListener('cut', logUserOperation);
document.addEventListener('copy', logUserOperation);
document.addEventListener('paste', logUserOperation);


//local not
var $status = document.getElementById('status');

if ('Notification' in window) {
  $status.innerText = Notification.permission;
}

function requestPermission() {
  if (!('Notification' in window)) {
    alert('Notification API not supported!');
    return;
  }
  
  Notification.requestPermission(function (result) {
    $status.innerText = result;
  });
}

function nonPersistentNotification() {
  if (!('Notification' in window)) {
    alert('Notification API not supported!');
    return;
  }
  
  try {
    var notification = new Notification("Hi there - non-persistent!");
  } catch (err) {
    alert('Notification API error: ' + err);
  }
}

function persistentNotification() {
  if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
    alert('Persistent Notification API not supported!');
    return;
  }
  
  try {
    navigator.serviceWorker.getRegistration()
      .then((reg) => reg.showNotification("Hi there - persistent!"))
      .catch((err) => alert('Service Worker registration error: ' + err));
  } catch (err) {
    alert('Notification API error: ' + err);
  }
}

//permissions
if ('permissions' in navigator) {
  var logTarget = document.getElementById('logTarget');

  function handleChange(permissionName, newState) {
    var timeBadge = new Date().toTimeString().split(' ')[0];
    var newStateInfo = document.createElement('p');
    newStateInfo.innerHTML = '' + timeBadge + ' State of ' + permissionName + ' permission status changed to ' + newState + '.';
    logTarget.appendChild(newStateInfo);
  }

  function checkPermission(permissionName, descriptor) {
    try {
    navigator.permissions.query(Object.assign({name: permissionName}, descriptor))
      .then(function (permission) {
        document.getElementById(permissionName + '-status').innerHTML = permission.state;
        permission.addEventListener('change', function (e) {
          document.getElementById(permissionName + '-status').innerHTML = permission.state;
          handleChange(permissionName, permission.state);
        });
      });
    } catch (e) {
    }
  }

  checkPermission('geolocation');
  checkPermission('notifications');
  checkPermission('push', {userVisibleOnly: true});
  checkPermission('midi', {sysex: true});
  checkPermission('camera');
  checkPermission('microphone');
  checkPermission('background-sync');
  checkPermission('ambient-light-sensor');
  checkPermission('accelerometer');
  checkPermission('gyroscope');
  checkPermission('magnetometer');

  var noop = function () {};
  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  
  function requestGeolocation() {
    navigator.geolocation.getCurrentPosition(noop);
  }

  function requestNotifications() {
    Notification.requestPermission();
  }

  function requestPush() {
    navigator.serviceWorker.getRegistration()
      .then(function (serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.subscribe();
      });
  }

  function requestMidi() {
    navigator.requestMIDIAccess({sysex: true});
  }
  
  function requestCamera() {
    navigator.getUserMedia({video: true}, noop, noop)
  }
  
  function requestMicrophone() {
    navigator.getUserMedia({audio: true}, noop, noop)
  }
}

  }