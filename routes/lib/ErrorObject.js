function ErrorObject(){
    this.error = undefined;
    this.errorCode = undefined;
    this.errorDetail = [];
}
ErrorObject.create = function(error, code){
    var errorObject = new ErrorObject();
    errorObject.error = error;
    errorObject.errorCode = code;
    return errorObject;
}

module.exports = ErrorObject;