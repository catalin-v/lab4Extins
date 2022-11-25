// const a = require('./input.in')
var fs = require('fs')
const data = fs.readFileSync('./input.in',
{encoding:'utf8', flag:'r'})
// console.log(data)



const [states, alphabet, transFun, initialStates, finalStates] = [...data.split('\n').map(d => d.split(','))]

let running = true

const text = `Select Option:
  0: exit
  1: see states
  2: see alphabet
  3: see trans functions
  4: see initial states
  5: see final states
  6: test sequence\n
`

// console.log(states, alphabet, transFun, initialStates, finalStates)


const ask = function(q){
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

  var response;

  readline.setPrompt(q);
  readline.prompt();

  return new Promise(( resolve , reject) => {

      readline.on('line', (userInput) => {
          response = userInput;
          readline.close();
      });

      readline.on('close', () => {
          resolve(response);
      });

  });
} 

const recursiveSeqGen = (curent, final, transformations) => {
  if (curent === final) return true
  if (curent.length > final.length) return false
  let found = false
  transformations.forEach(transformation => {
    const position = curent.indexOf(transformation[0])
    if (position === -1 || found) return

    transformation[1].forEach(replacement => {
      found = found || recursiveSeqGen(curent.replace(transformation[0], replacement), final, transformations)
      // console.log(curent, curent.replace(transformation[0], replacement), final, transformations)
    })
  })

  return found
}

const againLogic = (seq) => {
  const transformations = transFun.map(fun => fun.split('->')).map(([a, b]) => [a, b.split('|')])
  // console.log(transformations)
  let found = false
  initialStates.forEach(state => {
    if (!found) found = recursiveSeqGen(state, seq, transformations)
  })
  if (found) console.log('The sequence can be generated\n')
    else console.log('Can\'t be generated\n')
  return found
}

const logic = (option) => {
  option = Number(option)
  switch (option) {
    case 0:
      console.log('END')
      return false
    case 1:
      console.log(states.join(', '))
      break
    case 2:
      console.log(alphabet.join(', '))
      break
    case 3:
      console.log(transFun.join(', '))
      break;
    case 4:
      console.log(initialStates.join(', '))
      break;
    case 5:
      console.log(finalStates.join(', '))
      break;
    case 6:
        return 'some more logic required'
    default:
      console.log(`Bad input\n`)
  }
  console.log('\n')
  return true

}

const otherLogicMenu = () => {
  ask('What is the sequence?\n').then(res => {
    againLogic(res)
  })
  .then(menu)
}

const menu = () => {
  ask(text).then(res => {
    if (typeof logic(res) === 'string') otherLogicMenu()
    else if (logic(res)) menu()
    else console.log('ended')
  })
}

menu()
