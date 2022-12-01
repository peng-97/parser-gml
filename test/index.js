const {getGeoJson} =require("../src")
// const {getGeoJson} =require("../dist/index")

let data="<wfs:FeatureCollection xsi:schemaLocation=\"http://www.geostar.com.cn/geoglobe http://127.0.0.1:9010/HSDT/wfs?service=WFS&amp;amp;version=1.0.0&amp;amp;request=DescribeFeatureType http://www.opengis.net/wfs http://127.0.0.1:9010/HSDT/WFS-basic.xsd\" xmlns=\"http://www.geostar.com.cn/geoglobe\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:wfs=\"http://www.opengis.net/wfs\">\n" +
    "    <gml:boundedBy>\n" +
    "        <gml:Box>\n" +
    "            <gml:coordinates>109.751700000355,20.2239175023909 117.024179322818,25.3910891751254</gml:coordinates>\n" +
    "        </gml:Box>\n" +
    "    </gml:boundedBy>\n" +
    "    <gml:featureMember>\n" +
    "        <HSDT gml:fid=\"108\">\n" +
    "            <OID>108</OID>\n" +
    "            <GEOMETRY>\n" +
    "                <gml:Point>\n" +
    "                    <gml:coordinates>116.228779016738,23.4559416858602</gml:coordinates>\n" +
    "                </gml:Point>\n" +
    "            </GEOMETRY>\n" +
    "            <NAME>普宁县农会办公旧址</NAME>\n" +
    "            <SIPNAME>普宁县农会办公旧址</SIPNAME>\n" +
    "            <ADDNAME>广东省揭阳市普宁市洪阳镇后坑村培风塔</ADDNAME>\n" +
    "            <CODE>30130201</CODE>\n" +
    "            <SYMBOL>遗址</SYMBOL>\n" +
    "            <LABEL></LABEL>\n" +
    "            <GRADE></GRADE><备注>\n" +
    "        </备注>\n" +
    "        <TIME>202012</TIME><市>揭阳市\n" +
    "    </市><专题类型>重要红色革命遗址\n" +
    "</专题类型>\n" +
    "<PICTURE></PICTURE>\n" +
    "<URL></URL>\n" +
    "<XZQH>揭阳市</XZQH>\n" +
    "<ADDRESS></ADDRESS>\n" +
    "<X>116.228779017</X>\n" +
    "<Y>23.4559416860001</Y>\n" +
    "<TEXT></TEXT>\n" +
    "</HSDT>\n" +
    "</gml:featureMember>\n" +
    "<gml:featureMember>\n" +
    "    <HSDT gml:fid=\"109\">\n" +
    "        <OID>109</OID>\n" +
    "        <GEOMETRY>\n" +
    "            <gml:Point>\n" +
    "                <gml:coordinates>116.053146252298,23.8558557287589</gml:coordinates>\n" +
    "            </gml:Point>\n" +
    "        </GEOMETRY>\n" +
    "        <NAME>桐梓洋革命旧址群</NAME>\n" +
    "        <SIPNAME>桐梓洋革命旧址群</SIPNAME>\n" +
    "        <ADDNAME>广东省梅州市丰顺县北斗镇桐新村桐新村农家书屋</ADDNAME>\n" +
    "        <CODE>30130201</CODE>\n" +
    "        <SYMBOL>遗址</SYMBOL>\n" +
    "        <LABEL></LABEL>\n" +
    "        <GRADE></GRADE><备注>通过网络查询遗址所在村或镇\n" +
    "    </备注>\n" +
    "    <TIME>202012</TIME><市>梅州市\n" +
    "</市><专题类型>重要红色革命遗址\n" +
    "</专题类型>\n" +
    "<PICTURE></PICTURE>\n" +
    "<URL></URL>\n" +
    "<XZQH>梅州市</XZQH>\n" +
    "<ADDRESS></ADDRESS>\n" +
    "<X>116.053146252</X>\n" +
    "<Y>23.855855729</Y>\n" +
    "<TEXT></TEXT>\n" +
    "</HSDT>\n" +
    "</gml:featureMember>\n" +
    "<gml:featureMember>\n" +
    "    <HSDT gml:fid=\"110\">\n" +
    "        <OID>110</OID>\n" +
    "        <GEOMETRY>\n" +
    "            <gml:Point>\n" +
    "                <gml:coordinates>116.689819444012,23.5633749996566</gml:coordinates>\n" +
    "            </gml:Point>\n" +
    "        </GEOMETRY>\n" +
    "        <NAME>潮澄饶革命“一老家”</NAME>\n" +
    "        <SIPNAME>潮澄饶革命“一老家”</SIPNAME>\n" +
    "        <ADDNAME>广东省潮州市潮安区江东镇</ADDNAME>\n" +
    "        <CODE>30130201</CODE>\n" +
    "        <SYMBOL>遗址</SYMBOL>\n" +
    "        <LABEL></LABEL>\n" +
    "        <GRADE></GRADE><备注>通过网络查询遗址所在村或镇\n" +
    "    </备注>\n" +
    "    <TIME>202012</TIME><市>潮州市\n" +
    "</市><专题类型>重要红色革命遗址\n" +
    "</专题类型>\n" +
    "<PICTURE></PICTURE>\n" +
    "<URL></URL>\n" +
    "<XZQH>潮州市</XZQH>\n" +
    "<ADDRESS></ADDRESS>\n" +
    "<X>116.689819444</X>\n" +
    "<Y>23.5633750000001</Y>\n" +
    "<TEXT></TEXT>\n" +
    "</HSDT>\n" +
    "</gml:featureMember>\n" +
    "<gml:featureMember>\n" +
    "    <HSDT gml:fid=\"111\">\n" +
    "        <OID>111</OID>\n" +
    "        <GEOMETRY>\n" +
    "            <gml:Point>\n" +
    "                <gml:coordinates>116.324011281396,23.6920710637286</gml:coordinates>\n" +
    "            </gml:Point>\n" +
    "        </GEOMETRY>\n" +
    "        <NAME>潮揭丰边人民行政委员会旧址</NAME>\n" +
    "        <SIPNAME>潮揭丰边人民行政委员会旧址</SIPNAME>\n" +
    "        <ADDNAME>广东省揭阳市揭东区新亨镇五房村五房山革命英雄纪念碑</ADDNAME>\n" +
    "        <CODE>30130201</CODE>\n" +
    "        <SYMBOL>遗址</SYMBOL>\n" +
    "        <LABEL></LABEL>\n" +
    "        <GRADE></GRADE><备注>通过网络查询遗址所在村或镇\n" +
    "    </备注>\n" +
    "    <TIME>202012</TIME><市>揭阳市\n" +
    "</市><专题类型>重要红色革命遗址\n" +
    "</专题类型>\n" +
    "<PICTURE></PICTURE>\n" +
    "<URL></URL>\n" +
    "<XZQH>揭阳市</XZQH>\n" +
    "<ADDRESS></ADDRESS>\n" +
    "<X>116.324011281</X>\n" +
    "<Y>23.6920710640001</Y>\n" +
    "<TEXT></TEXT>\n" +
    "</HSDT>\n" +
    "</gml:featureMember>" +
    "</wfs:FeatureCollection>"

let result=getGeoJson(data)
console.log(result)
