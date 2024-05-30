// 枚举合集
export default {
  // ---------------- AnswerApplyStatus枚举  开始 -------------------
  AnswerApplyStatus: {
    // 枚举列表
    list: [
      { label: "待审核", value: "WAIT" },
      { label: "通过", value: "PASS" },
      { label: "未通过", value: "UN_PASS" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "WAIT":
          return "待审核";
        case "PASS":
          return "通过";
        case "UN_PASS":
          return "未通过";
        default:
          return val;
      }
    },
  },
  // ---------------- AnswerApplyStatus枚举  结束 -------------------

  // ---------------- AnswerType枚举  开始 -------------------
  AnswerType: {
    // 枚举列表
    list: [
      { label: "文字", value: "WORD" },
      { label: "图片", value: "PICTURE" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "WORD":
          return "文字";
        case "PICTURE":
          return "图片";
        default:
          return val;
      }
    },
  },
  // ---------------- AnswerType枚举  结束 -------------------

  // ---------------- BoxDramaApplyStatus枚举  开始 -------------------
  BoxDramaApplyStatus: {
    // 枚举列表
    list: [
      { label: "未开始", value: "UN_START" },
      { label: "授权中", value: "START" },
      { label: "已结束", value: "END" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "UN_START":
          return "未开始";
        case "START":
          return "授权中";
        case "END":
          return "已结束";
        default:
          return val;
      }
    },
  },
  // ---------------- BoxDramaApplyStatus枚举  结束 -------------------

  // ---------------- BoxStoreApplyStatus枚举  开始 -------------------
  BoxStoreApplyStatus: {
    // 枚举列表
    list: [
      { label: "待付款", value: "WAIT_PAY" },
      { label: "待授权", value: "WAIT_AUTHORIZE" },
      { label: "未授权", value: "REJECT_AUTHORIZE" },
      { label: "已授权", value: "PASS_AUTHORIZE" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "WAIT_PAY":
          return "待付款";
        case "WAIT_AUTHORIZE":
          return "待授权";
        case "REJECT_AUTHORIZE":
          return "未授权";
        case "PASS_AUTHORIZE":
          return "已授权";
        default:
          return val;
      }
    },
  },
  // ---------------- BoxStoreApplyStatus枚举  结束 -------------------

  // ---------------- DramaAgeAppropriate枚举  开始 -------------------
  DramaAgeAppropriate: {
    // 枚举列表
    list: [
      { label: "8+", value: "EXCEED_8" },
      { label: "12+", value: "EXCEED_12" },
      { label: "16+", value: "EXCEED_16" },
      { label: "18+", value: "EXCEED_18" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "EXCEED_8":
          return "8+";
        case "EXCEED_12":
          return "12+";
        case "EXCEED_16":
          return "16+";
        case "EXCEED_18":
          return "18+";
        default:
          return val;
      }
    },
  },
  // ---------------- DramaAgeAppropriate枚举  结束 -------------------

  // ---------------- OrderStatus枚举  开始 -------------------
  OrderStatus: {
    // 枚举列表
    list: [
      { label: "待支付", value: "NOT_PAY" },
      { label: "已支付", value: "PAYED" },
      { label: "已完成", value: "USED" },
      { label: "已退款", value: "REVERSE" },
      { label: "已关闭", value: "CLOSE" },
      { label: "已结算", value: "SETTLEMENT" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "NOT_PAY":
          return "待支付";
        case "PAYED":
          return "已支付";
        case "USED":
          return "已完成";
        case "REVERSE":
          return "已退款";
        case "CLOSE":
          return "已关闭";
        case "SETTLEMENT":
          return "已结算";
        default:
          return "";
      }
    },
  },
  // ---------------- OrderStatus枚举  结束 -------------------

  // ---------------- ProductType枚举  开始 -------------------
  ProductType: {
    // 枚举列表
    list: [
      { label: "全部商品", value: null },
      { label: "组局商品", value: "GATHERING_PRODUCT" },
      { label: "申领剧本商品", value: "APPLY_DRAMA_PRODUCT" },
      { label: "票房商品", value: "BOX_OFFICE_PRODUCT" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "BOX_OFFICE_PRODUCT":
          return "票房商品";
        case "APPLY_DRAMA_PRODUCT":
          return "申领剧本商品";
        case "GATHERING_PRODUCT":
          return "组局商品";
        default:
          return "全部商品";
      }
    },
  },
  // ---------------- ProductType枚举  结束 -------------------

  // ---------------- CustomProductType枚举  开始 -------------------
  CustomProductType: {
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "BOX_OFFICE_PRODUCT":
          return "票房本";
        case "GROUP_BUY_PRODUCT":
          return "团购商品";
        case "APPLY_DRAMA_PRODUCT":
          return "申领剧本";
        case "VIRTUAL_ITEM_PRODUCT":
          return "道具商品";
        case "BLIND_BOX_PRODUCT":
          return "盲盒商品";
        default:
          return "";
      }
    },
  },
  // ---------------- CustomProductType枚举  结束 -------------------

  PayType: {
    // 枚举列表
    list: [
      { label: "余额支付", value: "BALANCE" },
      { label: "微信小程序", value: "WECHAT_WXA" },
      { label: "支付宝支付", value: "ALIPAY_APP" },
      { label: "优惠券支付", value: "COUPON" },
      { label: "微信APP支付", value: "WECHAT_APP" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "BALANCE":
          return "余额支付";
        case "WECHAT_WXA":
          return "微信小程序";
        case "ALIPAY_APP":
          return "支付宝支付";
        case "COUPON":
          return "优惠券支付";
        case "WECHAT_APP":
          return "微信APP支付";
        default:
          return "";
      }
    },
  },

  // ---------------- SellType枚举  开始 -------------------
  SellType: {
    // 枚举列表
    list: [
      { label: "盒装", value: "BOXED" },
      { label: "城限", value: "LIMITED" },
      { label: "独家", value: "EXCLUSIVE" },
      { label: "实景", value: "REAL_SCENE" },
      { label: "待定", value: "UNDETERMINED" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "BOXED":
          return "盒装";
        case "LIMITED":
          return "城限";
        case "EXCLUSIVE":
          return "独家";
        case "REAL_SCENE":
          return "实景";
        case "UNDETERMINED":
          return "待定";
        default:
          return val;
      }
    },
  },
  // ---------------- SellType枚举  结束 -------------------

  // ---------------- Sex枚举  开始 -------------------
  Sex: {
    // 枚举列表
    list: [
      { label: "男", value: "MALE" },
      { label: "女", value: "FEMALE" },
      { label: "未知", value: "UNKNOWN" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "MALE":
          return "男";
        case "FEMALE":
          return "女";
        case "UNKNOWN":
          return "未知";
        default:
          return val;
      }
    },
  },
  // ---------------- Sex枚举  结束 -------------------

  // ---------------- StoreApplyStatus枚举  开始 -------------------
  StoreApplyStatus: {
    // 枚举列表
    list: [
      { label: "待审核", value: "WAIT_AUDIT" },
      { label: "已通过", value: "PASS" },
      { label: "未通过", value: "REJECT" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "WAIT_AUDIT":
          return "待审核";
        case "PASS":
          return "已通过";
        case "REJECT":
          return "未通过";
        default:
          return val;
      }
    },
  },
  // ---------------- StoreApplyStatus枚举  结束 ------------------
  CustomOrderStatus: {
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "NOT_PAY":
          return "等待买家付款";
        case "PAYED":
          return "买家已付款";
        case "USED":
          return "已完成";
        case "REVERSE":
          return "已退款";
        case "CLOSE":
          return "已取消";
        case "SETTLEMENT":
          return "已结算";
        default:
          return val;
      }
    },
  },
  // ---------------- ShippingFee枚举  开始 -------------------
  LogisticsStatus: {
    // 枚举列表
    list: [
      { label: "待揽收", value: "AWAITING_COLLECTION" },
      { label: "已揽收", value: "COLLECTED" },
      { label: "已签收", value: "DELIVERED" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "AWAITING_COLLECTION":
          return "待揽收";
        case "COLLECTED":
          return "已揽收";
        case "DELIVERED":
          return "已签收";
        default:
          return val;
      }
    },
  },
  // ---------------- ShippingFee枚举  结束 -------------------
  // ---------------- StoreApplyStatus枚举  开始 -------------------
  CouponUseStatus: {
    // 枚举列表
    list: [
      { label: "已过期", value: "EXPIRED" },
      { label: "已锁定", value: "LOCKED" },
      { label: "未使用", value: "NOT_USED" },
      { label: "已使用", value: "USED" },
      { label: "已撤回", value: "WITHDRAW_BACK" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "EXPIRED":
          return "已过期";
        case "LOCKED":
          return "已锁定";
        case "NOT_USED":
          return "未使用";
        case "USED":
          return "已使用";
        case "WITHDRAW_BACK":
          return "已撤回";
        default:
          return val;
      }
    },
  },
  // ---------------- StoreApplyStatus枚举  结束 ------------------
  // ---------------- VoteType枚举  开始 -------------------
  VoteType: {
    // 枚举列表
    list: [
      { label: "单选", value: "SINGLE" },
      { label: "多选", value: "MULTIPLE" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "SINGLE":
          return "单选";
        case "MULTIPLE":
          return "多选";
        default:
          return val;
      }
    },
  },
  // ---------------- VoteType枚举  结束 ------------------
  // ---------------- QuestionType枚举  开始 -------------------
  QuestionType: {
    // 枚举列表
    list: [
      { label: "单选", value: "ONCE" },
      { label: "多选", value: "MULTIPLE" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "ONCE":
          return "单选";
        case "MULTIPLE":
          return "多选";
        default:
          return val;
      }
    },
  },
  // ---------------- QuestionType枚举  结束 ------------------

  // ---------------- PlayType枚举  开始 -------------------
  PlayType: {
    // 枚举列表
    list: [
      { label: "单次", value: "ONCE" },
      { label: "循环", value: "LOOP" },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "ONCE":
          return "单次";
        case "LOOP":
          return "循环";
        default:
          return val;
      }
    },
  },
  // ---------------- PlayType枚举  结束 ------------------
  // ---------------- StoreEmployeeType枚举  开始 -------------------
  StoreEmployeeType: {
    // 枚举列表
    list: [
      { label: "店主", value: "OWNER" },
      { label: "店长", value: "SHOP_DIRECTOR" },
      { label: "店员", value: "EMPLOYEE" },
      { label: "主持人", value: "DM" },
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "OWNER":
          return "店主";
        case "SHOP_DIRECTOR":
          return "店长";
        case "EMPLOYEE":
          return "店员";
        case "DM":
          return "主持人";
        default:
          return val;
      }
    },
  },
  // ---------------- PlayType枚举  结束 ------------------
  // ---------------- OrganizerType枚举  开始 -------------------
  OrganizerType: {
    // 枚举列表
    list: [],
    // 根据枚举值获取名称
    getName: function (val) {
      let name;
      this.list.map(v => {
        if (v.value === val) {
          name = v.label;
        }
      })
      return name;
    },
  },
  // ---------------- OrganizerType枚举  结束 ------------------
  // ---------------- StoreEmployeeType枚举  结束 ------------------
  // ---------------- GatherStatusType枚举  开始 -------------------
  GatherStatusType: {
    // 枚举列表
    list: [
      { label: "创建中", value: "CREATING" },
      { label: "拼场中", value: "GATHERING" },
      { label: "拼场成功", value: "SUCCESS" },
      { label: "拼场失败", value: "FAIL" },
      { label: "拼场解散", value: "DISMISS" },
      { label: "拼场完成", value: "COMPLETED" }
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "CREATING":
          return "创建中";
        case "GATHERING":
          return "拼场中";
        case "SUCCESS":
          return "拼场成功";
        case "FAIL":
          return "拼场失败";
        case "DISMISS":
          return "拼场解散";
        case "COMPLETED":
          return "拼场完成";
        default:
          return val;
      }
    },
  },
  // ---------------- GatherStatusType枚举  结束 ------------------
  // ---------------- GatherLockStatus枚举  开始 -------------------
  GatherLockStatus: {
    // 枚举列表
    list: [
      { label: "未锁车", value: "UNLOCKED" },
      { label: "已锁车", value: "LOCKED" },
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "UNLOCKED":
          return "未锁车";
        case "LOCKED":
          return "已锁车";
        default:
          return val;
      }
    },
  },
  // ---------------- GatherLockStatus枚举  结束 ------------------

  // ---------------- JumpType枚举  开始 -------------------
  NavigatorType: {
    // 枚举列表
    // type类型：1.保留当前页面，跳转到应用内的某个页面 2.Webview数据组装 3.跳转到 tabBar 页面
    list: [
      { type: 2, jumpType: "CONSULATION_DETAIL", dynamicType: 2, value: "/minih5/#/activityPage" },
      { type: 1, jumpType: "STORE_DETAIL", dynamicType: null, value: `/store-package/pages/index?storeId={id}`, },
      { type: 1, jumpType: "DRAMA_DETAIL", dynamicType: null, value: `/pageDetail/pages/pageDetail?id={id}`},
      { type: 1, jumpType: "DRAMA_LIST", dynamicType: null, value: `/city-gathering/pages/index`},
      { type: 1, jumpType: "DRAMA_EVALUATE_DETAIL", dynamicType: 3, value: `/pageDetail/pages/scriptReview?dramaId={dramaId}&evaluateId={id}`},
      { type: 1, jumpType: "GATHER_LIST", dynamicType: null, value: "/city-gathering/pages/index" },
      { type: 1, jumpType: "GATHER_DETAIL", dynamicType: null, value: `/gatherPlayer/pages/index?id={id}` },
      { type: 1, jumpType: "MY_GATHER_LIST", dynamicType: null, value: "/gatherPlayer/pages/myGather" },
      { type: 1, jumpType: "USER_CIRCLE_EVALUATE_DETAIL", dynamicType: 1, value: `/dynamicDetail/pages/index?id={id}` },
      { type: 1, jumpType: "USER_CIRCLE_PUBLISH", dynamicType: null, value: `/dynamicDetail/pages/postupdates?id={id}`},
      { type: 3, jumpType: "USER_PERSONAL", dynamicType: null, value: `/pages/my/index`},
      { type: 1, jumpType: "USER_DETAIL", dynamicType: null, value: `/my-package/pages/trends/index?userId={id}`},
      { type: 1, jumpType: "DISCOVER_LIST", dynamicType: null, value: `/discover/pages/index` },
      { type: 1, jumpType: "RANK_LIST", dynamicType: null, value: `/rankingList/pages/index?id={id}` },
      { type: 1, jumpType: "USER_CHOOSE_CITY", dynamicType: null, value: `/gatherPlayer/goChoodeCity/index?type={id}` },
      { type: 1, jumpType: "LOVE_POTION", dynamicType: null, value: `/lovepotion/pages/index` },
    ],
    // 根据活动类型获取页面
    getPageByJumpType: function (val) {
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].jumpType === val) {
          return this.list[i];
        }
      }
      return null;
    },
    getPageByDynamicType: function (val) {
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].dynamicType === val) {
          return this.list[i];
        }
      }
      return null;
    }
  },
  // ---------------- JumpType枚举  结束 ------------------

  // ---------------- EXCEED_Type枚举  开始 -------------------
  EXCEED_Type: {
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "EXCEED_8":
          return "适龄8+";
        case "EXCEED_12":
          return "适龄12+";
        case "EXCEED_16":
          return "适龄16+";
        case "EXCEED_18":
          return "适龄18+";
        default:
          return val;
      }
    },
  },
  // ---------------- EXCEED_Type枚举  结束 ------------------
  // ---------------- Label枚举  开始 -------------------
  Label: {
    // 枚举列表
    list: [
      { label: "A", value: 0 },
      { label: "B", value: 1 },
      { label: "C", value: 2 },
      { label: "D", value: 3 },
      { label: "E", value: 4 },
      { label: "F", value: 5 },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: "全部", value: null }].concat(this.list);
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 0:
          return "A";
        case 1:
          return "B";
        case 2:
          return "C";
        case 3:
          return "D";
        case 4:
          return "E";
        case 5:
          return "F";
        case 6:
          return "G";
        case 7:
          return "H";
        case 8:
          return "I";
        case 9:
          return "J";
        case 10:
          return "K";
        default:
          return val;
      }
    },
  },
  // ---------------- Label枚举  结束 ------------------

  //LP 男女
  LP_SEX: {
    // 枚举列表
    list: [
      { text: "男", value: 'MALE' },
      { text: "女", value: 'FEMALE' }
    ],
    getValue(name){
      return this.list[this.list.findIndex(v=>v.text === name)].value;
    },
    getName(value){
      return this.list[this.list.findIndex(v=>v.value === value)].text;
    }
  },

  //LP学历
  LP_EDUCATION:{
    list: [
      { text: "高中及以下", value: 0},
      { text: "大专", value: 1 },
      { text: "本科", value: 2 },
      { text: "硕士", value: 3 },
      { text: "博士及以上", value: 4 }
    ]
  },

  //政治面貌
  LP_POLITICS:{
    list: [
      { text: "群众", value: 0 },
      { text: "共产党员", value: 1 }
    ]
  },

  //LP报名活动状态
  LP_ACTIVITY_STATUS:{
    list: [
      { text: "", value: 'REGISTRATION_OPEN' },
      { text: "报名已结束", value: 'REGISTRATION_CLOSED' },
      { text: "活动已结束", value: 'EVENT_ENDED' },
      { text: "活动已开始", value: 'EVENT_STARTED' }
    ],
    getName(value){
      return this.list[this.list.findIndex(v=>v.value === value)].text;
    }
  },

  //职业
  LP_OCCUPATION: {
    list: [
      { text: "软件工程师", value: 1 },
      { text: "医生", value: 0 },
      { text: "教育工作者", value: 0 },
      { text: "金融专业人士", value: 0 },
      { text: "律师", value: 0 },
      { text: "艺术家/设计师", value: 0 },
      { text: "商业分析师", value: 0 },
      { text: "建筑师/工程师", value: 0 },
      { text: "酒店餐饮服务行业", value: 0 },
      { text: "销售/市场/公关营销专员", value: 0 },
      { text: "电商从业者", value: 0 },
      { text: "农业专业人士", value: 0 },
      { text: "心理医生/咨询师", value: 0 },
      { text: "媒体/编辑", value: 0 },
      { text: "运动员/体育从业者", value: 0 },
      { text: "电子商务专员", value: 0 },
      { text: "旅游业从业者", value: 0 },
      { text: "社会工作者", value: 0 },
      { text: "政府公务员", value: 0 },
      { text: "制药专业人士", value: 0 },
      { text: "个体工商户", value: 0 },
      { text: "企业主", value: 0 },
      { text: "企业高管", value: 0 },
      { text: "互联网产品/运营", value: 0 },
      { text: "制造业管理人员", value: 0 },
      { text: "制造业从业人员", value: 0 },
      { text: "客服", value: 0 },
      { text: "人力/行政/财务", value: 0 },
      { text: "物流/仓储/司机", value: 0 },
      { text: "咨询/翻译", value: 0 },
      { text: "能源/环保", value: 0 },
      { text: "护士", value: 0 },
      { text: "其他", value: 0 }
    ]
  },

  //热门目的地
  LP_HOT_PLACE: {
    list: [
      { name: "北京", value: 0 },
      { name: "张家界", value: 0 },
      { name: "舟山", value: 0 },
      { name: "九寨沟", value: 0 },
      { name: "上海", value: 0 },
      { name: "杭州", value: 0 },
      { name: "苏州", value: 0 },
      { name: "桂林", value: 0 },
      { name: "成都", value: 0 },
      { name: "三亚", value: 0 },
      { name: "西安", value: 0 },
      { name: "丽江", value: 0 },
      { name: "新疆", value: 0 },
      { name: "青岛", value: 0 },
      { name: "贵阳", value: 0 },
      { name: "云南/贵州", value: 0 },
      { name: "西藏", value: 0 },
      { name: "川渝", value: 0 },
      { name: "大西北", value: 0 },
      { name: "广东/广西", value: 0 },
      { name: "湖南/湖北", value: 0 },
      { name: "天津", value: 0 },
      { name: "海南/福建", value: 0 },
      { name: "江浙沪", value: 0 },
      { name: "山东/山西", value: 0 },
      { name: "港澳台", value: 0 },
      { name: "东北", value: 0 },
      { name: "安徽/江西", value: 0 },
      { name: "河南/河北", value: 0 },
    ]
  },

  //国际热门目的地
  LP_HOT_NATIONAL_PLACE: {
    list: [
      { name: "新加坡", value: 0 },
      { name: "日本", value: 0 },
      { name: "泰国", value: 0 },
      { name: "马尔代夫", value: 0 },
      { name: "香港", value: 0 },
      { name: "马来西亚", value: 0 },
      { name: "巴厘岛", value: 0 },
      { name: "瑞士", value: 0 },
      { name: "普吉岛", value: 0 },
      { name: "法国", value: 0 },
      { name: "埃及", value: 0 },
      { name: "新西兰", value: 0 },
      { name: "斯里兰卡", value: 0 },
      { name: "仙本那", value: 0 },
      { name: "斐济", value: 0 },
      { name: "芽庄", value: 0 },
      { name: "越南", value: 0 },
      { name: "毛里求斯", value: 0 },
      { name: "长滩岛", value: 0 },
      { name: "苏梅岛", value: 0 },
      { name: "菲律宾", value: 0 },
      { name: "东南亚", value: 0 },
      { name: "日本/韩国", value: 0 },
      { name: "中国港澳台", value: 0 },
      { name: "中东", value: 0 },
      { name: "欧洲", value: 0 },
      { name: "大洋洲", value: 0 },
      { name: "美洲", value: 0 },
      { name: "非洲", value: 0 },
      { name: "其他", value: 0 }]
  }
};
