document.getElementById("send").onclick = () => {
    const field = document.getElementById("password_field");
    const log = document.getElementById("log_div");
    const password = field.value;
    const illegalPasswordLog = '<p class="error_message">パスワードが正しくありません</p>';

    if (password.length != 10) {
        log.innerHTML = illegalPasswordLog;
        return;
    }

    let port = chrome.runtime.connect({name: "password_auth"});
    log.innerHTML = "<p>送信中...</p>";
    port.postMessage({password: password});
    port.onMessage.addListener(response => {
        let success = response.element.success;

        if (success) {
            log.innerHTML = "<p>認証に成功しました</p>"
            open("about:blank", "_self").close();
        } else 
            log.innerHTML = illegalPasswordLog;
    });
}