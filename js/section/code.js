import filesaver from "js/lib/filesaver-min";
import embedCodeHTML from "html/embedCode.html!text";

export default function(el) {
    // load html
    var embedCode;
    embedCode = document.querySelector("#embedCode");
    embedCode.innerHTML = embedCodeHTML;
    
    // svg download btn
    var svgBtn, embedBtn;
    svgBtn = embedCode.querySelector("#svgBtn");
    embedBtn = embedCode.querySelector("#embedBtn");
    
    svgBtn.addEventListener("click", e => {
        
        // generate svg content for download
        // TODO: svgContent, svg with x,y,viewbox
        var svg = el.querySelector("#editChart svg");
        //svg.setAttribute("width", "100%"); 
        download(svg, "image/svg+xml", "svg");
    });

    embedBtn.addEventListener("click", e => {
        el.querySelector("#editChart svg").setAttribute("width", "100%");
        
        var node = el.querySelector(".panel-chart").cloneNode(true);
        download(node, "text/html", "html");
    });

}

function download(content, type, format) {
    var XMLS = new XMLSerializer(),
        text = XMLS.serializeToString(content); 
        
    // TODO: add fallback
    //try {} catch (e) {};    
    var blobEmbed = new Blob([text], {type: type});
    
    saveAs(blobEmbed, "chart." + format);
    //document.querySelector(".js-code").textContent = embed;
    //console.log(code);
}
