function CheckIsOver(currentHour, limitHour){
    const isOver = currentHour > limitHour ? true : false;
    return isOver;
}

module.exports = CheckIsOver;

