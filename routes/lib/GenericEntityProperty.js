function GenericEntityProperty(propName, propValue, propType){
    this.name = propName;
    this.value = propValue;
    this.type = propType;
    this.required = true;
}
GenericEntityProperty.TYPE_STRING = "string";
GenericEntityProperty.TYPE_NUMBER = "number";
GenericEntityProperty.TYPE_DATE = "date";

module.exports = GenericEntityProperty;