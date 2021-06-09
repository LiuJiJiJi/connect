var person = {
    name: 'John'
};
person.salary = '10000$';
person['country'] = 'USA';

const dd = Object.defineProperty(person, 'phoneNo', {
    value: '8888888888',
    enumerable: true
})

console.log(Object.keys(person), person); 
console.log(dd); 
console.log('5' + 4 * '5'); 