// readline (just works, don't ask questions)
const readline = require(`readline`);
const rl = readline.createInterface(process.stdin, process.stdout);

// ask function
function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

// delay function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  //replay function. Logs how many times you've played, asks if you want to play again or not
  let plays = 0;
  async function replay() {
    //only lists play times after the first time
    if (plays > 1) {
      //log to display how many times the game has run this session
      console.log(`We've played ${plays} times!`);
      await sleep(250);
    }
    //asks to play game again
    let repeat = await ask(`Do you want to play again?\n>_`);
    //repeat input sanitization
    repeat = repeat.toLowerCase().trim();
    //miskey catch
    while (repeat !== `no` && repeat !== `yes`) {
      repeat = await ask(
        `Sorry, I didn't catch that. Do you want to play again? (yes or no)\n>_`
      );
    }
    //if they don't want to play again
    if (repeat === `no`) {
      console.log(`Okay! It's been fun playing together!`);
      await sleep(200);
      //exits application
      process.exit();
    } else {
      //if they want to play agian
      if (repeat === `yes`) {
        // yes starts game at beginning
        console.log(`Awesome! I'll start us from the beginning!\n`);
        await sleep(500);
        //begins game again
        await start();
      }
    }
  }

  // starts opening of computer-guessing-number game
  // set min variable for cheat-catch, initiate max variable
  let min = 1;
  let max;
  //function to set range for game
  async function rangeAsk() {
    //here is where I put the range adjuster
    let maxInit = await ask(`What do you want our range to be?\n>_`);

    //converts maxInit to Number
    max = parseFloat(maxInit);

    /* had problem where no input throws NaN but put through argument as truthy,
  fixed by changing while(isNaN(maxInit)) to while (isNaN(max))
  and added max = parseFloat(maxInit) below to re-parse to number*/

    while (isNaN(max)) {
      // NaN catch
      maxInit = await ask(`Sorry, can you please enter a number?\n>_`);
      max = parseFloat(maxInit);
    }

    return max;
  }

  //initial log to begin game
  reply = await ask(
    `Let's play a game! Do you want to guess the number, or do you want me to guess? (you or me)\n>_`
  );

  if (reply.toLowerCase().includes(`you`)) {
    //computer guessing player's number
    console.log(`Sure, I'll guess your number!`);
    //set range
    await rangeAsk();
    //run computer guess game
    computerGuess(max);
  } else {
    //player guessing computer's number
    console.log(`Okay, you can guess my number!`);
    //set range
    await rangeAsk();
    //run human guessing game
    humanGuess(max);
  }

  //human guessing number
  async function humanGuess(max) {
    //get random number in given range
    let num = randNum(min, max);
    reply = await ask(
      `Okay, I have a number between 1 and ${max}! What's your first guess? (Please give me just a number)\n>_`
    );
    //convert reply to Number
    reply = parseFloat(reply);
    //checks that input converted correctly, if not asks for a number
    while (isNaN(reply)) {
      reply = await ask(
        `Sorry, I think I misread that. What was your number? (Please enter just the number)\n>_`
      );
      //converts reply to Number
      reply = parseFloat(reply);
    }
    //loop for player not guessing correct number
    while (reply !== num) {
      //if guess is lower than number
      if (num > reply) {
        reply = await ask(
          `That's not it! My number is higher than that. Guess again!\n>_`
        );
        //convert to Number
        reply = parseFloat(reply);
      } else if (num < reply) {
        //if guess is higher than number
        reply = await ask(`Nope! My number is lower than that. Try again!\n>_`);
        //convert to number
        reply = parseFloat(reply);
      } else if (num === reply) {
        //if guess is correct
        break;
      }
    }
    //win response
    if (reply === num) {
      console.log(`You guessed it!`);
      //increases play count by 1
      play += 1;
      await sleep(500);
      //runs replay function
      replay();
    }
  }

  //computer guessing the number
  async function computerGuess(max) {
    // assigning reply, beginning initial questions
    let reply = await ask(
      `Have you thought of a number between 1 and ${max}? (yes or no)\n>_`
    );
    // `no` throwing infinite loop? -- fixed. I'm not entirely sure what was wrong to being with, but it's working so ¯\_(ツ)_/¯
    // mis-key catch
    while (
      !reply.toLowerCase().includes(`yes`) &&
      !reply.toLowerCase().includes(`no`)
    ) {
      reply = await ask(
        `Sorry, I didn't catch that. Let's try again:\nHave you thought of a number between 1 and ${max}? (yes or no)\n>_`
      );
    }
    while (reply.toLowerCase() !== `yes`) {
      //establishes count for how many times they've said 'no'
      let count = 0;
      if (reply.toLowerCase() === `no`) {
        // sarcastic ragequit
        while (reply === `no`) {
          if (reply.toLowerCase() === `yes`) {
            break;
          } else {
            // for people who refuse to say yes
            while (reply.toLowerCase() === `no`) {
              //allows for a No answer 4 times
              while (count < 4) {
                //increases count
                count += 1;
                while (reply.toLowerCase() === `no`) {
                  //first no
                  if (count === 1) {
                    count += 1;
                    console.log(`Don't worry, I can wait...`);
                    await sleep(500);
                    reply = await ask(
                      `How about now? Do you have a number between 1 and ${max}?\n>_`
                    );
                  }
                  //second no
                  else if (count === 2) {
                    await sleep(1000);
                    count += 1;
                    reply = await ask(
                      `Do you have a number between 1 and ${max} now?\n>_`
                    );
                  }
                  //third no
                  else if (count === 3) {
                    count += 1;
                    console.log(`No problem, I promise I'm patient...`);
                    await sleep(1000);
                    reply = await ask(`How about now?\n>_`);
                  }
                  //fourth no
                  else if (count === 4) {
                    count += 1;
                    console.log(`Okay, come one, we don't have all day.`);
                    reply = await ask(
                      `Did you pick a number between 1 and ${max}?\n>_`
                    );
                  }
                  // fifth no, quits game
                  else if (reply.toLowerCase() === `no`) {
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
    //exit to actual guessing game
    if (reply.toLowerCase() === `yes`) {
      console.log(`Awesome!`);
      await sleep(500);
    }
    // actual guessing sequence
    let numGuess = 0;
    // gets random initial guess within the range
    let guess = randNum(min, max);
    //sends guess
    reply = await ask(`Is your number ${await guess}?\n>_`);
    //adds one to guess count
    numGuess += 1;
    //miskey catch
    while (reply.toLowerCase() !== "no" && reply.toLowerCase() !== `yes`) {
      reply = await ask(
        `Sorry, I didn't catch that. Is your number ${await guess}?\n>_`
      );
    }
    //if first guess was right
    if (reply.toLowerCase() === `yes`) {
      console.log(`I got it first try! Your number is ${guess}!`);
      await sleep(500);
      //adds one to play count
      plays += 1;
      //sends player to replay ask
      replay();
    }
    //if first guess was wrong
    while (reply.toLowerCase().includes(`no`)) {
      reply = await ask(`Is my guess Higher or Lower than your number?\n>_`);
      //miskey catch
      while (
        reply.toLowerCase() !== `higher` &&
        reply.toLowerCase() !== `lower`
      ) {
        reply = await ask(
          `Sorry, I didn't catch that, was my guess higher or lower than your number?(higher or lower)\n>_`
        );
      }
      //if they answer higher
      if (reply.toLowerCase().includes(`higher`)) {
        //sets top end of range to our last guess
        max = guess;
        //generates new guess
        guess = Math.floor((max + min) / 2);
        //offers that guess up
        reply = await ask(`Is your number ${await guess}?\n>_`);
        numGuess += 1;
        // liar catch
        if (max <= min) {
          //caught 'em cheatin
          reply = await ask(`Are you sure about that? (yes or no)\n>_`);
          //miskey catch
          while (
            !reply.toLowerCase().includes(`yes`) &&
            !reply.toLowerCase().includes(`no`)
          )
            //we know their lying, we don't play with liars
            if (reply.toLowerCase() === `yes`) {
              console.log(`Sorry, I don't play with cheaters.`);
              process.exit();
            } else {
              //they admitted their mistake, so we'll keep playing
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
        //we guess correctly
        if (reply.toLowerCase() === `yes`) {
          console.log(
            `I did it! Your number was ${guess} and it took me ${numGuess} tries to guess it!`
          );
          await sleep(500);
          plays += 1;
          //offers replay
          replay();
        }
      } else if (reply.toLowerCase() === `lower`) {
        //if our guess is higher than their number
        //sets bottom end of range to last guess
        min = guess;
        //generates new guess
        guess = Math.floor((max + min) / 2);
        reply = await ask(`Is your number ${await guess}?\n>_`);
        numGuess += 1;
        //liar catch number 2, see comments above
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
        //if we guess correctly
        if (reply.toLowerCase() === `yes`) {
          console.log(
            `I did it! Your number was ${guess} and it took me ${numGuess} tries to guess it!`
          );
          await sleep(500);
          plays += 1;
          //offers replay
          replay();
        }
      }
    }
  }
}
