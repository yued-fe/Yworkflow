/**
 * Created by renjiale on 2016/1/4.
 */
LBF.define('/qd/js/component/url.js', function() {
    var URL = {
        getParamVal: function(paramName) {
            var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)", "i");
            var reg2 = new RegExp("[A-Za-z]");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                var final = r[2];
                if (reg2.test(final)) {
                    return r[2]
                } else {
                    return parseInt(r[2]);
                }
            }
            return null;
        },
        isValid: function(str) {
            var strRegex = "^(http(s)?(:\/\/))?(www\.)?[a-zA-Z0-9-_\.]+";
            var re = new RegExp(strRegex);

            return re.test(str);
        },
        setParam: function(url, param, paramVal) {
            var TheAnchor = null;
            var newAdditionalURL = "";
            var tempArray = url.split("?");
            var baseURL = tempArray[0];
            var additionalURL = tempArray[1];
            var temp = "";

            if (additionalURL) {
                var tmpAnchor = additionalURL.split("#");
                var TheParams = tmpAnchor[0];
                TheAnchor = tmpAnchor[1];
                if (TheAnchor)
                    additionalURL = TheParams;

                tempArray = additionalURL.split("&");

                for (i = 0; i < tempArray.length; i++) {
                    if (tempArray[i].split('=')[0] != param) {
                        newAdditionalURL += temp + tempArray[i];
                        temp = "&";
                    }
                }
            } else {
                var tmpAnchor = baseURL.split("#");
                var TheParams = tmpAnchor[0];
                TheAnchor = tmpAnchor[1];

                if (TheParams)
                    baseURL = TheParams;
            }

            if (TheAnchor)
                paramVal += "#" + TheAnchor;

            var rows_txt = temp + "" + param + "=" + paramVal;
            return baseURL + "?" + newAdditionalURL + rows_txt;
        }
    };
    return {
        getParamVal: URL.getParamVal,
        validURL: URL.isValid,
        setParam: URL.setParam
    };

});
