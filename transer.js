const fs = require("fs");
const path = require("path")
const [ ,, ijInputFileName, jsOutputFileName ] = process.argv;

const ijInputFilePath = path.resolve(__dirname, ijInputFileName)
const ijInput = fs.readFileSync(ijInputFilePath, "utf-8");

const whiteSpaces = [ " ", "\t" ];
const delimiters = [
  ...whiteSpaces, 
  "\n",
  "▸",
  "◂",
  "︷",
  "︸",
  ",",
  ".",
  ":",
  "?",
  "!",
  "&",
  "﹇",
  "﹈",
];

const syntax = {
  "إذا": { translation: "if" },
  "ثابتة": { translation: "const" },
  "اجعل": { translation: "let" },
  "مادام": { translation: "while" },
  "ل": { translation: "for" },
  "في": { translation: "in" },
  "▸": { translation: "(" },
  "◂": { translation: ")" },
  "︷": { translation: "{" },
  "︸": { translation: "}" },
  "﹇": { translation: "[" },
  "﹈": { translation: "]" },
}

let jsOutput = ""
const processStatement = statement => {
  const translation = syntax[statement]?.translation ?? statement;
  jsOutput += translation;
}

let currentStatement = "";
for(let index = 0; index < ijInput.length; index++) {
  const char = ijInput[index];

  if(whiteSpaces.includes(char) && whiteSpaces.includes(ijInput[index - 1])) continue;

  if(char === "\n" && ijInput[index - 1] === "\n") continue;

  if (delimiters.includes(char)) {
    processStatement(currentStatement);
    processStatement(char);
    currentStatement = "";
  } else {
    currentStatement += char;
  }
}


const jsOutputFilePath = path.resolve(__dirname, jsOutputFileName);
fs.writeFileSync(jsOutputFilePath, jsOutput);
