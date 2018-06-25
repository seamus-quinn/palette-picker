const paletteGenerator = document.querySelector('.palette-generator')

const foo = $('.palette-generator')[0];
console.log(foo)
console.log(paletteGenerator)

const generatePalette = () => {
  console.log('wooo')
}

foo.addEventListener('click', generatePalette)
