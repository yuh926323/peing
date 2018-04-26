let csrf_token = document.querySelector('input[name="authenticity_token"]').value,
    uuid = location.href.substr('https://peing.net/zh-TW/q/'.length, location.href.length - 'https://peing.net/zh-TW/q/'.length - 4),
    areaDOM = `<div class="answer-form-area">
    <div class="c-twitter-linked-form">
    <form class="js-question-form" action="/zh-TW/q/${uuid}/answer?v=1" accept-charset="UTF-8" method="post">
        <input name="utf8" type="hidden" value="✓">
        <input type="hidden" name="authenticity_token" value="${csrf_token}">
        <textarea id="answer_body" style="" name="answer[body]"></textarea>
        <div class="submit-button">
            <button name="type" type="submit" class="ui button basic" data-disable-with="傳送中..." data-gtag-action="click" data-gtag-category="回答" data-gtag-label="回答する(リンク)" value="link" style="">回答</button>
        </div>
    </form>
    </div>
</div>`,
    answerArea = document.querySelector('.answer-form-area');
if (answerArea && csrf_token && uuid) {
    answerArea.innerHTML = areaDOM;
}