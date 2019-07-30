import {currentGoodTypedText} from '../models/AppModel';
import {wordToType} from '../models/AppModel';
import {currentWrongTypedText} from '../models/AppModel'; 
import {currentTotalTypedText} from '../models/AppModel'; 

export let currentGoodSpanReference = null;
export let currentWrongSpanReference = null;

export const addWords = function(wordsArr) {
    for (let i = 0; i < wordsArr.length; i++) {
        let html = `<span class="word">${wordsArr[i]}</span>`

        $('.test-prompter_container--right').append(html);
    }

    highlightNextButton(wordToType[0], true);
    highlightNextFinger(wordToType[0]);
}

export const addSpan = function(correctness) {
    const html = `<span class="text_${correctness}"></span>`;
    $('.test-prompter_container--left').append(html);

    switch (correctness) {
        case 'good':
            currentGoodSpanReference = $('.text_good').last();
        break;
        case 'wrong': 
            currentWrongSpanReference = $('.text_wrong').last();
        break;
        default: 
        break;
    }
}

export const displayChar = function(char, correctness) {
    if (char !== ' ') {
        if (correctness === true) {
            $(currentGoodSpanReference).last().text(currentGoodTypedText);
            $('.word').first().text(wordToType);
        } else {    
            $(currentWrongSpanReference).last().text(currentWrongTypedText);        
        }
    } else {                                                    //spacja
        return;
    }
}

export const completeWord = function(correctness) {
    if (correctness === 'good') {
        $('.word').first().remove();
        $(currentGoodSpanReference).addClass('text_finished');
        currentGoodSpanReference = null;
        currentWrongSpanReference = null;

    } else if (correctness === 'wrong') {
        if (currentGoodSpanReference !== null && currentWrongSpanReference === null) {      //good JEST wrong NULL 
            $(currentGoodSpanReference).removeClass('text_good').addClass('text_wrong');
            $(currentGoodSpanReference).text(currentTotalTypedText);
            $(currentGoodSpanReference).addClass('text_finished');
        } else if (currentGoodSpanReference === null && currentWrongSpanReference !== null) { //good NULL wrong JEST
            $(currentWrongSpanReference).addClass('text_finished');
        } else if (currentGoodSpanReference !== null && currentWrongSpanReference !== null) { //good JEST wrong JEST
            $(currentGoodSpanReference).removeClass('text_good').addClass('text_wrong');
            $(currentGoodSpanReference).text(currentTotalTypedText);
            $(currentGoodSpanReference).addClass('text_finished');

            removeLastWrongSpan();
        }

        $('.word').first().remove();
        currentGoodSpanReference = null;
        currentWrongSpanReference = null;
    }
}

export const displayBackspace = function(correctness) {
    if (correctness) {
        $(currentGoodSpanReference).text(currentGoodTypedText);
        $('.word').first().text(wordToType);
    } else {
        $(currentWrongSpanReference).text(currentWrongTypedText)
    }
}

export const removeLastWrongSpan = function() {
    $('.test-prompter_container--left .text_wrong:last').remove();
    currentWrongSpanReference = null;
}

export const setFocus = function() {
    $('.screen_container--outer').css('width', '95%');

    $('.keyboard_container').css('transform', 'translate(-50%, -50%) rotateX(15deg)');
    $('.keyboard_container').css('border-bottom', 'solid #000 15px');
}

export const highlightNextButton = function(button, correctness) {
    $('.keyboard_btn_container-inner--active').removeClass('keyboard_btn_container-inner--active');

    if (button === undefined) {     //space
        $(`.keyboard_btn_container-inner--space`).addClass('keyboard_btn_container-inner--active');
    } else if (button === '-') {    //minus
        $(`.keyboard_btn_container-inner--minus`).addClass('keyboard_btn_container-inner--active');
    } else {                        //reszta
        if (correctness) {
            if (button === button.toUpperCase()) {  //shift
                $(`.keyboard_btn_container-inner--shiftLeft`).addClass('keyboard_btn_container-inner--active');
                $(`.keyboard_btn_container-inner--shiftRight`).addClass('keyboard_btn_container-inner--active');
            }
            $(`.keyboard_btn_container-inner--${button.toLowerCase()}`).addClass('keyboard_btn_container-inner--active');
        } else {                    //backspace
            $(`.keyboard_btn_container-inner--backspace`).addClass('keyboard_btn_container-inner--active');
        }
    }
}

export const highlightNextFinger = function(char) {
    $('.hand_finger--active').removeClass('hand_finger--active');

    if (char !== undefined) {
        char = char.toLowerCase();
    }

    switch (char) {
        case 'q':
        case 'a': 
        case 'z':
            $(`.hand_finger--1`).addClass('hand_finger--active');
        break;
        
        case 'w':
        case 's':
        case 'x':
            $(`.hand_finger--2`).addClass('hand_finger--active');
        break;

        case 'e':
        case 'd':
        case 'c':
            $(`.hand_finger--3`).addClass('hand_finger--active');
        break;

        case 'r':
        case 'f':
        case 'v':
        case 't':
        case 'g':
        case 'b':
            $(`.hand_finger--4`).addClass('hand_finger--active');
        break;

        case undefined:     //spacja
            $(`.hand_finger--5`).addClass('hand_finger--active');
            $(`.hand_finger--6`).addClass('hand_finger--active');
        break;

        case 'y':
        case 'h':
        case 'n':
        case 'u':
        case 'j':
        case 'm':
            $(`.hand_finger--7`).addClass('hand_finger--active');
        break;

        case 'i':
        case 'k':
        case ',':
            $(`.hand_finger--8`).addClass('hand_finger--active');
        break;

        case 'o':
        case 'l':
        case '.':
            $(`.hand_finger--9`).addClass('hand_finger--active');
        break;

        case 'p':            
        case ';':           
        case '/':           
            $(`.hand_finger--10`).addClass('hand_finger--active');
        break;

        case 'backspace':
        case '-':
            $(`.hand_finger--10`).addClass('hand_finger--active');
        break;
    }
}

export const keyboardButtonDown = function(charCode, direction) {
    let translateValue = 0;
    let borderValue = '';

    if (direction === 'down') {
        translateValue = 4;
        borderValue = 'none';
    } else {
        translateValue = 0;
        borderValue = '4px #555 solid';
    }

    $(`.charCode--${charCode}`).css('transform', `translate(0, ${translateValue}px)`); 
    $(`.charCode--${charCode}`).css('border-bottom', borderValue); 
}

export const fingerDown = function(charCode, direction) {
    let translateValue = 0;

    if (direction === 'down') {
        translateValue = 10;
    } else {
        translateValue = 0;
    }

    switch (String.fromCharCode(charCode).toLocaleLowerCase()) {
        case 'q':
        case 'a': 
        case 'z':
            $(`.hand_finger--1`).css('transform', `translateY(${translateValue}px)`);
        break;
        
        case 'w':
        case 's':
        case 'x':
            $(`.hand_finger--2`).css('transform', `translateY(${translateValue}px)`);
        break;

        case 'e':
        case 'd':
        case 'c':
            $(`.hand_finger--3`).css('transform', `translateY(${translateValue}px)`);
        break;

        case 'r':
        case 'f':
        case 'v':
        case 't':
        case 'g':
        case 'b':
            $(`.hand_finger--4`).css('transform', `translateY(${translateValue}px)`);
        break;

        case undefined:     //spacja
            $(`.hand_finger--5`).css('transform', `translateY(${translateValue}px)`);
            $(`.hand_finger--6`).css('transform', `translateY(${translateValue}px)`);
        break;

        case 'y':
        case 'h':
        case 'n':
        case 'u':
        case 'j':
        case 'm':
            $(`.hand_finger--7`).css('transform', `translateY(${translateValue}px)`);
        break;

        case 'i':
        case 'k':
        case ',':
            $(`.hand_finger--8`).css('transform', `translateY(${translateValue}px)`);
        break;

        case 'o':
        case 'l':
        case '.':
            $(`.hand_finger--9`).css('transform', `translateY(${translateValue}px)`);
        break;

        case 'p':            
        case ';':           
        case '/':           
            $(`.hand_finger--10`).css('transform', `translateY(${translateValue}px)`);
        break;

        case 'backspace':
        case '-':
            $(`.hand_finger--10`).css('transform', `translateY(${translateValue}px)`);
        break;
    }
}

export const updateTime = function(currentTime) {
    $('.screen_info--time').text(`Time: ${currentTime}s`);
}

export const updateWPM = function(currentWPM) {
    $('.screen_info--wpm').text(`WPM: ${currentWPM}`);
}

export const updateAccuracy = function(currentAccuracy) {
    $('.screen_info--accuracy').text(`Accuracy: ${currentAccuracy}%`);
}

export const finishTest = function(wpm, cpm, accuracy) {
    updateWPM(wpm);
    updateAccuracy(accuracy);

    $('.results_container').css('display', 'flex');
    $('.results_number--wpm').text(wpm);
    $('.results_number--cpm').text(cpm);
    $('.results_number--accuracy').text(accuracy);

    $('.start').css('background-color', '#bfbfbf');
    $('.hand_finger').css('background-color', '#bfbfbf');
    $('.hand_palm').css('background-color', '#bfbfbf');
}

export const restartTest = (baseTime) => {
    $('.results_container').css('display', 'none');
    $('.start').css('background-color', '#fff');
    $('.hand_finger').css('background-color', '#fff');
    $('.hand_palm').css('background-color', '#fff');

    $('.word').remove();
    $('.text_finished').remove();
    $('.text_good').remove();
    $('.text_wrong').remove();

    updateTime(baseTime)
    updateWPM(0);
    updateAccuracy(100);
}

export const selectOption = (type, newObject) => {
    $(`.menu_btn--${type}`).removeClass('menu_btn-selected');
    $(newObject).addClass('menu_btn-selected');
}