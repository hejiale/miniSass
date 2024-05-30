import { base64url_encode } from "./base64";

export default {
  formatNum(val) {
    if (val >= 1000) {
      return `${Math.ceil(val / 1000)}k`;
    }
    return val;
  },
  //  手机号脱敏
  judgePhone(val) {
    if (!val) return "";
    let reg = /(\d{3})\d*(\d{4})/;
    return val.replace(reg, "$1****$2");
  },
  //阿里云图片压缩
  processImage(url, size) {
    if (!url)
      return "https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20231228/1f649708-c1a0-4ef1-a563-975a0f56231f/icon-placeholder.png";
    return `${url}?x-oss-process=image/resize,w_${size}/interlace,1`;
  },
  waterMarkImg(url, juId, storeNumber) {
    let base64 = base64url_encode(storeNumber + "-" + juId);
    return (
      url +
      `?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,size_30,text_${base64},color_ffffff,shadow_100,t_100,g_nw,x_4,y_4,fill_1,rotate_330,color_cccccc,t_50,padx_40,pady_40`
    );
  },
  filterBlur(url) {
    return (url || 'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20231228/1f649708-c1a0-4ef1-a563-975a0f56231f/icon-placeholder.png') + `?x-oss-process=image/blur,r_50,s_50`;
  },
  //  银行卡号脱敏
  hideBankCard(value) {
    if (value && value.length > 8) {
      return `${value.substring(0, 4)} ${"*".repeat(value.length - 8).replace(/(.{4})/g, `$1 `)}${value.length % 4 ? " " : ""}${value.slice(-4)}`;
    }
    return value;
  },
  processLogo(url) {
    return url || 'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20231228/1f649708-c1a0-4ef1-a563-975a0f56231f/icon-placeholder.png';
  },
  truncateText(text, length) {
    if (typeof text !== 'string') {
      return '';
    }
    if (typeof length !== "number" || length < 0) {
      throw Error("length must be a positive number");
    }
    if (text.length > length) {
      return text.substring(0, length) + "...";
    } else {
      return text;
    }
  },
  formatGameTime(startTime, endTime) {
    var startDate = new Date(startTime.replace(/-/g, '/'));
    var endDate = new Date(endTime.replace(/-/g, '/'));
    var startHours = startDate.getHours();
    var startMinutes = ("0" + startDate.getMinutes()).slice(-2);
    var endHours = endDate.getHours();
    var endMinutes = ("0" + endDate.getMinutes()).slice(-2);
    return `${startHours}:${startMinutes}-${endHours}:${endMinutes}`;
  },
  convertMetersToKilometers(meters) {
    if (!uni.getStorageSync('isLocation') || !meters && meters !== 0) return ''; // 如果传入的值是 undefined 或 null，则返回空字符串
    const kilometers = meters / 1000; // 将米转换为千米
    return kilometers.toFixed(1); // 保留一位小数并返回结果
  },
  formatGameStartTime(gameStartTime) {
    // 将日期字符串中的 '-' 替换为 '/'
    const compatibleGameStartTime = gameStartTime.replace(/-/g, '/');
    const time = new Date(compatibleGameStartTime);

    let hours = time.getHours();
    let minutes = time.getMinutes();

    // 补零
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutes}`;
  },
  calculateTimeToEvent(gameStartTime) {
    const now = new Date();
    const startTime = new Date(gameStartTime);
    const timeDiff = startTime.getTime() - now.getTime();
    const isPast = timeDiff < 0;
    const absoluteDiff = Math.abs(timeDiff);

    // 计算天数、小时数和分钟数
    const days = Math.floor(absoluteDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absoluteDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((absoluteDiff / (1000 * 60)) % 60);

    let message = '';

    if (isPast) {
      // 当前时间超过了开始时间
      if (minutes <= 5) {
        message = '已开场，请确保已在店内';
      } else {
        const totalHoursPast = Math.floor(absoluteDiff / (1000 * 60 * 60));
        const hoursToShow = totalHoursPast > 0 ? totalHoursPast : 1;
        message = `已经开场<span style="color:#36E467;">${hoursToShow}小时</span>`;
      }
    } else {
      // 还没到开始时间
      if (days > 0) {
        message = `距离开场时间还剩<span style="color:#F4883A;">${days}天${hours}小时</span>`;
      } else if (hours > 0) {
        message = `距离开场时间还剩<span style="color:#F4883A;">${hours}小时</span>`;
      } else {
        message = `距离开场时间还剩<span style="color:#F4883A;">${minutes}分钟</span>`;
      }
    }

    return message;
  },
  /**
 * 当天显示n小时前，
 * 一天之前显示昨天，
 * 二天显示前天，
 * 二天之后具体日期10-15，过自然年再加上年份2022-10-15
 * @param createTime
 */
  formatDynamicPublishTime(createTime) {
    if (typeof createTime !== 'string') {
      return '无效的日期';
    }

    const now = new Date();
    const createTimeAdjusted = createTime.replace(/-/g, '/'); // Adjust for iOS format
    const publishTime = new Date(createTimeAdjusted);
    const timeDiff = now - publishTime;
    const hoursDiff = Math.floor(timeDiff / (60 * 60 * 1000));
    const daysDiff = Math.floor(hoursDiff / 24);

    if (publishTime.getFullYear() === now.getFullYear() &&
      publishTime.getMonth() === now.getMonth() &&
      publishTime.getDate() === now.getDate()) {
      if (hoursDiff === 0) {
        return `1小时内`;
      }
      return `${hoursDiff}小时前`;
    }

    if (daysDiff === 1) {
      return '昨天';
    } else if (daysDiff === 2) {
      return '前天';
    }

    let date = `${publishTime.getMonth() + 1}-${publishTime.getDate()}`;
    if (publishTime.getFullYear() !== now.getFullYear()) {
      date = `${publishTime.getFullYear()}-${date}`;
    }
    return date;
  },
  formatDate(publishDate) {
    // 将“YYYY-MM-DD HH:MM:SS”替换为IOS可以接受的日期格式
    publishDate = publishDate.replace(/-/g, '/');

    let date = new Date(publishDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;  // getMonth 返回的月份是从0开始的， 所以需要+1
    let day = date.getDate();

    return `${year}.${month < 10 ? '0' + month : month}.${day < 10 ? '0' + day : day}`;
  },
  /**
 * 将数量转换为以千为单位的字符串表示，添加 "k" 后缀
 * @param {number} quantityCount - 待转换的数量
 * @returns {string} 转换后的字符串表示
 */
  quantityTransferThousand(quantityCount) {
    // 如果 quantityCount 为 null 或 undefined，则返回空字符串
    if (quantityCount === null || quantityCount === undefined || quantityCount <= 0) {
      return null;
    }

    // 如果 quantityCount 小于 1000，则直接返回该值
    if (quantityCount < 1000) {
      return quantityCount;
    }

    // 否则，将数量除以 1000 并保留一位小数，然后添加 "k" 后缀
    return (quantityCount / 1000).toFixed(1) + 'k';
  },

  /**
  * 将米转换为千米，添加 "km" 后缀
  * @param {number} meters - 待转换的数量
  * @returns {string} 转换后的字符串表示
  */
  metersTransferThousand(meters) {
    // 如果 quantityCount 为 null 或 undefined，则返回空字符串
    if (!uni.getStorageSync('isLocation') || meters === null || meters === undefined || meters <= 0) {
      return '';
    }

    // 否则，将数量除以 1000 并保留一位小数，然后添加 "km" 后缀
    return (meters / 1000).toFixed(2) + 'km';
  },
  /**
   * 设置单位
   */
  setUnit(value, type){
    if(!value)return "";
    return `${value}${type}`;
  },
  /**
   * 去除单位
   */
  deleteUnit(value, type){
    if(!value)return "";
    return Number(value.replace(type, ''));
  }
};
