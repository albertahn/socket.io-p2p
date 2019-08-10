var P2P = require('../../../index')
var io = require('socket.io-client')

window.AudioContext = window.AudioContext || window.webkitAudioContext

var socket = io()
var p2p = new P2P(socket)
var startButton = document.getElementById('start-stream')

var video = document.createElement('video')
    document.body.appendChild(video)

    var constraints = { audio: true, video: true };
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      console.log("got stream");
    })
    .catch(function(err) {
      /* handle the error */
      console.log(err);
    });

p2p.on('start-stream', function () {
  p2p.usePeerConnection = true
  startButton.setAttribute('disabled', true)
})

p2p.on('stream', function (stream) {
  console.log("streaming now:"+ stream);
  //var audio = document.querySelector('audio')
  //audio.src = window.URL.createObjectURL(stream)
  //audio.play()

  // got remote video stream, now let's show it in a video tag
                var video = document.querySelector('video')

                if ('srcObject' in video) {
                  video.srcObject = stream
                } else {
                  video.src = window.URL.createObjectURL(stream) // for older browsers
                }

                video.play()

})

function startStream () {
  startButton.setAttribute('disabled', true)
  navigator.getUserMedia({ audio: true, video: true }, function (stream) {
    var audioContext = new window.AudioContext()
    var mediaStreamSource = audioContext.createMediaStreamSource(stream)
    var mediaStreamDestination = audioContext.createMediaStreamDestination()
    mediaStreamSource.connect(mediaStreamDestination)

    var socket = io()
    //var p2p = new P2P(socket, {peerOpts: {stream: mediaStreamDestination.stream}})
    var p2p = new P2P(socket, {peerOpts: {stream: stream}})

    p2p.on('ready', function () {
      p2p.usePeerConnection = true
    })

    p2p.emit('ready', { peerId: p2p.peerId })
  }, function (err) {
    console.log(err)
  })
}

startButton.addEventListener('click', startStream)
