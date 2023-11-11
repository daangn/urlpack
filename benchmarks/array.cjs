const { Benchmark } = require('benchmark');

const n = 10000;

function Person(name, age) {
  this.name = name;
  this.age = age;
}

new Benchmark.Suite()
.add('init by constructor', () => {
  const arr = new Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = new Person(i.toString(), i);
  }
})
.add('init by apply', () => {
  const arr = Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = new Person(i.toString(), i);
  }
})
.add('init by literal + push', () => {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(new Person(i.toString(), i));
  }
})
.add('init by literal + assign', () => {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr[i] = new Person(i.toString(), i);
  }
})
.on('cycle', event => {
  console.log(event.target.toString());
})
.run();
