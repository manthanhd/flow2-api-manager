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

GenericEntityProperty.getMongooseType = function(localType){
    if(localType == GenericEntityProperty.TYPE_STRING){
        return String;
    } else if(localType == GenericEntityProperty.TYPE_NUMBER) {
        return Number;
    } else if(localType == GenericEntityProperty.TYPE_DATE) {
        return Date;
    }
}
module.exports = GenericEntityProperty;