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
  // here is the replay option. Logs how many times you've played, asks if you want to play again or not
  let plays = 0;
  async function replay() {
    if (plays > 1) {
      console.log(`We've played ${plays} times!`);
      await sleep(250);
    }
    let repeat = await ask(`Do you want to play again?\n>_`);
    while (repeat.toLowerCase() !== `no` || `yes`) {
      if (repeat.toLowerCase() === `no`) {
        console.log(`Okay! It's been fun playing together!`);
        await sleep(500);
        process.exit();
      } else {
        if (repeat.toLowerCase() === `yes`) {
          console.log(`Awesome! I'll start us from the beginning!\n`);
          await sleep(500);
          await start();
        } else {
          // mis-key catch, took a hot minute even after making like 4 other lmao
          while (repeat.toLowerCase() !== `yes` && `no`) {
            repeat = await ask(
              `Sorry, I didn't catch that. Do you want to play again?`
            );
            break;
          }
        }
      }
      // }
    }
  }
  // starts opening of computer-guessing-number game
  let min = 1;
  console.log(
    `Let's play a game where you (human) make up a number and I (computer) try to guess it!`
  );
  //here is where I put the range adjuster
  let maxInit = await ask(`\nWhat do you want our range to be?\n>_`);
  let max = parseFloat(maxInit);
  /* had problem where no input throws NaN but put through argument as truthy,
  fixed by changing while(isNaN(maxInit)) to while (isNaN(max))
  and added max = parseFloat(maxInit) below to re-parse to number*/
  while (isNaN(max)) {
    // NaN catch
    maxInit = await ask(`Sorry, can you please enter a number?\n>_`);
    max = parseFloat(maxInit);
  }
  // assigning reply, beginning initial questions
  let reply = await ask(
    `\nHave you thought of a number between 1 and ${max}? (Yes or No)\n>_`
  );
  // `no` throwing infinite loop? -- fixed. I'm not entirely sure what was wrong to being with, but it's working so ¯\_(ツ)_/¯
  while (reply.toLowerCase() !== `yes`) {
    let count = 0;
    if (reply.toLowerCase() === `no`) {
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
                //console.log(`eyo`);
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
                          //rage quit lol
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
    } else {
      // mis-key catch 1
      reply = await ask(
        `Sorry, I didn't catch that. Let's try again:\nHave you thought of a number between 1 and ${max}? (Yes or No)\n>_`
      );
      count += 1;
    }
    //exit to actual guessing game
    if (reply.toLowerCase() === `yes`) console.log(`Awesome!`);
    await sleep(500);
  }
  // actual guessing sequence
  let numGuess = 0;
  let guess = randNum(min, max);
  reply = await ask(`Is your number ${await guess}?\n>_`);
  numGuess += 1;
  while (reply.toLowerCase() !== `yes`) {
    if (reply.toLowerCase() !== `no`) {
      reply = await ask(
        `Sorry, I didn't catch that. Is your number ${await guess}?\n>_`
      );
    } else {
      break;
    }
  }
  if (reply.toLowerCase() === `yes`) {
    console.log(`I got it first try! Your number is ${guess}!`);
    await sleep(500);
    plays += 1;
    replay();
  }
  if (reply.toLowerCase() === `no`) {
    while (reply.toLowerCase() !== `higher` || `lower`) {
      reply = await ask(`Is my guess Higher or Lower than your number?\n>_`);
      if (reply.toLowerCase() === `higher`) {
        max = guess;
        guess = Math.floor((max + min) / 2);
        reply = await ask(`Is your number ${await guess}?\n>_`);
        numGuess += 1;
        // liar catch
        if (max <= min) {
          reply = await ask(`Are you sure about that?\n>_`);
          console.log(`Actually I'm here`);
          if (reply.toLowerCase() === `yes`) {
            console.log(`Sorry, I don't play with cheaters.`);
            process.exit();
          } else {
            if (reply.toLowerCase() === `no`) {
              console.log(
                `I thought not. Your number is ${await guess}. Shame on you for trying to cheat.`
              );
              await sleep(500);
              plays += 1;
              replay();
            }
          }
        }
        if (reply.toLowerCase() === `yes`) {
          console.log(
            `I did it! Your number was ${guess} and it took me ${numGuess} tries to guess it!`
          );
          await sleep(500);
          plays += 1;
          replay();
        }
      } else {
        if (reply.toLowerCase() === `lower`) {
          min = guess;
          guess = Math.floor((max + min) / 2);
          //console.log(await guess);
          reply = await ask(`Is your number ${await guess}?\n>_`);
          numGuess += 1;
          //liar catch number 2
          if (max <= min) {
            reply = await ask(`Are you sure about that?\n>_`);
            if (reply.toLowerCase() === `yes`) {
              console.log(`Sorry, I don't play with cheaters.`);
              process.exit();
            } else {
              if (reply.toLowerCase() === `no`) {
                console.log(
                  `I thought not. Your number is ${await guess}. Shame on you for trying to cheat.`
                );
                await sleep(500);
                plays += 1;
                replay();
              }
            }
          }
          if (reply.toLowerCase() === `yes`) {
            console.log(
              `I did it! Your number was ${guess} and it took me ${numGuess} tries to guess it!`
            );
            await sleep(500);
            plays += 1;
            replay();
          }
        }
      }
    }
  }
}
