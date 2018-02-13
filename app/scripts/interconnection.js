(function(window){
    var library_name = "interconecction";

    // constructor
    var Library = {};

    Library.getAttribute = function(element_name, name_attribute) {
        
        var element_tag = document.querySelector(element_name);

        if (!element_tag) throw new Error(`El elemento '${element_name}' no existe`);
        if (!element_tag.properties) throw new Error("No se trata de un elemento polymer");

        return element_tag.properties[name_attribute];
    }
    
    window[library_name] = Library;
})(window);

