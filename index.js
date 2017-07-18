const
    decrypter = require('./lib/decrypter'),
    encoder   = require('./lib/encoder'),
    hmac      = require('./lib/hmac'),
    keys      = require('./lib/keys'),
    secrets   = require('./lib/secrets');

function Credstash(config) {
    this.table = config ? config.table : 'credential-store';
}

const default_get_options = {
    limit: 1
};

Credstash.prototype.get = function (name, subkeys, context, options) {
    console.log('HI IM IN THE CREDSTASH GET FUNCTION');
    if (!Array.isArray(subkeys)) {
        options = context;
        context = subkeys;
        subkeys = [];
    }

    if (subkeys.length) {
        return Promise.all(subkeys.map(key => this.get(`${name}.${key}`, context, options)))
                      .then(secrets => secrets.reduce((o, sec, i) => Object.assign(o, { [subkeys[i]]: sec }), {}));
    }

    options = Object.assign({}, default_get_options, options);

    return secrets.get(this.table, name, options)
                  .then(result => keys.decrypt(result, context))
                  .then(keys_decrypted => hmac.check(keys_decrypted))
                  .then(checked => decrypter.decrypt(checked))
                  .then(decrypted => options.limit === 1 ? decrypted && decrypted[0] : decrypted);
};

module.exports = Credstash;
