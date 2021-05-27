const randomize = require('randomatic');

module.exports = async ()=>{
    const RANDOM_CODE = randomize('0',6);
    return RANDOM_CODE
}