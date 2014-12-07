/**
    This depends on Mongoose.
*/

function GenericEntityProperty(propName, propValue, propType){
    this.name = propName;
    this.value = propValue;
    this.type = propType;
    this.required = true;
}
GenericEntityProperty.TYPE_STRING = "string";
GenericEntityProperty.TYPE_NUMBER = "number";
GenericEntityProperty.TYPE_DATE = "date";

var supportedTypes = [GenericEntityProperty.TYPE_STRING, GenericEntityProperty.TYPE_DATE, GenericEntityProperty.TYPE_NUMBER];

GenericEntityProperty.getMongooseType = function(localType){
    if(localType == GenericEntityProperty.TYPE_STRING){
        return String;
    } else if(localType == GenericEntityProperty.TYPE_NUMBER) {
        return Number;
    } else if(localType == GenericEntityProperty.TYPE_DATE) {
        return Date;
    }
}

GenericEntityProperty.isValidType = function(localType){
    for(var i = 0; i < supportedTypes.length; i++){
        if(localType.toLowerCase() == supportedTypes[i].toLowerCase()){
            return true;
        }
    }
    return false;
}
module.exports = GenericEntityProperty;