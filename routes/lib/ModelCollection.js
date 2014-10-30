function ModelCollection() {
    this.models = [];
    this.add = function(name, model) {
        this.models.push({name: name, model: model});
    };
    
    this.get = function(name) {
        for(var i = 0; i < this.models; i++){
            if(this.models[i].name == name){
                return this.models[i];
            }
        }
        return undefined;
    };
}
module.exports = new ModelCollection();