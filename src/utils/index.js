import CONF from "@/config";
import api from '@/api'

/**
 * 处理富文本里的图片宽度自适应
 * 1.去掉img标签里的style、width、height属性
 * 2.img标签添加style属性：max-width:100%;height:auto
 * 3.修改所有style里的width属性为max-width:100%
 * 4.去掉<br/>标签
 * @param html
 * @returns {void|string|*}
 */
function formatRichText(html) {
  let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
    match = match.replace(/style="[^"]+"/gi, "").replace(/style='[^']+'/gi, "");
    match = match.replace(/width="[^"]+"/gi, "").replace(/width='[^']+'/gi, "");
    match = match
      .replace(/height="[^"]+"/gi, "")
      .replace(/height='[^']+'/gi, "");
    return match;
  });
  newContent = newContent.replace(/style="[^"]+"/gi, function (match, capture) {
    match = match
      .replace(/width:[^;]+;/gi, "max-width:100%;")
      .replace(/width:[^;]+;/gi, "max-width:100%;");
    return match;
  });
  newContent = newContent.replace(/<br[^>]*\/>/gi, "");
  newContent = newContent.replace(
    /\<img/gi,
    '<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"'
  );
  return newContent;
}

function removeLableAndImage(html) {
  let msg = html.replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, '\n')
    .replace(/<br\/?>/gi, '\n').replace(/<[^>/]+>/g, '')
    .replace(/(\n)?<\/([^>]+)>/g, '').replace(/\u00a0/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/<\/?(img)[^>]*>/gi, '')
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "\'")
    .replace(/&quot;/g, "\"")
    .replace(/<\/?.+?>/g, "")
  return msg
}

// 获取设备状态栏高度
function systemInfo() {
  return new Promise((resolve) => {
    uni.getSystemInfo({
      success: function (res) {
        resolve(res);
      },
    });
  });
}

//获取图片的宽高
function getImageSize(cover) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: "GET",
      url: `${cover}?x-oss-process=image/info`,
      complete: function complete(response) {
        resolve(response.data);
      },
      fail(e) {
        reject(e)
      },
    });
  })
}

//获取视频的宽高
function getVideoSize(cover) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await api.detectMediaMeta({ url: cover });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  })
}

// 获取页面高度
function windowHeight() {
  return new Promise((resolve) => {
    uni.getSystemInfo({
      success: function (res) {
        resolve(Math.max(res.windowHeight, res.windowWidth));
      },
    });
  });
}

// 获取页面宽度
function windowWidth() {
  return new Promise((resolve) => {
    uni.getSystemInfo({
      success: function (res) {
        resolve(res.windowWidth);
      },
    });
  });
}

// 获取导航栏高度
function titleBarHeight() {
  return new Promise((resolve) => {
    uni.getSystemInfo({
      success: function (res) {
        if (res.model.indexOf("iPhone") !== -1) {
          resolve(44);
        } else {
          resolve(48);
        }
      },
    });
  });
}

// 获取设备状态栏高度
function starBarHeight() {
  return new Promise((resolve) => {
    uni.getSystemInfo({
      success: function (res) {
        resolve(res.statusBarHeight);
      },
    });
  });
}


// 获取设备安全高度
function safeHeight() {
  return new Promise((resolve) => {
    uni.getSystemInfo({
      success: function (res) {
        resolve(Math.max(res.windowHeight, res.windowWidth) - res.safeArea.height - res.statusBarHeight);
      },
    });
  });
}

function safeBottom() {
  return new Promise((resolve) => {
    uni.getSystemInfo({
      success: function (res) {
        console.log(res)
        resolve(res.windowHeight - res.safeArea.bottom);
      },
    });
  });
}


// 获取设备安全距顶
function safeTop() {
  return new Promise((resolve) => {
    const rect = wx.getMenuButtonBoundingClientRect();
    resolve(rect.top);
  });
}

//获取胶囊的rect参数
function getMenuButtonRect() {
  return new Promise((resolve) => {
    const rect = wx.getMenuButtonBoundingClientRect();
    resolve(rect);
  });
}


function getdate(n) {
  var n = n;
  var myDate = new Date(new Date().setHours(0, 0, 0, 0));
  var year = myDate.getFullYear();
  var month = myDate.getMonth() + 1;
  var day = myDate.getDate();
  if (day <= n) {
    if (month > 1) {
      month = month - 1;
    } else {
      year = year - 1;
      month = 12;
    }
  }
  myDate.setDate(myDate.getDate() - n);
  year = myDate.getFullYear();
  month = myDate.getMonth() + 1;
  day = myDate.getDate();
  let appointDate =
    year +
    "-" +
    (month < 10 ? "0" + month : month) +
    "-" +
    (day < 10 ? "0" + day : day);
  // return new Date(appointDate).setHours(0, 0, 0, 0);
  return new Date(
    new Date(appointDate).setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1
  ); //到第13天的23分59秒
}

function uploadFile(url) {
  return new Promise((resolve, reject) => {
    const tokenValue = `Bearer ${JSON.parse(wx.getStorageSync("SID")).tokenValue}`;

    uni.uploadFile({
      url: CONF.baseURL + "/api/file/upload",
      filePath: url,
      name: "file",
      header: {
        "Authorization-user": tokenValue,
      },
      success: async (res) => {
        let response = JSON.parse(res.data);

        if (response.code === 200) {
          try {
            //校验图片是否违规
            let data = await api.riskCheckContent({ fileList: [response.data.fileUrl] });
            if (data) {
              resolve(response.data.fileUrl);
            }
          } catch (e) { }
        }
      },
    });
  });
}
function uploadMultipleFiles(filePaths) {
  console.log('uploadMultipleFiles called'); // 确认调用了函数
  return new Promise((resolve, reject) => {
    const tokenValue = `Bearer ${JSON.parse(uni.getStorageSync("SID")).tokenValue}`;
    let uploadedFiles = []; // 存储上传成功的文件信息

    // 使用递归函数处理队列上传
    const uploadNext = (index) => {
      if (index < filePaths.length) {
        const filePath = filePaths[index];

        // 读取文件的二进制数据
        uni.getFileSystemManager().readFile({
          filePath: filePath,
          success: (res) => {
            // 使用 uni.uploadFile 上传二进制数据
            uni.uploadFile({
              url: CONF.baseURL + "/api/file/uploadFiles",
              filePath: filePath,
              name: 'multipartFiles', // 后端期望的字段名
              header: {
                "Authorization-user": tokenValue,
              },
              formData: {
                // 如果需要传递其他表单数据，可以在这里添加
              },
              success: async (uploadRes) => {
                try {
                  let response = JSON.parse(uploadRes.data);
                  //校验图片是否违规
                  let data = await api.riskCheckContent({ fileList: [response.data[0].fileUrl] });
                  if (data) {
                    if (response.code === 200) {
                      uploadedFiles.push(...response.data); // 添加成功上传的文件
                      uploadNext(index + 1); // 上传下一个文件
                    }
                  }
                } catch (e) { 
                  reject(new Error(e)); // 处理错误消息
                }
              },
              fail: (uploadErr) => {
                reject(uploadErr); // 上传过程中发生的错误
              }
            });
          },
          fail: (readErr) => {
            reject(readErr); // 读取文件二进制数据失败
          }
        });
      } else {
        console.log('uploadedFiles:', uploadedFiles); // 所有文件处理完毕
        resolve(uploadedFiles); // 全部上传完毕，返回上传成功的文件信息数组
      }
    };

    // 开始上传队列
    uploadNext(0);
  });
}
//校验内容是否违规
function checkContent(content) {
  return new Promise(async (resolve, reject) => {
    try {
      await api.riskCheckContent({ content });
      resolve();
    } catch (e) {
      reject(e)
    }
  })
}

//定向返回开本列表页面
function backMurderMysteryList() {
  let idx = getCurrentPages().findIndex(
    (i) => i.$page.fullPath === "/murderMysteryList/pages/index"
  );
  if (idx !== -1) {
    let delta = getCurrentPages().length - idx - 1;
    uni.navigateBack({
      delta,
    });
  } else {
    uni.switchTab({
      url: "/pages/index/index",
    });
  }
}

//判断是图片还是视频格式
function judgeMediaType(fileName) {
  // 后缀获取
  var suffix = ''
  // 获取类型结果
  var result = ''
  try {
    var flieArr = fileName.split('.')
    suffix = flieArr[flieArr.length - 1]
  } catch (err) {
    suffix = ''
  }
  // fileName无后缀返回 false
  if (!suffix) {
    result = false
    return result
  }
  // 图片格式
  var imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp']
  // 进行图片匹配
  result = imglist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'image'
    return result
  }
  // 匹配txt
  var txtlist = ['txt']
  result = txtlist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'txt'
    return result
  }
  // 匹配 excel
  var excelist = ['xls', 'xlsx']
  result = excelist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'excel'
    return result
  }
  // 匹配 word
  var wordlist = ['doc', 'docx']
  result = wordlist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'word'
    return result
  }
  // 匹配 pdf
  var pdflist = ['pdf']
  result = pdflist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'pdf'
    return result
  }
  // 匹配 ppt
  var pptlist = ['ppt']
  result = pptlist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'ppt'
    return result
  }
  // 匹配 视频
  var videolist = ['mp4', 'm2v', 'mkv']
  result = videolist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'video'
    return result
  }
  // 匹配 音频
  var radiolist = ['mp3', 'wav', 'wmv']
  result = radiolist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'radio'
    return result
  }
  // 其他 文件类型
  result = 'other'
  return result
}

 //取色
 function getColor(url) {
  return new Promise(async(resolve, reject) => {
    try{
      let res = await api.getCoverMainColor({str: url});
      resolve(hexToRgb(res.coverMainColor));
    }catch(e){
      reject(e)
    }
  });
}

function hexToRgb(hex) {
  // 去除前导符号"#"
  var color = hex.replace("#", "");
  
  // 分割成红、绿、蓝三部分
  var red = parseInt(color.substring(0,2),16);
  var green = parseInt(color.substring(2,4),16);
  var blue = parseInt(color.substring(4,6),16);
  
  return `${red}, ${green}, ${blue}`;
}

module.exports = {
  systemInfo,
  formatRichText,
  titleBarHeight,
  starBarHeight,
  windowWidth,
  windowHeight,
  safeHeight,
  getdate,
  safeTop,
  uploadFile,
  uploadMultipleFiles,
  backMurderMysteryList,
  safeBottom,
  getMenuButtonRect,
  judgeMediaType,
  removeLableAndImage,
  getImageSize,
  getVideoSize,
  checkContent,
  getColor
};
