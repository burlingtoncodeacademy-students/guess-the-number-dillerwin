const readline = require(`readline`);
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

start();
let min = 1;
let max = 100;
async function start() {
  //random number generator
  function randNum(min, max) {
    let range = max - min + 1;
    let num = Math.floor(Math.random() * range) + min;
    return num;
    //console.log(num);
  }
  console.log(
    `Let's play a game where you (human) make up a number between 1 and 100 and I (computer) try to guess it.\nAs a heads up, I am pretty literal and if you don't capitalize your words I might now understand!`
  );
  let reply = await ask(
    `\nHave you thought of a number between 1 and 100? (Yes or No)\n>_`
  );
  while (reply !== `Yes`) {
    if (reply === `No`) {
      break;
    } else {
      reply = await ask(
        `Sorry, I didn't catch that. Let's try again:\nHave you thought of a number between 1 and 10? (Yes or No)\n>_`
      );
      if (reply === `Yes`) {
        console.log(`Awesome!`);
        break;
      } else {
        if (reply === `No`) {
          break;
        }
      }
    }
  }
  while (reply === `Yes` || `No`) {
    while (reply === `No`) {
      let count = 0;
      while (count < 4) {
        count += 1;
        if (reply === `Yes`) {
          console.log(`Awesome!\n`);
          break;
        } else {
          if (count === 1) {
            console.log(`Don't worry, I can wait...`);
          } else {
            if (count === 2) {
              reply = await ask(
                `Do you have a number between 1 and 10 now?\n>_`
              );
            } else {
              if (count === 3) {
                console.log(`No problem, I promise I'm patient...`);
                reply = await ask(`How about now?\n>_`);
              } else {
                if (count === 4) {
                  reply = await ask(
                    `Okay, come one, we don't have all day.\n>_`
                  );
                  if (reply === `Yes`) {
                    console.log(`Awesome!`);
                    let secretNumber = await ask(
                      `\n So then, what's your secret number?\n>_`
                    );
                    break;
                  } else {
                    if (reply === `No`) {
                      console.log(`Well fine, be that way`);
                      process.exit();
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    break;

    //need program to make a guess
    //((max + min)/2) will give middle ground number to guess

    //need program to console.log guess and ask if that is right

    //need user to input if their number is higher or lower (be clear!!!)

    //need program to adjust randNum range, using number guessed as new min/max depending on user input

    //need anti-cheat???

    //Now try and complete the program.
  }
  let guess = randNum(min, max);
  reply = await ask(`Is your number ${await guess}?\n>_`);

  while (reply !== `Yes` && `No`) {
    while (reply === `No`) {
      //console.log(`${min}, ${max}`)
      reply = await ask(`Is my guess Higher or Lower than your number?\n>_`);
      // if (reply !== `Higher` && `Lower`) {
      //   //catching edges
      //   reply = await ask(
      //     `Sorry, I didn't catch that.\nWas my guess Higher or Lower than your number?\n>_`
      //   );
      //}
      //need program to redefine randNum parameters
      while (reply === `Higher`) {
        max = guess;
        // console.log(guess);
        // console.log(max);
        guess = Math.floor((max + min) / 2);
        //guess = randNum(min, max)
        console.log(await guess);
        reply = await ask(`Is your number ${await guess}?\n>_`);
      }
      while (reply === `Lower`) {
        min = guess;
        guess = Math.floor((max + min) / 2);
        console.log(await guess);
        reply = await ask(`Is your number ${await guess}?\n>_`);
      }
    }
    // while (reply !== `Yes`) {
    //   reply = await ask(
    //     `Sorry, I didn't catch that. Is my guess Higher or Lower than your number?\n>_`
    //   );
    //}
  }
}
