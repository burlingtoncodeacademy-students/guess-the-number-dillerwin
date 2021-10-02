function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const { SSL_OP_LEGACY_SERVER_CONNECT } = require("constants");
const readline = require(`readline`);
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

function randNum(min, max) {
  let range = max - min + 1;
  let num = Math.floor(Math.random() * range) + min;
  return num;
}

start();
let min = 1;
let max = 100;
async function start() {
  //random number generator
  //console.log(num);
  console.log(
    `Let's play a game where you (human) make up a number between 1 and 100 and I (computer) try to guess it.\nAs a heads up, I am pretty literal and if you don't capitalize your words I might now understand!`
  );
  let reply = await ask(
    `\nHave you thought of a number between 1 and 100? (Yes or No)\n>_`
  );
  //console.log(`Hello, I am here`);
  if (reply.toLowerCase() !== `yes`) {
    //console.log(`I am Sam`);
    if (reply.toLowerCase() !== `no`) {
      reply = await ask(
        `Sorry, I didn't catch that. Let's try again:\nHave you thought of a number between 1 and 10? (Yes or No)\n>_`
      );
    } else {
      while (reply === `no`) {
        //console.log(`Sam I am`);
        if (reply.toLowerCase() === `yes`) {
          break;
        } else {
          //console.log(`Would you like green eggs and ham?`);
          // for people who refuse to say yes
          while (reply.toLowerCase() === `no`) {
            let count = 0;
            while (count < 4) {
              count += 1;
              while (reply.toLowerCase() !== `yes`) {
                if (reply.toLowerCase() === `no`) {
                  //console.log(`I do not like green eggs and ham.`);
                  if (count === 1) {
                    count += 1;
                    console.log(`Don't worry, I can wait...`);
                    await sleep(500);
                    reply = await ask(
                      `How about now? Do you have a number between 1 and 100?\n>_`
                    );
                  } else {
                    if (count === 2) {
                      await sleep(1000);
                      count += 1;
                      reply = await ask(
                        `Do you have a number between 1 and 100 now?\n>_`
                      );
                    } else {
                      if (count === 3) {
                        count += 1;
                        console.log(`No problem, I promise I'm patient...`);
                        await sleep(1000);
                        reply = await ask(`How about now?\n>_`);
                      } else {
                        if (count === 4) {
                          count += 1;
                          console.log(`Okay, come one, we don't have all day.`);
                          reply = await ask(
                            `Did you pick a number between 1 and 100?\n>_`
                          );
                        } else {
                          if (reply.toLowerCase() === `no`) {
                            console.log(`Well fine, be that way`);
                            process.exit();
                          }
                        }
                      }
                    }
                  }
                  // } else {
                  //   break;
                  // }
                  // if (reply.toLowerCase() === `yes`) {
                  //   console.log(`Awesome!`);
                  //   break;
                }
              }
            }
          }
        }
      }

      //need program to console.log guess and ask if that is right

      //need user to input if their number is higher or lower (be clear!!!)

      //need program to adjust randNum range, using number guessed as new min/max depending on user input

      //need anti-cheat???
    }
    if (reply.toLowerCase() === `yes`) console.log(`Awesome!`);
    //break;
  }

  let numGuess = 0;
  let guess = randNum(min, max);
  console.log(`I am Sam`);
  reply = await ask(`Is your number ${await guess}?\n>_`);
  numGuess += 1;
  // if (reply.toLowerCase() === `yes`) {
  //   console.log(`Sam I am`);
  //   reply = await ask(`Sorry, was your number ${await guess}? (Yes or No)\n>_`);
  // }
  while (reply.toLowerCase() !== `yes`) {
    if (reply.toLowerCase() !== `no`) {
      console.log(`Would you like green eggs and ham?`);
      reply = await ask(
        `Sorry, I didn't catch that. Is your number ${await guess}?\n>_`
      );
      //break;
    } else {
      break;
    }
  }
  if (reply.toLowerCase() === `yes`) {
    console.log(`I got it first try! Your number is ${guess}!`);
    process.exit();
  }
  if (reply.toLowerCase() === `no`) {
    numGuess += 1;

    //need program to redefine randNum parameters
    //console.log(`I would not like green eggs and ham`);
    while (reply.toLowerCase() !== `higher` || `lower`) {
      // reply = await ask(
      //   `Sorry, I didn't catch that. Is your number Higher or Lower than ${await guess}?\n>_`
      // );
      reply = await ask(`Is my guess Higher or Lower than your number?\n>_`);
      console.log(`I would not eat it in a box`);
      if (reply.toLowerCase() === `higher`) {
        max = guess;
        guess = Math.floor((max + min) / 2);
        reply = await ask(`Is your number ${await guess}?\n>_`);
        numGuess += 1;
        if (reply.toLowerCase() === `yes`) {
          console.log(
            `I did it! Your number was ${guess} and it took me ${numGuess} tries to guess it!`
          );
          process.exit();
        }
      } else {
        if (reply.toLowerCase() === `lower`) {
          console.log(`I do not like them Sam I am`);
          min = guess;
          guess = Math.floor((max + min) / 2);
          //console.log(await guess);
          reply = await ask(`Is your number ${await guess}?\n>_`);
          numGuess += 1;
          if (reply.toLowerCase() === `yes`) {
            console.log(
              `I did it! Your number was ${guess} and it took me ${numGuess} tries to guess it!`
            );
            process.exit();
          }
        }
      }
    }
  }
}
