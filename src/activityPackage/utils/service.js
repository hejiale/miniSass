import Axios from "axios";
export default {
    /**
    * 
    * 展会主办方查询
    */
    exhibitionOrganizerMap(data) {
        return Axios.post("/exhibition/exhibitionOrganizerMap", data);
    },
    /**
    * 
    * 展会轮播图列表
    */
    exhibitionRotationChartList(data) {
        return Axios.post("/exhibition/exhibitionRotationChartList", data);
    },
    /**
    * 
    * 展会剧本分页列表（B端）
    */
    exhibitionDramaPage(data) {
        return Axios.post("/exhibition/exhibitionDramaPage", data);
    },
    /**
    * 
    * 展会剧本详情（B端）
    */
    exhibitionDramaDetail(data) {
        return Axios.post("/exhibition/exhibitionDramaDetail", data);
    },
    /**
    * 
    * 展会剧本字典查询
    */
    queryExhibitionDict(data) {
        return Axios.post("/dict/queryExhibitionDict", data);
    },
    /**
    * 
    * 展会剧本字典查询
    */
    exhibitionTypeList(data) {
        return Axios.post("/exhibition/exhibitionTypeList", data);
    }
}