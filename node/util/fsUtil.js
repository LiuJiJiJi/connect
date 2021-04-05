const readline = require('readline');
 
function readSyncByRl(tips) {
    tips = tips || '> ';
 
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
 
        rl.question(tips, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}
 
// readSyncByRl('Please input anything：').then((res) => {
//     console.log(res);
// });

module.exports = {
    readSyncByRl,
}