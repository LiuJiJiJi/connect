const _ = require('lodash')

/**
 * 将用于创建随机密码字母的所有函数名称的对象
 */
const randomFunc = {
    lower: getRondomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

// 生成函数
// 所有的函数负责返回一个随机值，我们将使用它来创建密码。
function getRondomLower() {
    //fromCharCode() 可接受一个指定的 Unicode 值，然后返回一个字符串。
    // 注意：该方法是 String 的静态方法，字符串中的每个字符都由单独的 Unicode 数字编码指定。使用语法： String.fromCharCode()。
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
    // const symbols = '~!@#$%^&*()_+{}":?><;.,';
    const symbols = '_+><;.,[]|()-=';
    return symbols[Math.floor(Math.random() * symbols.length)];
}


/**
 * Genrate password
 * @param {*} length 
 * @param {*} lower 
 * @param {*} upper 
 * @param {*} number 
 * @param {*} symbol 
 * @returns 
 */
function generatePassword(length, lower, upper, number, symbol) {
    let generatedPassword = "";
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{
        lower
    }, {
        upper
    }, {
        number
    }, {
        symbol
    }].filter(item => Object.values(item)[0]);
    if (typesCount === 0) {
        return "";
    }
    for (let i = 0; i < length; i++) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }
    return generatedPassword.slice(0, length);
}

/**
 * Generate name
 */
function generateCNName() {
    const familyNames = new Array(
        "赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈",
        "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
        "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏",
        "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
        "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦",
        "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳",
        "酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺",
        "倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
        "乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余",
        "元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹"
    );
    const givenNames = new Array(
        "子璇", "淼", "国栋", "夫子", "瑞堂", "甜", "敏", "尚", "国贤", "贺祥", "晨涛",
        "昊轩", "易轩", "益辰", "益帆", "益冉", "瑾春", "瑾昆", "春齐", "杨", "文昊",
        "东东", "雄霖", "浩晨", "熙涵", "溶溶", "冰枫", "欣欣", "宜豪", "欣慧", "建政",
        "美欣", "淑慧", "文轩", "文杰", "欣源", "忠林", "榕润", "欣汝", "慧嘉", "新建",
        "建林", "亦菲", "林", "冰洁", "佳欣", "涵涵", "禹辰", "淳美", "泽惠", "伟洋",
        "涵越", "润丽", "翔", "淑华", "晶莹", "凌晶", "苒溪", "雨涵", "嘉怡", "佳毅",
        "子辰", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡",
        "佳怡", "佳惠", "晨茜", "晨璐", "运昊", "汝鑫", "淑君", "晶滢", "润莎", "榕汕",
        "佳钰", "佳玉", "晓庆", "一鸣", "语晨", "添池", "添昊", "雨泽", "雅晗", "雅涵",
        "清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌"
    );

    const familyName = _.sample(familyNames);
    const givenName = _.sample(givenNames);
    return familyName + givenName;
}

/**
 * @param {*} country 
 *     cn: china
 *     sg: singapore
 * @returns phoneNumber
 */
function generatePhoneNumber(country) {
    const cn_prefixArray = new Array("130", "131", "132", "133", "135", "137", "138", "170", "187", "189");

    switch (country) {
        case 'sg':
            return '65' + _.sample('89') + _.sampleSize('0123456789', 7).join('');
        default :
            return '86' + _.sample(cn_prefixArray) + _.sampleSize('0123456789', 8).join('');
    }
}

module.exports = {
    generatePassword,
    generateCNName,
    generatePhoneNumber,
}

function main() {
    console.log('[Generate password]:', generatePassword(16, true, true, true, false));
    console.log('[Generate username]:', generateCNName());
    console.log('[Generate phone number] china :', generatePhoneNumber());
    console.log('[Generate phone number] singapore :', generatePhoneNumber('sg'));
}

// run
// main();