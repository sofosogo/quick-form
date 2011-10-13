(function(){

var Form = window.Form = {

    create: function( node ){
        node = parseNode( node );
        var inputs = {};
        scan( node, inputs, [] );
        node.fill = function( data ){
            fill( inputs, data );
            return node;
        };
        node.fetch = function(){
            return fetch( inputs );
        };
        node.clean = function(){
            clean( inputs );
            return node;
        };
        return node;
    }
};

function parseNode( node ){
    if( typeof node === "string" ){
        var body = document.createElement("body");
        body.innerHTML = node;
        return body.firstChild;
    }
    return node;
}

function scan( node, inputs, prefix ){
    if( node.nodeType !== 1 ) return; 
    var bind = node.getAttribute("bind");
    bind && ( prefix = prefix.concat(bind) );
        
    var tagName = node.tagName.toLowerCase();
    if( tagName === "input" || tagName === "textarea" || tagName === "select" ){
        prefix = prefix.concat( node.getAttribute("name") );
        var key = prefix.join(".");
        if( node.type === "radio" || node.type === "checkbox" ){
            if( !inputs[key] ){
                inputs[key] = [node];
            }else{ 
                inputs[key].push( node );
            }
        // ignore these input node listing in below.
        }else if( node.type !== "image" && node.type !== "file" 
            && node.type !== "button" && node.type !== "reset" && node.type !== "submit"){
            inputs[key] = node;
        }
        return;
    }
    var children = node.childNodes;
    for( var i = 0; i < children.length; i++ ){
        scan( children[i], inputs, prefix );
    }
}

function fill( inputs, data ){
    var node, type, val;
    for( var k in inputs ){
        node = inputs[k];
        type = isArray(node) ? node[0].type : node.type;
        val = evaluate( data, k );
        if( type === "radio" ){
            val = isArray( val ) ? val[0] : val;
            for( var i = 0; i < node.length; i++ ){
                node[i].checked = false;
                if( node[i].value === "" + val ){
                    node[i].checked = true;
                }
            }
        }else if( type === "checkbox" ){
            val = isArray( val ) ? val : [val];
            for( var i = 0; i < node.length; i++ ){
                node[i].checked = false;
                for( var j = 0; val && j < val.length; j++ ){
                    if( node[i].value === val[j] ) node[i].checked = true;
                }
            }
        }else if( type === "select-multiple" ){
            val = isArray( val ) ? val : [val];
            var options = node.childNodes;
            for( var i = 0; i < options.length; i++ ){
                if( options[i].nodeType !== 1 ) continue;
                options[i].setAttribute("selected", "");
                options[i].selected = false;
                for( var j = 0; val && j < val.length; j++ ){
                    if( options[i].nodeType === 1 && options[i].value === val[j] ) {
                        options[i].setAttribute("selected", "true");
                        options[i].selected = true;
                    }
                }
            }
        }else{
            node.value = val || "";
        }
    }
}

function fetch( inputs ){
    var data = {};
    var node, type;
    for( var k in inputs ){
        node = inputs[k];
        type = isArray(node) ? node[0].type : node.type;
        if( type === "radio" ){
            for( var i = 0; i < node.length; i++ ){
                if( node[i].checked ){
                    set( data, k, node[i].value );
                }
            }
        }else if( type === "checkbox" ){
            var arr = [];
            for( var i = 0; i < node.length; i++ ){
                if( node[i].checked ) arr.push( node[i].value );
            }
            if( i > 1 ) set( data, k, arr );
            else if( arr[0] ) set( data, k, arr[0] ); // only one checkbox
        }else if( type === "select-multiple" ){
            var arr = [];
            var options = node.childNodes;
            for( var i = 0; i < options.length; i++ ){
                if( options[i].nodeType === 1 && options[i].selected ) 
                    arr.push( options[i].value );
            }
            set( data, k, arr );
        }else{
            set( data, k, node.value );
        }
    }
    return data;
}

function clean( inputs ){
    var node, type;
    for( var k in inputs ){
        node = inputs[k];
        type = isArray(node) ? node[0].type : node.type;
        if( type === "radio" || type === "checkbox" ){
            for( var i = 0; i < node.length; i++ ) node[i].checked = false;
        }else if( type === "select-multiple" ){
            var options = node.childNodes;
            for( var i = 0; i < options.length; i++ ) 
                if( options[i].nodeType === 1 ){
                    options[i].setAttribute("selected", "");
                    options[i].selected = false;
                }
        }else{
            node.value = "";
        }
    }
}

function set( data, field, val ){
    if( !data || !field ) return null;
    var fs = field.split(".");
    var temp = data,
        len = fs.length;
    for( var i = 0; i < len - 1; i++ ){
        if( !fs[i] ) continue;
        temp[ fs[i] ] = temp[ fs[i] ] || {};
        temp = temp[ fs[i] ];
    }
    temp[ fs[len-1] ] = val;
    return data;
}

function isArray( obj ){
    return obj && Object.prototype.toString.call(obj) === "[object Array]";
}

function evaluate( ctx, exp ){
    if( !ctx || !exp ) return null;
    var fs = exp.split("."),
        data = ctx, i;
    for( i = 0; data && i < fs.length; i++ ){
        if( fs[i] ) data = data[ fs[i] ];
    }
    return data;
}

})();