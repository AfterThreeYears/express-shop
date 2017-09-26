module.exports = (app) => {
    app.use('/users', require('./routes/users'));
    app.use('/goods', require('./routes/goods')); 
    app.use('/api', require('./routes/index'));    
}