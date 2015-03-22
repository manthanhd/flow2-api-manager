function GenericEntity(givenName) {
    this.name = givenName;
    this.properties = [];

    this.addProperty = function (genProp) {
        this.properties.push(genProp);
    }
}

module.exports = GenericEntity;