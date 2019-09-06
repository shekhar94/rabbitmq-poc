#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function (msg) {
            // pushing the same message to queue until delivered
            if (parseInt(msg.content.toString()) < 10) {
                const n = parseInt(msg.content.toString()) + 1;
                channel.sendToQueue(queue, Buffer.from(n.toString()));
            }
            console.log(" [x] Received %s", msg.content.toString());
        }, {
                noAck: true
            });
    });
});
