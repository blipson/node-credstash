const
    aesjs   = require('aes-js'),
    encoder = require('./encoder');

module.exports = {
    decrypt: (stashes) => {
        return stashes.map(stash => {
            const
                key            = stash.keyPlaintext,
                value          = encoder.decode(stash.contents),
                aesCtr         = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(1)),
                decryptedBytes = aesCtr.decrypt(value);

            return decryptedBytes.toString();
        });
    }
};
