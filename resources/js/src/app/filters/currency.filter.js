const accounting = require("accounting");

Vue.filter("currency", function(price)
{
    const currencyPattern = App.currencyPattern;

    // (%v = value, %s = symbol)
    const options = {
        symbol   : App.activeCurrency,
        decimal  : currencyPattern.separator_decimal,
        thousand : currencyPattern.separator_thousands,
        precision: 2,
        format   : currencyPattern.pattern.replace("¤", "%s").replace("#,##0.00", "%v")
    };

    return accounting.formatMoney(price, options);
});
