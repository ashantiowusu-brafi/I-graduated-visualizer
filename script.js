const container = document.getElementById('container')
const canvas = document.getElementById('canvas1')
const file = document.getElementById('fileupload')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')
let audioSource
let analyser

container.addEventListener('click', function () {
  const audio1 = document.getElementById('audio1')
  audio1.src = 'sample.mp3'
  const audioCtx = new AudioContext()
  audio1.play()

  audioSource = audioCtx.createMediaElementSource(audio1)
  analyser = audioCtx.createAnalyser() // expose audio time and frequency data
  audioSource.connect(analyser) // now analyser node can give to us as data object
  analyser.connect(audioCtx.destination) // send to default audio output device
  analyser.fftSize = 1024 // number of audio samples we want in analyser data file
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength) // buffer data is in a Uint8array that contain unassigned integers

  const barWidth = 5 // bar fills canvas width
  let barHeight
  let x // horiszontal x coordinate

  function animate () {
    x = 0
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    analyser.getByteFrequencyData(dataArray)
    drawVisualiser (bufferLength, x, barWidth, barHeight, dataArray)
    requestAnimationFrame(animate) // animation loop
  }
  animate()
})
// overide audio security by turning files into obects
file.addEventListener('change', function () {
  const files = this.files
  const audio1 = document.getElementById('audio1')
  audio1.src = URL.createObjectURL(files[0])
  audio1.load()
  audio1.play()
  audioSource = audioCtx.createMediaElementSource(audio1)
  analyser = audioCtx.createAnalyser() // expose audio time and frequency data
  audioSource.connect(analyser) // now analyser node can give to us as data object
  analyser.connect(audioCtx.destination) // send to default audio output device
  analyser.fftSize = 1024 // number of audio samples we want in analyser data file
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength) // buffer data is in a Uint8array that contain unassigned integers

  const barWidth = 5 // bar fills canvas width
  let barHeight
  let x // horiszontal x coordinate

  function animate () {
    x = 0
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    analyser.getByteFrequencyData(dataArray)
    drawVisualiser (bufferLength, x, barWidth, barHeight, dataArray)
    requestAnimationFrame(animate) // animation loop
  }
  animate()
})

function drawVisualiser (bufferLength, x, barWidth, barHeight, dataArray) {
  for (let i = 0; i < bufferLength; i++) { // iterate through array
    barHeight = dataArray[i]
    // create circle shape to rotate around the circle
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2) // 0,0 moved to middle
    ctx.rotate(i * 27)
    // color!
    /* const red = i * barHeight / 20
    const green = i * 4
    const blue = barHeight / 2
    */
    const hue = i
    ctx.fillStyle = 'hsl(' + hue + ', 30%, 50%)'
    ctx.strokeStyle = 'hsl(' + hue + ',100%,' + barHeight / 3 + '%)'
    // draw shapes
    ctx.beginPath()
    ctx.arc(100, barHeight, barHeight, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillRect(0, 0, barWidth, barHeight) // x, y, width, height depending on decible
    x += barWidth
    ctx.restore()
  }
  for (let i = 0; i < bufferLength; i++) { // iterate through array
    barHeight = dataArray[i]
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2) // 0,0 moved to middle
    ctx.rotate(i * 3)
    ctx.lineWidth = 1
    // color
    const hue = i * 15
    ctx.strokeStyle = 'hsl(' + hue + ',100%,' + barHeight / 3 + '%)'
    ctx.fillStyle = 'hsl(' + hue + ',100%,' + barHeight / 3 + '%)'
    // shape
    ctx.beginPath()
    ctx.arc(barHeight + 75, barHeight + 75, 50, 0, Math.PI * 2)
    ctx.moveTo(barHeight + 110, barHeight + 75)
    // mouth
    ctx.arc(barHeight + 75, barHeight + 75, 35, 0, Math.PI)
    ctx.lineTo(barHeight + 110, barHeight + 75)
    ctx.stroke()
    // eyes
    ctx.beginPath()
    ctx.moveTo(barHeight + 65, barHeight + 65)
    ctx.arc(barHeight + 60, barHeight + 65, 5, 0, Math.PI * 2)
    ctx.moveTo(barHeight + 95, barHeight + 65)
    ctx.arc(barHeight + 90, barHeight + 65, 5, 0, Math.PI * 2)
    ctx.fill()
    x += barWidth
    ctx.restore()
  }
}
