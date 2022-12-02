/*!
 * parser-gml v0.1.7
 * LICENSE : MIT
  AUTHOR  : pengz 
* */
(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
   typeof define === 'function' && define.amd ? define(['exports'], factory) :
   (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.parserGml = {}));
})(this, (function (exports) { 'use strict';

   const parseOption={shape:["geometry","the_geom","geom","shape"]};
   function getPoint(point,type){
       let coor=point.split(type).map(function (co){
           return parseFloat(co)
       });
       return {
           type:"Point",
           coordinates:coor
       }
   }
   function getGeoJsonPoint(data){
       let key = Object.keys(data)[0];
       return key =="pos" ?getPoint(data[key],' '):getPoint(data[key],',')
   }
   function getGeoJsonPolyline(data){
       let key = Object.keys(data)[0];
       let polyline=[];
       if (key =="posList") {
           let listcoor=data[key].split(' ');
           listcoor.forEach(function (co,index){
               if (index%2!=0){
                   polyline.push([Number.parseFloat(listcoor[index-1]),Number.parseFloat( listcoor[index]) ]);
               }
           });
       } else {
            data[key].split(' ').map(function (point) {
               polyline.push(getPoint(point,",").coordinates);
           });
       }
       return  {
           type:"LineString",
           coordinates:polyline
       }
   }
   function getGeoJsonPolygon(data){
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
      // xmlDoc =new DOMParser().parseFromString(xmlDoc, 'text/xml');
       var nodeList = xmlDoc.childNodes;//根节点  root node
       function generate(node_list) {
           let obj={};
           let childNodes=getNodeChildName(node_list);
           for (var i = 0; i < node_list.length; i++) {
               var curr_node = node_list[i];
               if (curr_node.nodeType == 3) { //忽略子节点中的换行和空格   ignore  '\n' and ' ' of  children node
                   continue;
               }
               let value="";  // let value= curr_node.childNodes.length > 1 ? generate(curr_node.childNodes): (curr_node.childNodes[0]!=null?curr_node.childNodes[0].nodeValue.trim():"");
               if (curr_node.childNodes.length>1){
                      value= generate(curr_node.childNodes);
               }
               else if (curr_node.childNodes.length==1){
                      value= curr_node.childNodes[0].nodeValue ?   curr_node.childNodes[0].nodeValue.trim(): generate(curr_node.childNodes);
               }
                    let key=curr_node.nodeName.substring(curr_node.nodeName.indexOf(":")+1);
                   if (childNodes[curr_node.nodeName]>1){
                       if (obj[key]){
                           obj[key].push(value);
                       }else {
                           obj[key]=[value];
                       }
                   }else {
                       obj[key]=value;
                   }
           }
           return obj;
       }
       //find children node name from father node
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
   function getMutiGeometry(data){
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
           case "point":
               return getGeoJsonPoint(data[Object.keys(data)[0]]);
           case  "linestring":
               return  getGeoJsonPolyline(data[Object.keys(data)[0]]);
           case "polygon":
               return  getGeoJsonPolygon(data[Object.keys(data)[0]]);
           default:
               return  getMutiGeometry(data[Object.keys(data)[0]]);
       }
   }
   function parseFeature(feature){
       var obj= {
           "type": "Feature",
           "geometry": {},
           "properties": {}
       };
       let geometry=null;
       for (var pKey in feature) {
           !parseOption.shape.find(function (geo){return  pKey.toLowerCase()==geo})? obj.properties[pKey]=feature[pKey]: geometry=feature[pKey];
       }
       if (geometry) {
           obj.geometry = getGeometry(geometry);
       }else {
           //no shape fields,select fields from data and construct object
           for (var pKey in obj.properties) {
                if (obj.properties[pKey] instanceof  Object || obj.properties[pKey] instanceof Array){
                       obj.geometry=getGeometry({"shape":obj.properties[pKey]});
                       delete  obj.properties[pKey];
                }
           }
       }
       return obj;
   }
   function parseMember(data){
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
       if(option && option.shape ){
           parseOption.shape.push(option.shape.toLowerCase());
       }
       let features=[];
       try {
           if (Object.prototype.toString.call(data)!="[object XMLDocument]"){
               data =new DOMParser().parseFromString(data, 'text/xml');
           }
           let jsonData=convertToJSON(data);
           let featurecollection = jsonData[Object.keys(jsonData)[0]];
           let key = Object.keys(featurecollection).find(function (type ) {
               return type.toLowerCase().includes("member")
           });
           let members = featurecollection[key];
           // if(key.toLowerCase().includes("members")){
           //     if (members instanceof Array) {
           //         members.forEach(function (member) {
           //             features=  features.concat(parseMember(member[Object.keys(member)[0]]))
           //         })
           //     } else if (members instanceof Object) {
           //         features=features.concat(parseMember(members[Object.keys(members)[0]]))
           //     }
           // } else{
           //     if (members instanceof Array) {
           //         members.forEach(function (member) {
           //             features.push(parseFeature(member[Object.keys(member)[0]]))
           //         })
           //     } else if (members instanceof Object) {
           //         let member=members[Object.keys(members)[0]];
           //         features.push(parseFeature( member))
           //     }
           // }
           if (members instanceof Array) {
               members.forEach(function (member) {
                   features=  features.concat(parseMember(member[Object.keys(member)[0]]));
               });
           } else if (members instanceof Object) {
               features=features.concat(parseMember(members[Object.keys(members)[0]]));
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
//# sourceMappingURL=parser-gml.js.map
