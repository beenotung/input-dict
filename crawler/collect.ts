import { chromium } from 'playwright'
import fs from 'fs/promises'
import { countWords, getMaxId, hasWordById, storeWord } from './store'
import { idToFile, prepareDir } from './file'

async function main() {
  let browser = await chromium.launch({ headless: true })
  let page = await browser.newPage()
  let url = 'https://fcjonline.com/index.php/tc/dictionary'
  let count = countWords()
  let maxId = getMaxId()
  let lastCount = count
  let startTime = Date.now()
  async function loop() {
    await page.goto(url)
    let result = await page.evaluate(() => {
      let container = document.querySelector('.word-details') as HTMLDivElement
      let img = container.querySelector('img') as HTMLImageElement
      let table = container.querySelector('table') as HTMLTableElement
      let char = img.alt
      // example: assets/images/word/2843.png
      let src = img.src
      // let code = table.tBodies[0].rows[3].cells[1].textContent
      return { char, src }
    })
    let { char, src } = result
    let id = +src.match(/(\d+)\.png/)?.[1]!
    if (!id) throw new Error('faild to parse word id')
    // if (!code) throw new Error('failed to parse input code')
    if (hasWordById(id)) return
    async function downloadImage() {
      const arr = await page.evaluate(
        ({ src }) => {
          return fetch(src)
            .then(res => res.arrayBuffer())
            .then(bin => {
              let arr = Array.from(new Uint8Array(bin))
              return arr
            })
        },
        { src },
      )
      let content = Buffer.from(arr)
      let file = idToFile(id)
      let tmpFile = file + '.tmp'
      prepareDir(file)
      await fs.writeFile(tmpFile, content)
      await fs.rename(tmpFile, file)
    }
    // await downloadImage()
    storeWord(id, { char })
    count++
    if (id > maxId) maxId = id
    let time = Date.now() - startTime
    let diff = count - lastCount
    let speed = diff / (time / 1000)
    let progress = ((count / maxId) * 100).toFixed(2) + '%'
    let remind = maxId - count
    let timeNeeded = Math.floor(remind / speed).toLocaleString()
    process.stdout.write(
      `\r total: ${count} | spped: ${speed.toFixed(
        2,
      )} words/sec | estimate ${progress} | remind ${timeNeeded} sec   `,
    )
  }
  for (; count < 6000; ) {
    await loop()
  }
}

main().catch(err => console.error(err))
