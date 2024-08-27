const Handlebars = require('handlebars');

// Helper to create a range of numbers
Handlebars.registerHelper('range', function(start, end) {
    let range = [];
    for (let i = start; i <= end; i++) {
        range.push(i);
    }
    return range;
});

// Helper to add two numbers
Handlebars.registerHelper('add', function(a, b) {
    return a + b;
});

// Helper to subtract one number from another
Handlebars.registerHelper('subtract', function(a, b) {
    return a - b;
});

// Helper to check if a is greater than b
Handlebars.registerHelper('gt', function(a, b) {
    return a > b;
});

// Helper to check if a is less than b
Handlebars.registerHelper('lt', function(a, b) {
    return a < b;
});

// Helper to check if a equals b
Handlebars.registerHelper('eq', function(a, b) {
    return a === b;
});
