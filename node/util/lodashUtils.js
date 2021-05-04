const  _ = require('lodash');


function arrayTest() {
    const chunkResult = _.chunk(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 2);
    console.log('chunkResult', chunkResult);
    const compactResult = _.compact([0, 1, false, null, 2, '', 3]);
    console.log('compactResult', compactResult);

}




function main () {
    arrayTest();

}


main();