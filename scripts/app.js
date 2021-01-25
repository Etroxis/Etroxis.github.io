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
  }