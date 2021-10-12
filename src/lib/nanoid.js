const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyuABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", 12);

module.exports = { nanoid };