const
    crypto  = require('crypto'),
    encoder = require('./encoder');

module.exports = {
    check(stashes) {
        const wrongMacs = stashes.filter(stash => {
            const
                hmac     = crypto.createHmac('sha256', stash.hmacPlaintext),
                contents = encoder.decode(stash.contents);

            hmac.update(contents);
            return hmac.digest('hex') !== stash.hmac;
        });

        if (wrongMacs.length > 0) {
            throw new Error('Computed HMAC does not match store HMAC');
        }

        return stashes;
    }
};
