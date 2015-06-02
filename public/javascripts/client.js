function createMessageElement(msg) {

    var messageElement = $('<li></li>'),
        timeElement = $('<span></span>').addClass('time').text(msg.time + ' '),
        nickElement = $('<span></span>').addClass('nick').text((msg.name ? msg.name : 'unknown')+':'),
        textElement = $('<span></span>').addClass('text').text(msg.text ? msg.text: '');

    messageElement.append(timeElement);
    messageElement.append(nickElement);
    messageElement.append(textElement);

    return messageElement;
}

/**
 * message format: {event: "", name: "", time: "17:05:18", text: ""}
 */

$(function() {
    var socket = io.connect('http://localhost:3000');
    var nick;

    socket.on('connect', function () {
        var messages = $('#messages').find('ul'),
            btn_send = $('#send'),
            input = $('#input');
        socket.on('data', function (data) {
            console.log(data);
            switch (data.type) {
                case 'message':
                    messages.append(createMessageElement(data));
                    //document.querySelector('#messages').scrollTop = document.querySelector('#messages').scrollHeight;
                    break;
            }

        });
        var sendMessage = function () {
            if (!input.val().trim().length) {
                return;
            }
            console.log("nick = " + nick);
            if (!nick) {
                nick = input.val();
                socket.emit('data', { type: 'select-nick', nick: input.val() });
                $('#welcome .select-nick').hide();
                $('#welcome .send-message').show();
            } else {
                socket.emit('data', { type: 'message', text: input.val() });
            }
            input.val('');
        };
        input.on('keypress', function(e) {
            if (e.which == '13') { // Enter
                sendMessage();
                input.val('');
            }
        });
        btn_send.on('click',function() {
            sendMessage();
            input.val('');
        });
    });
});