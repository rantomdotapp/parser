/* eslint-disable */
const fs = require('fs');

const aptosTokens = require('../configs/tokens/aptos.json');

for (const [key] of Object.entries(aptosTokens)) {
  aptosTokens[key].address = aptosTokens[key].address.toLowerCase();
}

let ordered = Object.keys(aptosTokens)
  .sort()
  .reduce((obj, key) => {
    obj[key] = aptosTokens[key];
    return obj;
  }, {});

fs.writeFileSync('./configs/tokens/aptos.json', JSON.stringify(ordered).toString());
