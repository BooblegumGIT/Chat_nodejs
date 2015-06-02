var io = require('socket.io');

var connections = [],
    messages = [];

function sendAll(data) {
    for (var i = 0; i < connections.length; i++) {
        connections[i].emit('data', data);
    }
}

function chat_server(socket) {

    // Навешиваем обработчик на входящее сообщение
    socket.on('data', function (data) {
        var nick = socket.nick || (socket.id).toString().substr(0, 5);
        var time = (new Date).toLocaleTimeString();
        if (!data || data.type == undefined) {
            return;
        }
        switch (data.type) {
            case 'select-nick':
                socket.nick = data.nick.trim();
                sendAll({'type':'message', 'name': 'System', 'time': time,
                    'text': 'Пользователь {0} присоединился к  чату'.f(socket.nick)});
                connections.push(socket);
                socket.emit('data', {'type':'message', 'name': 'System', 'time': time,
                    'text': '{0}, добро пожаловать в чат '.f(socket.nick)});
                break;
            case 'message':
                var time = (new Date).toLocaleTimeString();
                var messageData = {'type':'message', 'name': nick, 'text': data.text, 'time': time};
                // Отсылаем сообщение ВСЕМ участникам чата
                sendAll(messageData)
        }
    });
    // При отключении клиента - уведомляем остальных...
    socket.on('disconnect', function() {
        var time = (new Date).toLocaleTimeString();
        var nick = socket.nick || (socket.id).toString().substr(0, 5);
        sendAll({'type':'message', 'name': 'System', 'time': time, 'text': 'Пользователь {0} покинул чат'.f(nick)});
        // ...и удаляем клиент из списка
        for (var i = 0; i < connections.length; i++) {
            if (connections[i] == socket) {
                connections.splice(i, 1);
                break;
            }
        }
    });
}

module.exports.chat_server = chat_server;