const
    AWS    = require('aws-sdk'),
    dynamo = new AWS.DynamoDB({ region: process.env.AWS_DEFAULT_REGION });

module.exports = {
    get(table, name, options) {
        const params = {
            TableName:                 table,
            ConsistentRead:            true,
            Limit:                     options.limit,
            ScanIndexForward:          false,
            KeyConditionExpression:    '#N = :v_name',
            ExpressionAttributeNames:  { '#N': 'name' },
            ExpressionAttributeValues: { ':v_name': { S: name } }
        };

        return new Promise((resolve, reject) => {
            dynamo.query(params, (err, raw_result) => {
                if (err) {
                    return reject(err);
                }

                if (!raw_result.Items || raw_result.Items.length === 0) {
                    return reject(new Error('Secret not found: ' + name));
                }

                const result = raw_result.Items.map(item => ({
                    key:      item.key.S,
                    hmac:     item.hmac.S,
                    contents: item.contents.S
                }));

                resolve(result);
            });
        });
    }
};
