module.exports = function(func) {

    var intvalKey = null;

    var intvalObject = {
        until: function(stop) {
            stop(function() {
                if (intvalKey !== null) {
                    clearInterval(intvalKey);
                }
            });
            return intvalObject;
        },

        andWhen: function(subscribable) {
            subscribable.subscribe(func);
            return intvalObject;
        },

        regularily: function(time) {
            intvalKey = setInterval(func, time);
            return intvalObject;
        },

        immediately: function() {
            func();
            return intvalObject;
        }
    };


    return intvalObject;
};