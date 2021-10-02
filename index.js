// delay function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// readline (just works, don't ask questions)
const { SSL_OP_LEGACY_SERVER_CONNECT } = require("constants");
const readline = require(`readline`);
const rl = readline.createInterface(process.stdin, process.stdout);

// ask function
function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

// random number generator
function randNum(min, max) {
  let range = max - min + 1;
  let num = Math.floor(Math.random() * range) + min;
  return num;
}

// guessing game as a whole
start();

async function start() {
  //random number generator
  let min = 1;
  console.log(
    `Let's play a game where you (human) make up a number and I (computer) try to guess it!`
  );
  //here is where I put the range adjuster
  let maxInit = await ask(`\nWhat do you want our range to be?\n>_`);
  let max = parseFloat(maxInit);
  /* had problem where no input throws NaN but through argument as truthy, fixed by changing while(isNaN(maxInit)) to while (isNaN(max))
  and added max = parseFloat(maxInit) below to re-parse*/
  while (isNaN(max)) {
    maxInit = await ask(`Sorry, can you please enter a number?\n>_`);
    max = parseFloat(maxInit);
  }
  // assigning reply, beginning initial questions
  let reply = await ask(
    `\nHave you thought of a number between 1 and ${max}? (Yes or No)\n>_`
  );
  // `no` throwing infinite loop?
  while (reply.toLowerCase() !== `yes`) {
    console.log(`eyyy`)
    let count = 0;
    if (reply.toLowerCase() === `no`) {
      if (reply.toLowerCase() !== `no`) {
        //catch for non yes/no answers or miskeys
        reply = await ask(
          `Sorry, I didn't catch that. Let's try again:\nHave you thought of a number between 1 and ${max}? (Yes or No)\n>_`
        );
        count += 1;
        //} else {
        // sarcastic ragequit
        while (reply === `no`) {
          if (reply.toLowerCase() === `yes`) {
            break;
          } else {
            // for people who refuse to say yes
            while (reply.toLowerCase() === `no`) {
              while (count < 4) {
                count += 1;
                while (reply.toLowerCase() === `no`) {
                  console.log(`eyo`);
                  if (count === 1) {
                    count += 1;
                    console.log(`Don't worry, I can wait...`);
                    await sleep(500);
                    reply = await ask(
                      `How about now? Do you have a number between 1 and ${max}?\n>_`
                    );
                  } else {
                    if (count === 2) {
                      await sleep(1000);
                      count += 1;
                      reply = await ask(
                        `Do you have a number between 1 and ${max} now?\n>_`
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
                            `Did you pick a number between 1 and ${max}?\n>_`
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
    }
    //exit to actual guessing game
    if (reply.toLowerCase() === `yes`) console.log(`Awesome!`);
  }

  let numGuess = 0;
  let guess = randNum(min, max);
  reply = await ask(`Is your number ${await guess}?\n>_`);
  // numGuess += 1;
  while (reply.toLowerCase() !== `yes`) {
    if (reply.toLowerCase() !== `no`) {
      //console.log(`Would you like green eggs and ham?`);
      reply = await ask(
        `Sorry, I didn't catch that. Is your number ${await guess}?\n>_`
      );
    } else {
      break;
    }
  }
  if (reply.toLowerCase() === `yes`) {
    console.log(`I got it first try! Your number is ${guess}!`);
    process.exit();
  }
  if (reply.toLowerCase() === `no`) {
    while (reply.toLowerCase() !== `higher` || `lower`) {
      reply = await ask(`Is my guess Higher or Lower than your number?\n>_`);
      console.log(`I do not like them with a mouse`);
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
          console.log(`I do not like them here or there`);
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
