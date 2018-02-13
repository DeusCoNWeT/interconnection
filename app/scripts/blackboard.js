// Constructor
var Blackboard = function(){
    this.my_property = "hola";
}


Blackboard.prototype._isEmpty = function(){

    if(this === null){
        return true;
    }
    if(this.length === 0){
        return true;
    }
    if(this.length > 0){
        return false;
    }
};
//Check if the new component has his oew propertt
Blackboard.prototype._hasProperty = function(){
    for(var key in this){
        if (hasOwnProperty.call(this, key) && key.charAt(0) !== "_" && key.charAt(0) !== "$") {
            return false;
          }
    }
    return true;
};
Blackboard.prototype._nuevafuncion = function(){

};
Blackboard.prototype._nuevafuncion = function(){

};
Blackboard.prototype._nuevafuncion = function(){

};
