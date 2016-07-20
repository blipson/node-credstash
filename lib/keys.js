const
    AWS     = require('aws-sdk'),
    encoder = require('./encoder'),

    kms = new AWS.KMS({ region: process.env.AWS_DEFAULT_REGION });

module.exports = {
    decrypt(stashes, context) {
        return Promise.all(stashes.map(s =>
            new Promise((resolve, reject) => {
                kms.decrypt({
                    CiphertextBlob:    encoder.decode(s.key),
                    EncryptionContext: context || ''
                }, (err, decrypted) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(decrypted);
                });
            })
        )).then(decrypted_keys => stashes.map((stash, i) => {
            stash.keyPlaintext = new Buffer(32);
            stash.hmacPlaintext = new Buffer(32);
            decrypted_keys[i].Plaintext.copy(stash.keyPlaintext, 0, 0, 32);
            decrypted_keys[i].Plaintext.copy(stash.hmacPlaintext, 0, 32);
            return stash;
        }));
    }
};
