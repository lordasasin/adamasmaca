const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mainMenu() {
    console.log("\nWelcome!");
    console.log("Options:");
    console.log("1 - New Game");
    console.log("2 - LeaderBoard");
    console.log("3 - Quit");

    rl.question("Your choice: ", function (choice) {
        if (choice === "1") {
            rl.question("Enter your name: ", function (playerName) {
                console.log("Choose difficulty (1: Easy, 2: Normal, 3: Hard)");
                rl.question("Difficulty: ", function (difficulty) {
                    let fileName = "";
                    let lives = 0;

                    if (difficulty === "1") {
                        fileName = "easy.txt";
                        lives = 4;
                        difficultyPoint = 2;
                    } else if (difficulty === "2") {
                        fileName = "normal.txt";
                        lives = 5;
                        difficultyPoint = 3;
                    } else if (difficulty === "3") {
                        fileName = "hard.txt";
                        lives = 6;
                        difficultyPoint = 4;
                    } else {
                        console.log("Invalid difficulty selected.");
                        return mainMenu();
                    }

                   

                    const content = fs.readFileSync(fileName, "utf8");
                    let words = [];
                    let currentWord = "";

                    for (let i = 0; i < content.length; i++) {
                        const ch = content[i];

                        if (ch === " " || ch === "\n" || ch === "\t") {
                            if (currentWord.length > 0) {
                                words.push(currentWord);
                                currentWord = "";
                            }
                        } else {
                            currentWord += ch;
                        }
                    }

                    if (currentWord.length > 0) {
                        words.push(currentWord);
                    }

                    let word = words[0].trim().toLowerCase();




                    let hidden = [];
                    for (let i = 0; i < word.length; i++) {
                        hidden[i] = "_";
                    }

                    console.log("\nGuess the word:");
                    console.log(hidden.join(" "));
                    console.log(`You have ${lives} lives.`);

                    function askLetter() {
                        rl.question("Guess a letter: ", function (letter) {
                            letter = letter.toLowerCase();

                            if (letter.length !== 1 || !letter.match(/[a-z]/)) {
                                console.log("Please enter a single valid letter.");
                                return askLetter();
                            }

                            let found = false;
                            for (let i = 0; i < word.length; i++) {
                                if (word[i] === letter) {
                                    hidden[i] = letter;
                                    found = true;
                                }
                            }

                            if (found) {
                                console.log("Correct guess!");
                            } else {
                                lives--;
                                console.log(`Wrong guess! Lives left: ${lives}`);
                                if (lives <= 0) {
                                    console.log(`Game over! The word was: ${word}`);
                                    return mainMenu();
                                }
                            }

                            console.log(hidden.join(" "));

                            if (hidden.join("") === word) {
                                console.log("Congrats! You guessed the word:", word);




                                const point = difficultyPoint * lives;
                                fs.appendFileSync("leaderboard.txt", `name: ${playerName} - point: ${point}\n`);
                                console.log(`Puanın kaydedildi! ${playerName} - ${point} puan`);

                                return mainMenu();
                            } else {
                                askLetter();
                            }
                        });
                    }

                    askLetter();
                });
            });

        } else if (choice === "2") {
            console.log("\n--- LeaderBoard ---");
            const leaderboard = fs.readFileSync("leaderboard.txt", "utf8");
            console.log(leaderboard);

            return mainMenu();

        } else if (choice === "3") {
            console.log("Exiting.");
            rl.close();

        } else {
            console.log("Invalid choice.");
            mainMenu();
        }
    });
}

mainMenu();
