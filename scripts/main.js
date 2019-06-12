(function() {
  'use strict';

  var timeinterval = 0;
  var timerType;
  var status = document.getElementById('status');

  function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  function initializeClock(id, endtime) {
    var clock = document.getElementById(id);
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');

    function updateClock() {
      var t = getTimeRemaining(endtime);

      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

      if (t.total <= 0) {
        clearInterval(timeinterval);
        onTimerFinish();
        let volume = localStorage.getItem('volume');
        volume === 'true' ? alarm.play() : console.log('Volume muted');
        timerType === 'work' ? status.innerHTML = 'Dá o teu melhor' : status.innerHTML = 'Relaxa um pouco';
      }
    }

    updateClock();
    timeinterval = setInterval(updateClock, 1000);
  }

  function setTimer(duration) { 
    timeinterval ? clearInterval(timeinterval) : console.log('Trabalha, Trabalha, Trabalha, Trabalha');
    let deadline = new Date(Date.parse(new Date()) + duration * 1000);
    initializeClock('clockdiv', deadline);
  }

  function mudaCor(color) {
      document.body.style.background = color;
      document.body.style.backgroundSize = "400% 400%";
      document.body.style.animation = "Gradient 15s ease infinite";

  }

    function mudaCorMS(color) {
      document.getElementById("minutoss").style.background = color;
      document.getElementById("segundoss").style.background = color;
  }

  function doSomeWork(workit) {
    let workButton = document.getElementById('tomato');
    let breakButtons = document.getElementById('break-buttons');

    if (workit) { 
      status.innerHTML = 'Dá o teu melhor';
      breakButtons.className = 'visible';
      workButton.className = 'visible';
      timerType = 'work';
    } else {
      status.innerHTML = 'Relaxa um pouco';
      breakButtons.className = 'visible';
      workButton.className = 'visible';
      timerType = 'break';
    }
  }

  function onTimerFinish() {
    timerType === 'work' ? doSomeWork(false) : doSomeWork(true);
    displayNotification();
  }


  var workButton = document.querySelector('#tomato');
  var fiveMinButton = document.querySelector('#five-min');
  var tenMinButton = document.querySelector('#ten-min');
  var breakButtons = document.getElementById('break-buttons');
  var volumeButton = document.getElementById('volume');

  workButton.addEventListener('click', function() {
    status.innerHTML = '';
    setTimer(25*60);
      doSomeWork(true);
      mudaCor('linear-gradient(45deg, #f12711, #F0CB35)');
      mudaCorMS('#a02837');

  });

  fiveMinButton.addEventListener('click', function() {
    setTimer(5*60);
      doSomeWork(false);
      mudaCor('linear-gradient(45deg, #f79d00, #64f38c)');
      mudaCorMS('#008000');

  });

  tenMinButton.addEventListener('click', function() {
    setTimer(10*60);
      doSomeWork(false);
      mudaCor('linear-gradient(45deg, #f79d00, #64f38c)');
      mudaCorMS('#008000');


  });

  volumeButton.addEventListener('click', function(){
    if (localStorage.getItem('volume') === 'true') {
      volumeButton.children[0].setAttribute('src','assets/images/volume_muted.svg');
      localStorage.setItem('volume',false);
    }
    else {
      volumeButton.children[0].setAttribute('src','assets/images/volume_on.svg');
      localStorage.setItem('volume',true);
    }

  });

  window.addEventListener('beforeinstallprompt', function(e) {

    e.userChoice.then(function(choiceResult) {

      console.log(choiceResult.outcome);

      if(choiceResult.outcome == 'dismissed') {
        console.log('User cancelled home screen install');
      }
      else {
        console.log('User added to home screen');
      }
    });
  });

  function sound(src) {
      var self = this;
      self.sound = document.createElement("audio");
      self.sound.src = src;
      self.sound.setAttribute("preload", "auto");
      self.sound.setAttribute("controls", "none");
      self.sound.style.display = "none";
      document.body.appendChild(self.sound);
      self.play = function(){
          self.sound.play();
      };
      self.stop = function(){
          self.sound.pause();
      };
  }

  var alarm = new sound('assets/media/alarm.mp3');

  function displayNotification() {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {
      var notification = new Notification("Timer finished!");
    }
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          var notification = new Notification("Timer finished!");
        }
      });
    }
  }

  function checkVolume(){
    let vol = localStorage.getItem('volume');
    if (vol === 'false' || vol === '') {
      volumeButton.children[0].setAttribute('src','assets/images/volume_muted.svg');
      localStorage.setItem('volume',false);
    } else {
      volumeButton.children[0].setAttribute('src','assets/images/volume_on.svg');
      localStorage.setItem('volume',true);
    }
  }

  Notification.requestPermission();
  checkVolume();

}());
