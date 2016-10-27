symbolTable = require('./symbolTable.js');
assignment = require('./assignment.js');

simpleDeclare = module.exports.simpleDeclare = function(declarator){
    if(symbolTable.lookUp(declarator.value)){
        symbolTable.free();
        throw new Error('Multiple definition of ' + declarator.value);
    }
    
    symbolTable.insert(declarator.value);
}

complexDeclare = module.exports.complexDeclare = function(declarator, initializer){
    
    simpleDeclare(declarator);
    symbolTable.setObject(declarator.value, initializer);
}

// TODO: Convert inside object to declarator type
declareType = module.exports.declareType = function(declarator, type){
    var normType = parserUtils.typeEnum[type.toUpperCase()];
    
    // Declarator has no object assigned
    var objectAssigned = symbolTable.getObject(declarator.value);
    
    if(objectAssigned === undefined){
        symbolTable.setType(declarator.value, normType);
        
        return;
    }
    
    // Check if type can be assigned
    if(!assignment.isAssignable(normType, objectAssigned.type)){
        symbolTable.free();
        throw new TypeError('Type ' + parserUtils.getReversedTypeEnum(objectAssigned.type) + 
                           ' can not be assigned to type ' + normType);
    }
        
    symbolTable.setType(declarator.value, normType);
}