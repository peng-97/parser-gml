/*!
 * parser-gml v0.10.1
 * LICENSE : MIT
  AUTHOR  : pengz 
* */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["parser-gml"] = {}));
})(this, (function (exports) { 'use strict';

    const  parseOption={
          gml:"gml",
          shape:["geometry","the_geom","geom","shape"]
    };
    function  getPoint(point,type){
        let coor=point.split(type).map(function (co){
            return parseFloat(co)
        });
        return {
            type:"Point",
            coordinates:coor
        }
    }
    //点
    function  getGeoJsonPoint(data){
        let key = Object.keys(data)[0];
        return key ==parseOption.gml+"pos" ?getPoint(data[key],' '):getPoint(data[key],',')
    }
    ///线
    function getGeoJsonPolyline(data){
        let key = Object.keys(data)[0];
        let polyline=[];
        if (key ==parseOption.gml+"posList") {
            let listcoor=data[key].split(' ');
            listcoor.forEach(function (co,index){
                if (index%2!=0){
                    polyline.push([Number.parseFloat(listcoor[index-1]),Number.parseFloat( listcoor[index]) ]);
                }
            });
        } else {
            return data[key].split(' ').map(function (point) {
                polyline =getPoint(point);
            });
        }
        return  {
            type:"LineString",
            coordinates:polyline
        }
    }
    //面
    function  getGeoJsonPolygon(data){
        let key=Object.keys(data)[0];
        let polygon=[];
        if (data[key] instanceof  Array) {
            data[key].forEach(function (lineArea) {
                polygon.push(getGeoJsonPolyline(lineArea[Object.keys(lineArea)[0]]).coordinates);
            });
        }else {
            polygon.push(getGeoJsonPolyline(data[key][Object.keys(data[key])[0]]).coordinates);
        }
        return {
            type:"Polygon",
            coordinates:polygon
        };
    }
    function convertToJSON(xmlDoc) {
        var nodeList = xmlDoc.childNodes;//根节点
        function generate(node_list) {
            let obj={};
            let childNodes=getNodeChildName(node_list);
            for (var i = 0; i < node_list.length; i++) {
                var curr_node = node_list[i];
                //忽略子节点中的换行和空格
                if (curr_node.nodeType == 3) {
                    continue;
                }
                let value= curr_node.childNodes.length > 1 ? generate(curr_node.childNodes): (curr_node.childNodes[0]!=null?curr_node.childNodes[0].nodeValue.trim():"");
                    if (childNodes[curr_node.nodeName]>1){
                        if (obj[curr_node.nodeName]){
                            obj[curr_node.nodeName].push(value);
                        }else {
                            obj[curr_node.nodeName]=[value];
                        }
                    }else {
                        obj[curr_node.nodeName]=value;
                    }
            }
            return obj;
        }
        //将父节点所有子节点名字
        function getNodeChildName( node_list){
            let obj={};
            for (var i = 0; i < node_list.length; i++) {
                var curr_node = node_list[i];
                if (curr_node.nodeType == 3) {
                    continue;
                }
                let name=node_list[i].nodeName;
                obj[name]= obj.hasOwnProperty(name)?  obj[name]+1:1;
            }
           return obj;
        }
        return generate(nodeList)
    }
    //复杂图形
    function  getMutiGeometry(data){
        let key=Object.keys(data)[0];
        if (data[key] instanceof Array){
            let listGeometry= data[key].map(function (po){
                return getGeometry(po)
            });
            return {
                type:"Muti"+listGeometry[0].type,
                coordinates: listGeometry.map(function (geo){
                    return geo.coordinates;
                })
            }
        }else if (data[key] instanceof  Object){
            let geometry= getGeometry(data[key]);
            return {
                type:"Muti"+geometry.type,
                coordinates:[geometry.coordinates]
            }
        }else;
    }
    function getGeometry(data){
        let key=Object.keys(data)[0];
        switch (key.toLowerCase()){
            case parseOption.gml+"point":
            case "point":
                return getGeoJsonPoint(data[Object.keys(data)[0]]);
            case  parseOption.gml+"linestring":
            case "linestring":
                return  getGeoJsonPolyline(data[Object.keys(data)[0]]);
            case parseOption.gml+"polygon":
            case "polygon":
                return  getGeoJsonPolygon(data[Object.keys(data)[0]]);
            default:
                return  getMutiGeometry(data[Object.keys(data)[0]]);
        }
    }
    function  parseFeature(feature){
        var obj= {
            "type": "Feature",
            "geometry": {},
            "properties": {}
        };
        let geometry=null;
        for (var pKey in feature) {
            !parseOption.shape.find(function (geo){return  (pKey.toLowerCase()==geo || pKey.toLowerCase()==parseOption.gml+geo)})? obj.properties[pKey]=feature[pKey]: geometry=feature[pKey];
        }
        if (geometry) {
            obj.geometry = getGeometry(geometry);
        }
        return obj;
    }

    function  parseMember(data){
          let features=[];
          if (data instanceof  Array){
                data.forEach(function (feature){
                       features.push(parseFeature(feature));
                });
          }else if (data instanceof  Object){
               features.push(parseFeature(data));
          }
          return features;
    }

     function getGeoJson(data,option){
        if (!data){ return  null }
        parseOption.gml=((option && option.gml) ? option.gml :parseOption.gml).toLowerCase()+":";
        if(option && option.shape ){
            parseOption.shape.push(option.shape.toLowerCase());
        }
        let features=[];
        try {
            let xml =new DOMParser().parseFromString(data, 'text/xml');
            let jsonData= convertToJSON(xml);
            let featurecollection = jsonData[Object.keys(jsonData)[0]];
            let key = Object.keys(featurecollection).find(function (type ) {
                return type.toLowerCase().includes("featuremember")
            });
            let members = featurecollection[key];
           if(key.toLowerCase().includes("featuremembers")){
               if (members instanceof Array) {
                   members.forEach(function (member) {
                       features=  features.concat(parseMember(member[Object.keys(member)[0]]));
                   });
               } else if (members instanceof Object) {
                   features=features.concat(parseMember(members[Object.keys(members)[0]]));
               }
           } else {
               if (members instanceof Array) {
                   members.forEach(function (member) {
                       features.push(parseFeature(member[Object.keys(member)[0]]));
                   });
               } else if (members instanceof Object) {
                   let member=members[Object.keys(members)[0]];
                   features.push(parseFeature( member[Object.keys(member)[0]]));
               }
           }
            return {
                type: "FeatureCollection",
                features,
            }
        }catch (er){
            console.log(er);
            return  null
        }
    }
    var getGeoJson_1=getGeoJson;

    var src = {
    	getGeoJson: getGeoJson_1
    };

    exports.default = src;
    exports.getGeoJson = getGeoJson_1;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.js.map
