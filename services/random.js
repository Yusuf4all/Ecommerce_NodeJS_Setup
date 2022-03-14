const randomize = require('randomatic');

module.exports = {
    async getVerificationCode(){
        const RANDOM_CODE = randomize('0',6);
        return RANDOM_CODE
    },

    async getPassword(){
        const PASSWORD = randomize('Aa0!',10)
        return PASSWORD;
    }
}