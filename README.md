


#  parser-gml

## Intro



> 将地理空间数据gml格式转为geojson

## Installation

> npm install parser-gml
>

> yarn add  parser-gml


## Api

* **getGeoJson(data,options?)**

```javascript
   /*
   *   data:data,//gml数据,string,必须，否则解析结果为null
   *    option:{
             shape:"shape",空间数据字段,默认包含geometry,geom,the_geom,shape,空间字段是其不包含以上在这配置,忽略大小写       
             gml:"gml"  gml名    默认gml,gml是其他类型在这配置，忽略大小写
        } //配置参数，可选
   * */
    
```

## Usage

```javascript
 import {getGeoJson} from 'parser-gml';
   
let result=getGeoJson(data)
```
  

## Html use CDN   
```javascript

<script src='https://unpkg.com/parser-gml/dist/parser-gml.js' ></script>
<script>
    var result=parserGml.getGeoJson(data)
</script>

```

