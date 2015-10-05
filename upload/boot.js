(function() {
    'use strict';
    //console.log("hi, boot.js!");
    define([], function() {

        return {
            boot: function(el, context, config, mediator) {
                
                // Load default html
                var defaultHtml = '<div style="font-size: 24px; padding: 72px 0; ' + 
                    'font-family: \'Guardian Egyptian Web\',Georgia,serif;' +  
                    'text-align: center;">Loading…</div>';

                el.innerHTML = defaultHtml;
                
                // Load chart html
                var chartHtml = 'chart.html',
                    chartPath = 'https://visuals.guim.co.uk/testing/2015/09/kind-of-raw/' + chartHtml;
                
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange= function() {
                    if (this.readyState!==4) return;
                    if (this.status!==200) return; // or whatever error handling you want
                    
                    el.innerHTML= this.responseText;
                };
                xhr.open('GET', chartPath, true);
                xhr.send();
            }
        };

    });
}());
