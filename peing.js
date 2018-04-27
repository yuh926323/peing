class Peing {
    constructor() {
        let result = this.getPageInfo(),
            language,
            uuid,
            version,
            csrf_token,
            answerArea;

        if (! result) {
            return;
        }
        // the same php list() function
        [, language, uuid, version] = result;

        csrf_token = this.getElementValue('input[name="authenticity_token"]');
        if (! csrf_token) {
            return;
        }

        answerArea = document.querySelector('.answer-form-area');
        if (! answerArea) {
            return;
        }

        answerArea.innerHTML = this.generateAnswerArea({
            'csrf_token' : csrf_token,
            'language' : language,
            'uuid' : uuid,
            'version' : version,
        });
    }

    getElementValue(query = '') {
        let ele = document.querySelector(query);
        return ele ? ele.value : null;
    }

    getPageInfo() {
        let pattern = /https:\/\/peing\.net\/(ja|en|zh-cn|zh-tw)\/q\/([a-z0-9-]{36})\?v=([0-9])+/gi;
        return pattern.exec(location.href);
    }

    generateAnswerArea(params) {
        return `<div class="answer-form-area">
        <div class="c-twitter-linked-form">
        <form class="js-question-form" action="/${params['language']}/q/${params['uuid']}/answer?v=${params['version']}" accept-charset="UTF-8" method="post">
            <input name="utf8" type="hidden" value="✓">
            <input type="hidden" name="authenticity_token" value="${params['csrf_token']}">
            <textarea id="answer_body" style="" name="answer[body]"></textarea>
            <div class="submit-button">
                <button name="type" type="submit" class="ui button basic" data-disable-with="傳送中..." data-gtag-action="click" data-gtag-category="回答" data-gtag-label="回答する(リンク)" value="link" style="">回答</button>
            </div>
        </form>
        </div>
    </div>`;
    }
}

new Peing();
