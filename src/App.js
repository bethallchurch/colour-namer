import { closestColor, processColor, rgbToStr, rgbToHex, isDark } from './helpers'
import colors from './colors'
import GitHubMarkLight from './assets/github-light.png'
import GitHubMarkDark from './assets/github-dark.png'
import './App.css'

const App = () => {
  const githubLink = document.createElement('a')
  const img = document.createElement('img')
  img.alt = 'Link to GitHub repository.'
  githubLink.classList.add('github-link')
  githubLink.href = 'https://github.com/bethallchurch/colour-namer'
  githubLink.appendChild(img)

  const input = document.createElement('input')

  const outputEl = document.createElement('div')
  const outputNameEl = document.createElement('span')
  const outputHexEl = document.createElement('span')
  const outputRgbEl = document.createElement('span')

  input.classList.add('input')
  input.placeholder = 'hex or rgb'
  outputEl.classList.add('output-color')
  outputNameEl.classList.add('output-color__name')
  outputHexEl.classList.add('output-color__hex')
  outputRgbEl.classList.add('output-color__rgb')

  outputEl.appendChild(outputNameEl)
  outputEl.appendChild(outputHexEl)
  outputEl.appendChild(outputRgbEl)

  const reset = () => {
    document.body.style.backgroundImage = ''
    document.body.classList.remove('light-text')
    img.src = GitHubMarkDark
    outputNameEl.innerHTML = ''
    outputHexEl.innerHTML = ''
    outputRgbEl.innerHTML = ''
  }

  const showResult = (inputColor, outputColor) => {
    const backgroundGradient = `linear-gradient(to bottom, ${inputColor.hex} 50%, ${outputColor.hex} 50%)`
    document.body.style.backgroundImage = backgroundGradient
    if (isDark(inputColor.rgb)) {
      img.src = GitHubMarkLight
      document.body.classList.add('light-text')
    }
    outputNameEl.innerHTML = outputColor.name
    outputHexEl.innerHTML = outputColor.hex
    outputRgbEl.innerHTML = rgbToStr(outputColor.rgb)
  }

  const onKeyup = e => {
    reset()
    const { target: { value } } = e
    const inputColor = processColor(value)
    inputColor && showResult(inputColor, closestColor(inputColor.rgb))
  }

  input.addEventListener('keyup', onKeyup)

  const app = document.createElement('div')
  app.classList.add('app')
  app.appendChild(githubLink)
  app.appendChild(input)
  app.appendChild(outputEl)

  document.addEventListener('DOMContentLoaded', () => input.focus(), false)

  return app
}

export default App
