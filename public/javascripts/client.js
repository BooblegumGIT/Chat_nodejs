strings = {
    'connected': '[sys][time]%time%[/time]: Вы успешно соединились к сервером как [user]%name%[/user].[/sys]',
    'userJoined': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] присоединился к чату.[/sys]',
    'messageSent': '[out][time]%time%[/time]: [user]%name%[/user]: %text%[/out]',
    'messageReceived': '[in][time]%time%[/time]: [user]%name%[/user]: %text%[/in]',
    'userSplit': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] покинул чат.[/sys]'
};
$(function() {
    socket = io.connect('http://localhost:3000');

    socket.on('connect', function () {
        var log = $('#log');
        socket.on('message', function (msg) {
            console.log(log.html());
            // Добавляем в лог сообщение, заменив время, имя и текст на полученные
            document.querySelector('#log').innerHTML += strings[msg.event]
                    .replace(/\[([a-z]+)\]/g, '<span class="$1">')
                    .replace(/\[\/[a-z]+\]/g, '</span>')
                    .replace(/\%time\%/, msg.time).replace(/\%name\%/, msg.name)
                    .replace(/\%text\%/, unescape(msg.text)
                    .replace('<', '&lt;').replace('>', '&gt;')) + '<br>';
            // Прокручиваем лог в конец
            document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
        });
        // При нажатии <Enter> или кнопки отправляем текст
        document.querySelector('#input').onkeypress = function(e) {
            if (e.which == '13') {
                //socket.send(escape(document.querySelector('#input').value));
                socket.emit('data', { type: 'message', nick: text.val() });
                // Очищаем input
                document.querySelector('#input').value = '';
            }
        };
        document.querySelector('#send').onclick = function() {
            socket.send(escape(document.querySelector('#input').value));
            document.querySelector('#input').value = '';
        };
    });
});