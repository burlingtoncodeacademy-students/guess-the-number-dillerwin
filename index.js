function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  console.log(`Hello, I am here`);
  while (reply.toLowerCase() !== `yes`) {
    while (reply.toLowerCase() !== `no`) {
      console.log(`Now I am here`);
      reply = await ask(
        `Sorry, I didn't catch that. Let's try again:\nHave you thought of a number between 1 and 10? (Yes or No)\n>_`
      );
      if (reply.toLowerCase() === `yes`) {
        console.log(`Now I'm over here`);
        //if (reply.toLowerCase() === `yes` || `no`) {
        // reply = await ask(
        //   `Sorry, I didn't catch that. Let's try again:\nHave you thought of a number between 1 and 10? (Yes or No)\n>_`
        // );
        break;
        //}
      } else {
        if (reply === `yes`) {
          console.log(`Awesome!`);
          break;
        } else {
          if (reply.toLowerCase() === `no`) {
            let count = 0;
            while (count < 4) {
              count += 1;
              if (reply === `yes`) {
                console.log(`Awesome!\n`);
                break;
              } else {
                if (count === 1) {
                  console.log(`Don't worry, I can wait...`);
                } else {
                  if (count === 2) {
                    await sleep(500);
                    reply = await ask(
                      `Do you have a number between 1 and 10 now?\n>_`
                    );
                  } else {
                    if (count === 3) {
                      console.log(`No problem, I promise I'm patient...`);
                      await sleep(1000);
                      reply = await ask(`How about now?\n>_`);
                    } else {
                      if (count === 4) {
                        reply = await ask(
                          `Okay, come one, we don't have all day.\n>_`
                        );
                        if (reply === `yes`) {
                          console.log(`Awesome!`);
                          let secretNumber = await ask(
                            `\n So then, what's your secret number?\n>_`
                          );
                          break;
                        } else {
                          if (reply.toLowerCase() === `no`) {
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
        }
        break;

        //need program to make a guess
        //((max + min)/2) will give middle ground number to guess

        //need program to console.log guess and ask if that is right

        //need user to input if their number is higher or lower (be clear!!!)

        //need program to adjust randNum range, using number guessed as new min/max depending on user input

        //need anti-cheat???
      }

      let numGuess = 0;
      let guess = randNum(min, max);
      reply = await ask(`Is your number ${await guess}?\n>_`);
      numGuess += 1;
      //console.log(`I am Sam`);
      while (reply.toLowerCase() === `yes` || `no`) {
        //console.log(`Sam I am`);
        while (reply.toLowerCase() !== `yes` || `no`) {
          //console.log(`I like green eggs and ham`);
          reply = await ask(
            `Sorry, was your number ${await guess}? (Yes or No)\n>_`
          );
          break;
        }
        if (reply.toLowerCase() === `no`) {
          numGuess += 1;
          reply = await ask(
            `Is my guess Higher or Lower than your number?\n>_`
          );
          //need program to redefine randNum parameters
          console.log(`I am Sam`);
          while (reply.toLowerCase() === `higher`) {
            max = guess;
            // console.log(guess);
            // console.log(max);
            guess = Math.floor((max + min) / 2);
            //guess = randNum(min, max)
            //console.log(await guess);
            if (max <= reply) {
              reply = await ask(`Are you sure?\n>_`);
            } else {
              reply = await ask(`Is your number ${await guess}?\n>_`);
              numGuess += 1;
            }
          }
          while (reply.toLowerCase() === `lower`) {
            min = guess;
            guess = Math.floor((max + min) / 2);
            //console.log(await guess);
            reply = await ask(`Is your number ${await guess}?\n>_`);
            numGuess += 1;
          }
          //      while (reply.toLowerCase() !== `higher` || `lower`) {

          //    }
        } else {
          if (reply.toLowerCase() === `yes`) {
            console.log(
              `I did it! Your number was ${guess} and I got it first try!`
            );
            process.exit();
          }
        }
      }
      // if (reply === `yes`) {
      //
      // }
    }
  }
}
