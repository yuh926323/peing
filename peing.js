class PeingReply {
    constructor() {
        let result = this.getPageInfo(),
            language,
            uuid,
            csrf_token,
            answerArea;

        if (! result) {
            return;
        }
        // the same php list() function
        [, language, uuid] = result;

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
        });
    }

    getElementValue(query = '') {
        let ele = document.querySelector(query);
        return ele ? ele.value : null;
    }

    getPageInfo(url = '') {
        let pattern = /https:\/\/peing\.net\/(ja|en|zh-cn|zh-tw)\/q\/([a-z0-9-]{36})/gi;
        return pattern.exec(url ? url : location.href);
    }

    generateAnswerArea(params) {
        return `<div class="answer-form-area">
        <div class="c-twitter-linked-form">
        <form class="js-question-form" action="/${params['language']}/q/${params['uuid']}/answer}" accept-charset="UTF-8" method="post">
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

// let peingReply = new PeingReply();

class PeingViewer {
    constructor() {
        let questions = document.querySelectorAll('.question-box.js-question-update, .question-box-link');
        if (! questions.length) {
            return;
        }

        let reply = document.createElement('style');
        reply.type = 'text/css';
        reply.innerHTML = `.reply-area {
            width: 90%;
            min-height: 30px;
            background-color: #eee;
            border-radius: 10px;
            margin-left: auto;
            margin-top: 10px;
            padding: 10px;
        }
        .reply-title {
            color: #999;
                font-size: 12px;
                }
        .reply-title i{
            font-size: 10px;
            padding-right: 4px;
            color: #bbb;
        }
        .reply-content {
            margin-top: 5px;
            font-size: 14px;
            line-height: 22px;
            color: #2248a9;
        }

        .reply-area textarea {
            height: 100px;
            margin-top: 10px;
        }
        .reply-area .submit-button {
            padding-top: 10px;
            padding-bottom: 5px;
        }
        .reply-area .c-twitter-linked-form {
            padding: 0 10px;
        }
        `;
        document.head.appendChild(reply);

        questions.forEach((ele) => {
            let request = new Request(this.getQuestionLink(ele));
            fetch(request).then((results) => {
                results.text().then((str) => {
                    let responseDoc = new DOMParser().parseFromString(str, 'text/html'),
                        answer = responseDoc.querySelector('.answer'),
                        replyArea;
                    if (answer) {
                        replyArea = `<div class="reply-area">
                            <div class="reply-title"><i class="fa fa-reply"></i>箱主回覆</div>
                            <div class="reply-content">${answer.innerText}</div>
                        </div>`;
                    } else {
                        let csrf_token = document.head.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                            aLink = ele.querySelector('a'),
                            result = peingReply.getPageInfo(aLink.href),
                            language,
                            uuid;
                        [, language, uuid] = result;

                        let params = {
                            'csrf_token' : csrf_token,
                            'language' : language,
                            'uuid' : uuid,
                        };
                        replyArea = `<div class="reply-area">
                            <div class="reply-title"><i class="fa fa-reply"></i>這則問題還沒有被回答，在這邊直接回應</div>
                            ${peingReply.generateAnswerArea(params)}
                        </div>`;
                    }
                    this.appendToReplyArea(ele, replyArea);
                });
            });
        });

    }

    getQuestionLink(ele) {
        return ele.className === 'question-box-link' ? ele.href : ele.children[2].href;
    }

    appendToReplyArea(ele, replyArea) {
        if (ele.className === 'question-box-link') {
            ele.children[0].innerHTML += replyArea;
        } else {
            ele.innerHTML += replyArea;
        }
    }
}

new PeingViewer();
