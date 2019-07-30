import "../sass/main.scss";
import * as app from './models/AppModel';
import * as appView from './views/appView.js';

const appStates = {
    IDLE: 'idle',
    RUNNING: 'running',
    FINISHED: 'finished'
}

const testLengths = {
    SEC60: 60,
    SEC180: 180,
    SEC300: 300
}

const wordsets = {
    RANDOM: 'random',
    LEFTHAND: 'leftHand'
}

let settings = {
    testLength: testLengths.SEC60,
    wordset: wordsets.RANDOM
}

let currentTime = settings.testLength;
let timeElapsed = 0;

let currentAppState = appStates.IDLE;

$(document).ready(function () {
    app.init(170, settings.wordset);
    appView.addWords(app.words);

    setInterval(() => {
        if (currentAppState === appStates.RUNNING) {
            if (currentTime > 0) {
                currentTime--;
                timeElapsed++;
                appView.updateTime(currentTime);
            }

            if (currentTime <= 0) {
                currentAppState = appStates.FINISHED;
                let results = app.finishTest(settings.testLength, timeElapsed);
                appView.finishTest(results.wpm, results.cpm, results.accuracy);
            }
        }
    }, 1000);

    $('.restartBtn').on('click', function () {
        restartTest(settings.testLength, settings.wordset);
    });

    $('.menu_btn--length').click((e) => {
        appView.selectOption('length', e.currentTarget);

        switch ($(e.currentTarget).data().length) {
            case 60:
                settings.testLength = testLengths.SEC60;
            break;
            case 180:
                settings.testLength = testLengths.SEC180;
            break;
            case 300:
                settings.testLength = testLengths.SEC300;
            break;
        }

        restartTest(settings.testLength, settings.wordset)
    });
    
    $('.menu_btn--wordset').click((e) => {
        appView.selectOption('wordset', e.currentTarget);

        switch ($(e.currentTarget).data().wordset) {
            case 'random':
                settings.wordset = wordsets.RANDOM;
            break;
            case 'leftHand':
                settings.wordset = wordsets.LEFTHAND;
            break;
            case 'rightHand':
                settings.wordset = wordsets.RIGHTHAND;
            break;
        }

        restartTest(settings.testLength, settings.wordset);
    }); 

    $(document).on('keydown', function (e) {
        if (currentAppState === appStates.RUNNING) {
            if (e.which === 8) {
                app.backspace();
    
                if (appView.currentWrongSpanReference !== null) {
                    appView.displayBackspace(false);
                } else if (app.currentGoodTypedText.length >= 0) {
                    appView.displayBackspace(true);
                }
    
                const lastSpan = $('.test-prompter_container--left span:last');

                if ($(lastSpan).text().length <= 0 && $(lastSpan).hasClass('text_wrong') && !$(lastSpan).hasClass('text_finished')) {
                    appView.removeLastWrongSpan();
                }

                if (app.currentWrongTypedText.length <= 0) {
                    appView.highlightNextButton(app.wordToType[0], true);
                    appView.highlightNextFinger(app.wordToType[0]);
                }
            }

            appView.keyboardButtonDown(e.which, 'down');
            appView.fingerDown(e.which, 'down');
        }
    });

    $(document).on('keyup', function(e) {
        appView.keyboardButtonDown(e.which, 'up');
        appView.fingerDown(e.which, 'up');
    });

    $(document).on('keypress', function(e) {
        if (currentAppState !== appStates.FINISHED) {
            currentAppState = appStates.RUNNING;

            if (e.which === 32) {                               
                if (app.currentTotalTypedText.length > 0) {
                    if (app.currentWrongTypedText.length <= 0 && app.wordToType.length <= 0) {
                        appView.completeWord('good');
                        app.completeWord('good');
                    } else {
                        appView.completeWord('wrong');
                        app.completeWord('wrong');
                    }
    
                    appView.updateWPM(app.countWPM(settings.testLength, timeElapsed));
                    appView.updateAccuracy(app.countAccuracy());
        
                    appView.highlightNextButton(app.wordToType[0], true);
                    appView.highlightNextFinger(app.wordToType[0]);
    
                    return;
                }                    
            }
    
            if (app.checkIfCorrectChar(String.fromCharCode(e.which))) {        //WPISANY DOBRY ZNAK
                if ($('.text_good').length <= 0 || appView.currentGoodSpanReference === null) {
                    appView.addSpan('good');
                }
    
                appView.displayChar(String.fromCharCode(e.which), true);
                appView.highlightNextButton(app.wordToType[0], true);
                appView.highlightNextFinger(app.wordToType[0]);
    
            } else {                                                               //WPISANY ZLY ZNAK
                if ($('.text_wrong').length <= 0 || appView.currentWrongSpanReference === null) {                         
                    appView.addSpan('wrong');
                }
    
                appView.displayChar(String.fromCharCode(e.which), false);
                appView.highlightNextButton(app.wordToType[0], false);
                appView.highlightNextFinger('backspace');
            }
        }
    });
});

function restartTest(length, wordset) {
    settings.testLength = length;
    settings.wordset = wordset;

    app.init(100, settings.wordset);
    app.restartTest();
    appView.restartTest(settings.testLength);
    appView.addWords(app.words);
    currentTime = settings.testLength;
    timeElapsed = 0;
    currentAppState = appStates.IDLE;
}
